import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, Pressable, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { useReaderSettings } from '@/theme/useReaderSettings';
import { GAP_PX } from '@/theme/readerSettings';
import { ReaderPage } from '@/components/reader/ReaderPage';
import { ChapterStatusCard } from '@/components/reader/ChapterStatusCard';
import { ReaderTopChrome, ReaderBottomChrome, ChapterPicker } from '@/components/reader/ReaderChrome';
import { ChapterSeam, NextChapterStrip } from '@/components/reader/ChapterSeam';
import { ReaderSettingsSheet } from '@/components/reader/ReaderSettingsSheet';
import { InlineReaderAd, ChapterBreakAd } from '@/components/monetization/AdSlot';
import { useEntitlement } from '@/monetization/useEntitlement';
import { shouldShowInlineAd, shouldShowChapterBreakAd } from '@/monetization/adCadence';
import { fetchChapters, fetchSeriesById } from '@/data/chapterRepository';
import { seriesById } from '@/data/mockSeries';
import { useChapterPages, type ChapterPagesState } from '@/hooks/useChapterPages';
import type { ReaderPage as PageImage } from '@/data/pageRepository';
import type { Series } from '@/data/types';
import type { PageFit } from '@/theme/readerSettings';

// Route param is `<seriesId>-<chapterNumber>` (see how Home/Series link in).
// Chapter numbers can be decimal (150.5), which survives the split on '-'.
function parseChapterId(raw: string | undefined): { seriesId: number; chapter: number } {
  const [s, c] = (raw ?? '').split('-');
  return { seriesId: Number(s) || 1, chapter: Number(c) || 1 };
}

// Placeholder mode only (Supabase not configured): page count is
// deterministic per chapter so totals stay stable across re-renders.
function placeholderPageCount(chapter: number) {
  return 20 + (Math.floor(chapter) % 15);
}

/** Pages to lay out: real images when available, placeholders in offline UI mode. */
function layoutPages(state: ChapterPagesState, chapter: number): (PageImage | undefined)[] | null {
  if (state.status === 'available') return state.pages;
  if (state.status === 'placeholder') return Array.from({ length: placeholderPageCount(chapter) }, () => undefined);
  return null;
}

