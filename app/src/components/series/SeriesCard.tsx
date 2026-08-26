import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { CoverImage } from '@/components/ui/CoverImage';
import { Stars } from '@/components/ui/Stars';
import { useMangaTheme } from '@/theme/ThemeProvider';
import type { Series } from '@/data/types';

// Ported from desktop-frames.jsx `CoverGrid` item / mobile-frames.jsx
// trending card — cover + title + rating + primary tag, with optional rank
// medallion (Top this week) or a badge burned into the cover (Hot/New).
export function SeriesCard({
  series,
  width,
  badge,
  rank,
  starSize = 10,
  showTag = true,
}: {
  series: Series;
  width: number;
  badge?: string | null;
  rank?: number;
  starSize?: number;
  showTag?: boolean;
}) {
  const { theme } = useMangaTheme();
  const router = useRouter();

  return (
    <Pressable style={{ width }} onPress={() => router.push(`/series/${series.id}`)}>
      <View>
        <CoverImage title={series.title} file={series.coverFile} badge={badge ?? undefined} />
        {rank != null && (
          <View
            style={{
              position: 'absolute',
              left: -6,
              top: -6,
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: theme.colors.bg,
              borderWidth: 2,
              borderColor: theme.accent,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 13, color: theme.accent }}>
              {rank}
            </Text>
          </View>
        )}
      </View>
      <Text
        numberOfLines={2}
        style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 13, color: theme.colors.text, marginTop: 8, letterSpacing: -0.1 }}
      >
        {series.title}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
        <Stars value={series.rating} size={starSize} />
        {showTag && series.tags[0] && (
          <>
            <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: theme.colors.text4 }} />
            <Text style={{ fontFamily: theme.bodyFont, fontSize: 11, color: theme.colors.text3 }}>{series.tags[0]}</Text>
          </>
        )}
      </View>
    </Pressable>
  );
}
