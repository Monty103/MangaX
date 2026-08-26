import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { CoverImage } from '@/components/ui/CoverImage';
import { useMangaTheme } from '@/theme/ThemeProvider';
import type { Series } from '@/data/types';

export interface ContinueEntry {
  series: Series;
  lastChapter: number;
  progress: number; // 0..1
}

// Ported from desktop-frames.jsx `ContinueRow` card (row layout: cover left,
// text+progress right, inside a bordered surface tile) and the mobile
// scroll-row equivalent (column layout: cover on top, text below).
export function ContinueCard({
  entry,
  width,
  layout,
}: {
  entry: ContinueEntry;
  width: number;
  layout: 'row' | 'column';
}) {
  const { theme } = useMangaTheme();
  const router = useRouter();
  const { series, lastChapter, progress } = entry;
  const pct = Math.round(progress * 100);

  if (layout === 'row') {
    return (
      <Pressable
        style={{
          width,
          flexDirection: 'row',
          gap: 12,
          padding: 12,
          backgroundColor: theme.colors.surface,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
        onPress={() => router.push(`/series/${series.id}`)}
      >
        <CoverImage title={series.title} file={series.coverFile} label="" style={{ width: 60, height: 84, flexShrink: 0 }} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={2}
            style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 13, color: theme.colors.text, letterSpacing: -0.1 }}
          >
            {series.title}
          </Text>
          <Text style={{ fontFamily: theme.bodyFont, fontSize: 11, color: theme.colors.text3, marginTop: 4 }}>
            Ch. {lastChapter} of {series.chapters}
          </Text>
          <View style={{ height: 3, backgroundColor: theme.colors.surface3, borderRadius: 2, marginTop: 12, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: `${pct}%`, backgroundColor: theme.accent }} />
          </View>
          <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 10, color: theme.colors.text4, marginTop: 6 }}>{pct}%</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable style={{ width }} onPress={() => router.push(`/series/${series.id}`)}>
      <CoverImage title={series.title} file={series.coverFile} style={{ width, height: width * 1.415 }} />
      <Text
        numberOfLines={1}
        style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 12, color: theme.colors.text, marginTop: 6 }}
      >
        {series.title}
      </Text>
      <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 10, color: theme.colors.text3, marginTop: 4 }}>
        Ch. {lastChapter}/{series.chapters}
      </Text>
      <View style={{ height: 2, backgroundColor: theme.colors.surface3, borderRadius: 1, marginTop: 6, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${pct}%`, backgroundColor: theme.accent }} />
      </View>
    </Pressable>
  );
}