// Height of one page. "fit width" keeps each page's own aspect ratio (real
// pages vary; placeholders use the 1.4 portrait default), "fit height" fills
// the viewport, "original" is natural size, shrunk only to fit the width.
function pageHeightFor(page: PageImage | undefined, fit: PageFit, width: number, viewportHeight: number) {
  const ratio = page?.width && page?.height ? page.height / page.width : 1.4;
  if (fit === 'height') return viewportHeight;
  if (fit === 'original') return page?.width && page?.height ? Math.round(page.height * Math.min(1, width / page.width)) : 520;
  return Math.round(width * ratio);
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

  const [series, setSeries] = useState<Series | undefined>(() => seriesById(parsed.seriesId));
  // Real chapter numbers, ascending. They can skip and be decimal, so
  // next/prev are neighbours in this list, never chapter ± 1.
  const [chapterNumbers, setChapterNumbers] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchSeriesById(parsed.seriesId).then((s) => !cancelled && s && setSeries(s));
    fetchChapters(parsed.seriesId).then((rows) => {
      if (!cancelled) setChapterNumbers(rows.map((r) => r.number).sort((a, b) => a - b));
    });
    return () => {
      cancelled = true;
    };
  }, [parsed.seriesId]);

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

  // The route can name a chapter the list doesn't hold yet (still loading,
  // or the placeholder list only covers recent chapters); keep it navigable.
  const numbers = useMemo(
    () => (chapterNumbers.includes(chapter) ? chapterNumbers : [...chapterNumbers, chapter].sort((a, b) => a - b)),
    [chapterNumbers, chapter]
  );
  const position = numbers.indexOf(chapter);
  const prevChapter = position > 0 ? numbers[position - 1] : null;
  const nextChapter = position >= 0 && position < numbers.length - 1 ? numbers[position + 1] : null;
  const totalChapters = numbers.length;

  const current = useChapterPages(parsed.seriesId, chapter);
  // Preloaded so seamless continue and the Next button show pages at once.
  const upcoming = useChapterPages(parsed.seriesId, nextChapter);

  const viewportHeight = viewportH.current || height;
  const pages = useMemo(() => layoutPages(current.state, chapter), [current.state, chapter]);
  const pageCount = pages?.length ?? 0;
  const heights = useMemo(
    () => (pages ?? []).map((p) => pageHeightFor(p, settings.fit, width, viewportHeight)),
    [pages, settings.fit, width, viewportHeight]
  );
  const upcomingPages = useMemo(
    () => (nextChapter == null ? null : layoutPages(upcoming.state, nextChapter)),
    [upcoming.state, nextChapter]
  );

  // Stitch the next chapter only when both sides have pages to show; a seam
  // into a "still preparing" card would commit into nothing.
  const seamlessActive = settings.mode === 'vertical' && settings.seamless && pages != null && upcomingPages != null;

  const gap = GAP_PX[settings.gap];
  // Top offset of each page, for working out the current page from scroll.
  const pageTops = useMemo(() => {
    const tops: number[] = [];
    let y = 0;
    for (const h of heights) {
      tops.push(y);
      y += h + gap;
    }
    return tops;
  }, [heights, gap]);

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
    (n: number | null) => {
      if (n == null || !numbers.includes(n)) return;
      // Moving forward means the chapter just left was finished.
      if (n > chapter) creditChapter(chapter);
      setChapter(n);
      setPage(1);
      setPull(0);
      setPickerOpen(false);
      lastY.current = 0;
      seamY.current = 0;
      stitchY.current = 0;
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      // Keep the URL honest so refresh/back lands on the chapter being read.
      router.setParams({ chapterId: `${parsed.seriesId}-${n}` });
    },
    [numbers, parsed.seriesId, router, chapter, creditChapter]
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

      // Current page: the last page whose top has reached the viewport top.
      // Pages differ in height, so this walks real offsets, not y / height.
      let current = 0;
      while (current + 1 < pageTops.length && pageTops[current + 1] <= y) current++;
      setPage(Math.max(1, Math.min(pageCount, current + 1)));

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
      // stay exactly where they are on screen — the swap is invisible. The
      // next chapter's pages are already cached by the `upcoming` preload,
      // so the swapped-in chapter renders them on its first frame.
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
    [chromeVisible, pageTops, pageCount, seamlessActive, nextChapter, parsed.seriesId, router, chapter, creditChapter]
  );

  const toggleChrome = useCallback(() => {
    setChromeVisible((v) => !v);
    setPickerOpen(false);
  }, []);

  // Newest first, a window around the current chapter: two ahead, nine back.
  const pickerChapters = useMemo(() => {
    if (position < 0) return [chapter];
    return numbers.slice(Math.max(0, position - 9), position + 3).reverse();
  }, [numbers, position, chapter]);

  const dimOpacity = 1 - settings.brightness / 100;
  const chapterKey = `${parsed.seriesId}-${chapter}`;

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
          {pages == null ? (
            <ChapterStatusCard
              state={current.state as Exclude<ChapterPagesState, { status: 'available' } | { status: 'placeholder' }>}
              chapter={chapter}
              height={viewportHeight}
              onRetry={current.refresh}
            />
          ) : (
            pages.map((image, i) => (
              <View key={`${chapter}-${i}`} style={{ marginBottom: i === pageCount - 1 ? 0 : gap }}>
                <ReaderPage chapterKey={chapterKey} index={i} height={heights[i]} image={image} onError={current.refresh} />
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
            ))
          )}
        </Pressable>

        {/* Chapter-break slot: the highest-value placement, at a natural
            pause, and inside the seam so seamless-continue still works. */}
        {pages != null && shouldShowChapterBreakAd({ premium, chaptersRead, isDownloaded: false }) && <ChapterBreakAd />}

        <View onLayout={(e) => (seamY.current = e.nativeEvent.layout.y)}>
          <ChapterSeam
            chapter={chapter}
            prevChapter={prevChapter}
            nextChapter={nextChapter}
            lastChapter={numbers[numbers.length - 1] ?? chapter}
            pull={pull}
            seamless={seamlessActive}
            onPrev={() => goToChapter(prevChapter)}
            onNext={() => goToChapter(nextChapter)}
          />
        </View>

        {/* Stitched next chapter — the seamless handoff. Enough pages are
            rendered that scrolling continues naturally past the seam; once
            the stitched pages reach the top of the viewport the commit
            swaps them in as the active chapter and rebases the scroll, so
            the swap is invisible and the next seam builds below. */}
        {seamlessActive && nextChapter != null && upcomingPages != null && (
          <View onLayout={(e) => (stitchY.current = e.nativeEvent.layout.y)}>
            <NextChapterStrip chapter={nextChapter} pageCount={upcomingPages.length} />
            {upcomingPages.slice(0, STITCHED_PAGES).map((image, i) => (
              <View key={`next-${nextChapter}-${i}`} style={{ marginBottom: gap }}>
                <ReaderPage
                  chapterKey={`${parsed.seriesId}-${nextChapter}`}
                  index={i}
                  height={pageHeightFor(image, settings.fit, width, viewportHeight)}
                  image={image}
                  onError={upcoming.refresh}
                />
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
        subtitle={
          pull >= 1 && nextChapter != null
            ? `Chapter ${nextChapter} · pg 1 of ${upcomingPages?.length ?? 0}`
            : pageCount > 0
              ? `pg ${page} of ${pageCount}`
              : ' '
        }
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
        prevChapter={prevChapter}
        nextChapter={nextChapter}
        lastChapter={numbers[numbers.length - 1] ?? chapter}
        pickerOpen={pickerOpen}
        onTogglePicker={() => setPickerOpen((o) => !o)}
        onPrev={() => goToChapter(prevChapter)}
        onNext={() => goToChapter(nextChapter)}
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
