import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, Pressable, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { useReaderSettings } from '@/theme/useReaderSettings';
import { GAP_PX } from '@/theme/readerSettings';
import { ReaderPage } from '@/components/reader/ReaderPage';
import { ReaderTopChrome, ReaderBottomChrome, ChapterPicker } from '@/components/reader/ReaderChrome';
import { ChapterSeam, NextChapterStrip } from '@/components/reader/ChapterSeam';
import { ReaderSettingsSheet } from '@/components/reader/ReaderSettingsSheet';
import { InlineReaderAd, ChapterBreakAd } from '@/components/monetization/AdSlot';
import { useEntitlement } from '@/monetization/useEntitlement';
import { shouldShowInlineAd, shouldShowChapterBreakAd } from '@/monetization/adCadence';
import { seriesById } from '@/data/mockSeries';

// Route param is `<seriesId>-<chapterNumber>` (see how Home/Series link in).
function parseChapterId(raw: string | undefined): { seriesId: number; chapter: number } {
  const [s, c] = (raw ?? '').split('-');
  return { seriesId: Number(s) || 1, chapter: Number(c) || 1 };
}

// Page count is deterministic per chapter so page totals stay stable across
// re-renders and match what the series screen advertised.
function pageCountFor(chapter: number) {
  return 20 + (chapter % 15);
}

const SCROLL_HIDE_THRESHOLD = 6;

// How many of the next chapter's pages are stitched below the seam. Must be
// enough to overfill the tallest viewport, otherwise the stitched block can
// never reach the top of the screen and the seamless commit never fires.
const STITCHED_PAGES = 3;

