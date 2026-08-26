import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { Icon } from '@/components/ui/Icon';
import { relativeTime } from '@/lib/relativeTime';
import type { ChapterRow as ChapterRowData } from '@/data/chapterRepository';

// Ported from desktop-frames-2.jsx `ChapterList` row (fixed-column table)
// and mobile-frames.jsx's condensed row (stacked). Read/current-chapter
// state is dropped here — that's real per-user `reading_progress`, which
// needs auth (task: Auth screens) before it can be honest instead of mocked.
export function ChapterRowDesktop({ seriesId, chapter }: { seriesId: number; chapter: ChapterRowData }) {
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
        <Icon name="download" size={14} color={theme.colors.text3} />
        <Icon name="bookmark" size={14} color={theme.colors.text3} />
      </View>
    </Pressable>
  );
}

export function ChapterRowMobile({ seriesId, chapter }: { seriesId: number; chapter: ChapterRowData }) {
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
      <Icon name="download" size={16} color={theme.colors.text3} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  desktopRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  mobileRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1 },
});
