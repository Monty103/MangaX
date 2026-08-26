import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { CoverImage } from '@/components/ui/CoverImage';
import { useMangaTheme } from '@/theme/ThemeProvider';
import type { Series } from '@/data/types';

export interface UpdateEntry {
  series: Series;
  ago: string;
  chapter: number;
  fresh?: boolean;
  isNew?: boolean;
}

// Ported from desktop-frames.jsx `LatestUpdatedSection` card / the mobile
// equivalent — cover with a chapter-number + relative-time strip burned
// into the bottom, a NEW badge on the freshest drops, newest first.
export function UpdateCard({ entry, width, showAuthor = true }: { entry: UpdateEntry; width: number; showAuthor?: boolean }) {
  const { theme } = useMangaTheme();
  const router = useRouter();
  const { series, ago, chapter, fresh, isNew } = entry;
  const timeColor = fresh ? theme.accent : 'rgba(255,255,255,0.75)';

  return (
    <Pressable style={{ width }} onPress={() => router.push(`/series/${series.id}`)}>
      <View>
        <CoverImage title={series.title} file={series.coverFile} label="" />
        {isNew && (
          <View style={[styles.newBadge, { backgroundColor: theme.accent }]}>
            <View style={styles.newDot} />
            <Text style={styles.newText}>New</Text>
          </View>
        )}
        <LinearGradient colors={['transparent', 'rgba(10,10,12,0.92)']} style={styles.strip}>
          <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 10.5, color: timeColor }}>Ch. {chapter}</Text>
          <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 10.5, color: timeColor }}>{ago}</Text>
        </LinearGradient>
      </View>
      <Text
        numberOfLines={1}
        style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 13, color: theme.colors.text, marginTop: 8 }}
      >
        {series.title}
      </Text>
      {showAuthor && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <Text style={{ fontFamily: theme.bodyFont, fontSize: 11, color: theme.colors.text3 }}>{series.author}</Text>
          <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: theme.colors.text4 }} />
          <Text style={{ fontFamily: theme.bodyFont, fontSize: 11, color: theme.colors.text3 }}>{series.tags[0]}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#fff' },
  newText: { fontSize: 9, fontWeight: '700', color: '#fff', letterSpacing: 0.6, textTransform: 'uppercase' },
  strip: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
