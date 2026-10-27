import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { Icon } from '@/components/ui/Icon';
import { relativeTime } from '@/lib/relativeTime';
import type { ChapterRow as ChapterRowData } from '@/data/chapterRepository';
import type { DownloadEntry } from '@/downloads/types';

/** Download state and action for one row; omitted where downloads aren't offered. */
export interface RowDownload {
  entry?: DownloadEntry;
  onPress: () => void;
}

// Ported from desktop-frames-2.jsx `ChapterList` row (fixed-column table)
// and mobile-frames.jsx's condensed row (stacked). Read/current-chapter
// state is dropped here — that's real per-user `reading_progress`, which
// needs auth (task: Auth screens) before it can be honest instead of mocked.
export function ChapterRowDesktop({ seriesId, chapter, download }: { seriesId: number; chapter: ChapterRowData; download?: RowDownload }) {
  const { theme } = useMangaTheme();
  const router = useRouter();
  return (
    <Pressable
      style={[styles.desktopRow, { borderBottomColor: theme.colors.border }]}
      onPress={() => router.push(`/reader/${seriesId}-${chapter.number}`)}
    >
      <Text style={{ width: 60, fontFamily: theme.displayFont, fontWeight: '700', fontSize: 13, color: theme.colors.text }}>
        Ch. {chapter.number}
      </Text>
      <Text style={{ flex: 1, fontFamily: theme.bodyFont, fontWeight: '500', fontSize: 13.5, color: theme.colors.text }} numberOfLines={1}>
        {chapter.pageCount} pages
      </Text>
      <Text style={{ width: 90, fontFamily: 'JetBrainsMono_500Medium', fontSize: 11.5, color: theme.colors.text3 }}>
        {relativeTime(chapter.publishedAt)}
      </Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <DownloadButton chapter={chapter} download={download} size={14} />
        <Icon name="bookmark" size={14} color={theme.colors.text3} />
      </View>
    </Pressable>
  );
}

export function ChapterRowMobile({ seriesId, chapter, download }: { seriesId: number; chapter: ChapterRowData; download?: RowDownload }) {
  const { theme } = useMangaTheme();
  const router = useRouter();
  return (
    <Pressable
      style={[styles.mobileRow, { borderBottomColor: theme.colors.border }]}
      onPress={() => router.push(`/reader/${seriesId}-${chapter.number}`)}
    >
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 13.5, color: theme.colors.text }}>
          Ch. {chapter.number}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 5 }}>
          <Text style={{ fontFamily: theme.bodyFont, fontSize: 11, color: theme.colors.text3 }}>{relativeTime(chapter.publishedAt)}</Text>
          <Text style={{ fontFamily: theme.bodyFont, fontSize: 11, color: theme.colors.text3 }}>·</Text>
          <Text style={{ fontFamily: theme.bodyFont, fontSize: 11, color: theme.colors.text3 }}>{chapter.pageCount} pages</Text>
        </View>
      </View>
      <DownloadButton chapter={chapter} download={download} size={16} />
    </Pressable>
  );
}

// Only chapters the fetcher has mirrored can be downloaded; the rest show a
// dimmed icon. Downloaded: a check. In progress: the percentage. Failed: a red
// icon that retries on tap.
function DownloadButton({ chapter, download, size }: { chapter: ChapterRowData; download?: RowDownload; size: number }) {
  const { theme } = useMangaTheme();
  const entry = download?.entry;

  if (entry?.state === 'done') {
    return (
      <View accessibilityLabel={`Chapter ${chapter.number} downloaded`}>
        <Icon name="check" size={size} color={theme.accent} />
      </View>
    );
  }
  if (entry?.state === 'downloading') {
    return (
      <Text style={{ minWidth: size + 14, textAlign: 'right', fontFamily: 'JetBrainsMono_500Medium', fontSize: 10.5, color: theme.accent }}>
        {Math.round(entry.progress * 100)}%
      </Text>
    );
  }

  const enabled = download != null && chapter.fetcherStatus === 'available';
  const failed = entry?.state === 'error';
  return (
    <Pressable
      onPress={download?.onPress}
      disabled={!enabled}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={failed ? `Retry downloading chapter ${chapter.number}` : `Download chapter ${chapter.number}`}
      style={{ opacity: enabled ? 1 : 0.35 }}
    >
      <Icon name="download" size={size} color={failed ? '#ff6b81' : enabled ? theme.colors.text2 : theme.colors.text3} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  desktopRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  mobileRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1 },
});