export default function ReaderScreen() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const parsed = parseChapterId(chapterId);
  const { theme } = useMangaTheme();
  const { settings, update } = useReaderSettings();
  const { premium, chaptersRead, recordChapterRead } = useEntitlement();
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const series = seriesById(parsed.seriesId);
  const totalChapters = series?.chapters ?? 1;

  const [chapter, setChapter] = useState(parsed.chapter);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pull, setPull] = useState(0);

  const scrollRef = useRef<ScrollView>(null);
  const lastY = useRef(0);
  const seamY = useRef(0);
  const stitchY = useRef(0);
  const viewportH = useRef(height);
  // Guards the seamless swap from re-entering on the scroll events that the
  // rebase itself emits.
  const committing = useRef(false);

  const pageCount = pageCountFor(chapter);
  const nextChapter = chapter < totalChapters ? chapter + 1 : null;
  const seamlessActive = settings.mode === 'vertical' && settings.seamless;

  // Page height: "fit width" keeps the source's 3:2-ish portrait ratio,
  // "fit height" fills the viewport, "original" uses a fixed nominal size.
  const pageHeight = useMemo(() => {
    if (settings.fit === 'height') return viewportH.current || height;
    if (settings.fit === 'original') return 520;
    return Math.round(width * 1.4);
  }, [settings.fit, width, height]);

  // Chapters only count once each — otherwise paging back and forth would
  // farm XP. Session-scoped, since the durable record belongs in
  // `reading_progress` once auth-backed sync lands.
  const creditedChapters = useRef<Set<number>>(new Set());
  const creditChapter = useCallback(
    (n: number) => {
      if (creditedChapters.current.has(n)) return;
      creditedChapters.current.add(n);
      recordChapterRead();
    },
    [recordChapterRead]
  );

  const goToChapter = useCallback(
    (n: number) => {
      const clamped = Math.max(1, Math.min(totalChapters, n));
      // Moving forward means the chapter just left was finished.
      if (clamped > chapter) creditChapter(chapter);
      setChapter(clamped);
      setPage(1);
      setPull(0);
      setPickerOpen(false);
      lastY.current = 0;
      seamY.current = 0;
      stitchY.current = 0;
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      // Keep the URL honest so refresh/back lands on the chapter being read.
      router.setParams({ chapterId: `${parsed.seriesId}-${clamped}` });
    },
    [totalChapters, parsed.seriesId, router, chapter, creditChapter]
  );

  // Reset when navigated to a different chapter from outside.
  useEffect(() => {
    setChapter(parsed.chapter);
  }, [parsed.chapter]);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, layoutMeasurement } = e.nativeEvent;
      const y = contentOffset.y;
      viewportH.current = layoutMeasurement.height;

      // Scrolling down hides the chrome (and any open picker) — from
      // chats/chat2.md: "when scrolling down the overlay goes hidden".
      if (y - lastY.current > SCROLL_HIDE_THRESHOLD && chromeVisible) {
        setChromeVisible(false);
        setPickerOpen(false);
      }
      lastY.current = y;

      // Current page from scroll position through the page stack.
      const gap = GAP_PX[settings.gap];
      const per = pageHeight + gap;
      setPage(Math.max(1, Math.min(pageCount, Math.floor(y / per) + 1)));

      // Pull-to-continue: how far the seam has travelled up the viewport.
      // Rebased on the seam's real offset, as the design's own fix did.
      if (seamlessActive && seamY.current > 0) {
        const start = seamY.current - layoutMeasurement.height + 300;
        const end = seamY.current + 320 - layoutMeasurement.height * 0.55;
        const p = Math.max(0, Math.min(1, (y - start) / Math.max(1, end - start)));
        setPull(p);
      }

      // Commit the handoff: once the stitched page's top passes the viewport
      // top, the reader is genuinely in the next chapter. Swap chapter state
      // and rebase the scroll by the stitched region's offset so the pages
      // stay exactly where they are on screen — the swap is invisible.
      if (seamlessActive && nextChapter != null && stitchY.current > 0 && y >= stitchY.current && !committing.current) {
        committing.current = true;
        const carry = y - stitchY.current;
        // Scrolling clean through the seam is the truest signal a chapter
        // was actually finished.
        creditChapter(chapter);
        setChapter(nextChapter);
        setPull(0);
        seamY.current = 0;
        stitchY.current = 0;
        lastY.current = carry;
        scrollRef.current?.scrollTo({ y: carry, animated: false });
        router.setParams({ chapterId: `${parsed.seriesId}-${nextChapter}` });
        requestAnimationFrame(() => {
          committing.current = false;
        });
      }
    },
    [chromeVisible, pageHeight, pageCount, settings.gap, seamlessActive, nextChapter, parsed.seriesId, router, chapter, creditChapter]
  );

  const toggleChrome = useCallback(() => {
    setChromeVisible((v) => !v);
    setPickerOpen(false);
  }, []);

  const pickerChapters = useMemo(() => {
    const out: number[] = [];
    for (let n = Math.min(totalChapters, chapter + 2); n >= Math.max(1, chapter - 9); n--) out.push(n);
    return out;
  }, [chapter, totalChapters]);

  const gap = GAP_PX[settings.gap];
  const dimOpacity = 1 - settings.brightness / 100;

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        <Pressable onPress={toggleChrome}>
          {Array.from({ length: pageCount }, (_, i) => (
            <View key={`${chapter}-${i}`} style={{ marginBottom: i === pageCount - 1 ? 0 : gap }}>
              <ReaderPage chapterKey={`${parsed.seriesId}-${chapter}`} index={i} height={pageHeight} />
              {/* Inline ad slots sit between pages, never over art, and are
                  gated by the cadence rules (4 pages apart, 90s apart, none
                  for premium or in a new reader's first chapter). */}
              {shouldShowInlineAd({
                pageIndex: i,
                premium,
                chaptersRead,
                isDownloaded: false,
                lastAdAt: 0,
              }) && <InlineReaderAd />}
            </View>
          ))}
        </Pressable>

        {/* Chapter-break slot: the highest-value placement, at a natural
            pause, and inside the seam so seamless-continue still works. */}
        {shouldShowChapterBreakAd({ premium, chaptersRead, isDownloaded: false }) && <ChapterBreakAd />}

        <View onLayout={(e) => (seamY.current = e.nativeEvent.layout.y)}>
          <ChapterSeam
            chapter={chapter}
            nextChapter={nextChapter}
            totalChapters={totalChapters}
            pull={pull}
            seamless={seamlessActive}
            onPrev={() => goToChapter(chapter - 1)}
            onNext={() => nextChapter && goToChapter(nextChapter)}
          />
        </View>

        {/* Stitched next chapter — the seamless handoff. Enough pages are
            rendered that scrolling continues naturally past the seam; once
            the stitched pages reach the top of the viewport the commit
            swaps them in as the active chapter and rebases the scroll, so
            the swap is invisible and the next seam builds below. */}
        {seamlessActive && nextChapter != null && (
          <View onLayout={(e) => (stitchY.current = e.nativeEvent.layout.y)}>
            <NextChapterStrip chapter={nextChapter} pageCount={pageCountFor(nextChapter)} />
            {Array.from({ length: STITCHED_PAGES }, (_, i) => (
              <View key={`next-${nextChapter}-${i}`} style={{ marginBottom: gap }}>
                <ReaderPage chapterKey={`${parsed.seriesId}-${nextChapter}`} index={i} height={pageHeight} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Brightness dim — a non-interactive scrim over the pages only. */}
      {dimOpacity > 0 && (
        <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: `rgba(0,0,0,${dimOpacity})` }} />
      )}

      <ReaderTopChrome
        visible={chromeVisible}
        seriesTitle={series?.title ?? 'Unknown series'}
        chapterNumber={pull >= 1 && nextChapter != null ? nextChapter : chapter}
        subtitle={pull >= 1 && nextChapter != null ? `Chapter ${nextChapter} · pg 1 of ${pageCountFor(nextChapter)}` : `pg ${page} of ${pageCount}`}
        onBack={() => router.back()}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <ChapterPicker
        visible={chromeVisible && pickerOpen}
        chapters={pickerChapters}
        current={chapter}
        totalChapters={totalChapters}
        onSelect={goToChapter}
        bottomOffset={132}
      />

      <ReaderBottomChrome
        visible={chromeVisible}
        page={page}
        pageCount={pageCount}
        chapter={chapter}
        totalChapters={totalChapters}
        pickerOpen={pickerOpen}
        onTogglePicker={() => setPickerOpen((o) => !o)}
        onPrev={() => goToChapter(chapter - 1)}
        onNext={() => goToChapter(chapter + 1)}
      />

      <ReaderSettingsSheet
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onChange={update}
        seriesTitle={series?.title ?? ''}
        chapterNumber={chapter}
      />
    </View>
  );
}
