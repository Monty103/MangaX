import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { CoverImage } from '@/components/ui/CoverImage';
import { Stars } from '@/components/ui/Stars';
import { Icon } from '@/components/ui/Icon';
import { useMangaTheme } from '@/theme/ThemeProvider';
import type { HomeSeries } from '@/data/homeRepository';

// "New chapter" only when the newest readable chapter is this recent.
const NEW_CHAPTER_MS = 7 * 24 * 60 * 60 * 1000;

// Ported from desktop-frames.jsx `Hero` (wide banner, left-aligned copy over
// a horizontal scrim) and mobile-frames.jsx's phone hero card (shorter,
// bottom-aligned copy over a vertical scrim).
export function HomeHero({ series, isDesktop }: { series: HomeSeries; isDesktop: boolean }) {
  const { theme } = useMangaTheme();
  const router = useRouter();
  const chapter = series.latestChapter;
  const isNew = series.latestChapterAt != null && Date.now() - Date.parse(series.latestChapterAt) < NEW_CHAPTER_MS;
  const openSeries = () => router.push(`/series/${series.id}`);
  const readLatest = () => (chapter != null ? router.push(`/reader/${series.id}-${chapter}`) : openSeries());

  return (
    <View
      style={[
        styles.wrap,
        { height: isDesktop ? 320 : 360, marginHorizontal: isDesktop ? 0 : 16, marginBottom: isDesktop ? 28 : 0 },
      ]}
    >
      <CoverImage
        title={series.title}
        file={series.coverFile}
        label={isDesktop ? 'hero_art_2400x900.jpg' : 'hero_phone.jpg'}
        style={{ borderRadius: 0, width: '100%', height: '100%' }}
      />
      <LinearGradient
        colors={isDesktop ? ['rgba(10,10,12,0.95)', 'rgba(10,10,12,0.6)', 'transparent'] : ['transparent', 'rgba(10,10,12,0.95)']}
        locations={isDesktop ? [0, 0.45, 0.75] : [0.3, 1]}
        start={isDesktop ? { x: 0, y: 0 } : { x: 0, y: 0 }}
        end={isDesktop ? { x: 1, y: 0 } : { x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          styles.copy,
          isDesktop
            ? { left: 36, top: 36, bottom: 36, maxWidth: 460, justifyContent: 'flex-end' }
            : { left: 16, right: 16, bottom: 16, justifyContent: 'flex-end' },
        ]}
      >
        <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 10, letterSpacing: 2, color: theme.accent, textTransform: 'uppercase', marginBottom: isDesktop ? 14 : 8 }}>
          {isNew ? 'Featured · New chapter' : 'Featured'}
        </Text>
        <Text
          style={{
            fontFamily: theme.displayFont,
            fontWeight: '700',
            fontSize: isDesktop ? 38 : 26,
            color: theme.colors.text,
            letterSpacing: -0.8,
            marginBottom: isDesktop ? 14 : 6,
          }}
        >
          {series.title}
        </Text>
        {isDesktop ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <Text style={{ fontFamily: theme.bodyFont, fontSize: 12, fontWeight: '500', color: theme.colors.text2 }}>{series.author}</Text>
            <View style={styles.dot} />
            <Stars value={series.rating} count={series.ratings} />
            <View style={styles.dot} />
            {chapter != null && (
              <Text style={{ fontFamily: theme.bodyFont, fontSize: 12, fontWeight: '500', color: theme.colors.text2 }}>Ch. {chapter}</Text>
            )}
          </View>
        ) : (
          <Text style={{ fontFamily: theme.bodyFont, fontSize: 11, fontWeight: '500', color: theme.colors.text2 }}>
            {[series.author, chapter != null ? `Ch. ${chapter}` : null, `${series.rating.toFixed(1)} ★`].filter(Boolean).join(' · ')}
          </Text>
        )}
        {isDesktop && series.description ? (
          <Text numberOfLines={3} style={{ fontFamily: theme.bodyFont, fontSize: 13.5, lineHeight: 21, color: theme.colors.text2, maxWidth: 440 }}>
            {series.description}
          </Text>
        ) : null}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: isDesktop ? 4 : 14 }}>
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: theme.accent, flex: isDesktop ? undefined : 1 }]}
            onPress={readLatest}
          >
            <Icon name="play" size={13} color="#fff" />
            <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 13, color: '#fff' }}>
              {chapter != null ? `Read Chapter ${chapter}` : 'Open series'}
            </Text>
          </Pressable>
          <Pressable style={[styles.secondaryBtn, { borderColor: theme.colors.borderStrong, width: isDesktop ? undefined : 44 }]}>
            <Icon name="bookmark" size={isDesktop ? 13 : 14} color={theme.colors.text} />
            {isDesktop && <Text style={{ fontFamily: theme.displayFont, fontWeight: '500', fontSize: 13, color: theme.colors.text }}>Add to library</Text>}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative', borderRadius: 14, overflow: 'hidden' },
  copy: { position: 'absolute', flexDirection: 'column' },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: 'rgba(244,244,246,0.3)' },
  primaryBtn: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
