import React, { useId } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Rect, Line } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

import { hashHue, hsl } from '@/lib/hashHue';
import { useMangaTheme } from '@/theme/ThemeProvider';

// Ported from project/shared.jsx `CoverPlaceholder`: a diagonal-stripe
// swatch colored by the title's hash, with a monospace filename tag and the
// title overlaid at the bottom. Stands in for real cover art until a real
// image pipeline (Supabase Storage / CDN URLs) replaces `file`.
export function CoverImage({
  title,
  file,
  label = 'cover.jpg',
  aspectRatio = 2 / 3,
  badge,
  dim = false,
  style,
}: {
  title: string;
  file?: string | null;
  label?: string;
  aspectRatio?: number;
  badge?: string;
  dim?: boolean;
  style?: any;
}) {
  const { theme } = useMangaTheme();
  // SVG pattern ids share one DOM per page on web — an id repeated across
  // instances resolves `url(#id)` to whichever instance defined it first,
  // so every placeholder rendered the same swatch until this was unique.
  const patternId = 'mx-stripes-' + useId().replace(/[^a-zA-Z0-9]/g, '');

  // Real art path: once `file` is a resolved URL, render it directly instead
  // of the generated placeholder. Left as a TODO seam — no CDN/storage is
  // wired up yet (see task: Supabase client + DB schema).
  if (file) {
    return (
      <View style={[{ aspectRatio, borderRadius: 6, overflow: 'hidden' }, style]}>
        <Image source={{ uri: file }} style={StyleSheet.absoluteFill} contentFit="cover" />
        {dim && <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.45)' }]} />}
      </View>
    );
  }

  const hue = hashHue(title || label);
  const bg = hsl(hue, 45, 14);
  const stripe = hsl(hue, 35, 22);

  return (
    <View style={[{ aspectRatio, borderRadius: 6, overflow: 'hidden', backgroundColor: bg }, style]}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern id={patternId} patternUnits="userSpaceOnUse" width={14} height={14} patternTransform="rotate(45)">
            <Rect width={14} height={14} fill={bg} />
            <Line x1={0} y1={0} x2={0} y2={14} stroke={stripe} strokeWidth={1} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </Svg>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        locations={[0.6, 1]}
        style={StyleSheet.absoluteFill}
      />
      {dim && <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.45)' }]} />}
      <View style={styles.labelTag}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <Text style={[styles.title, { fontFamily: theme.displayFont }]} numberOfLines={2}>
        {title}
      </Text>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: theme.accent }]}>
          <Text style={[styles.badgeText, { fontFamily: theme.displayFont }]}>{badge}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  labelTag: {
    position: 'absolute',
    left: 8,
    top: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  labelText: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 9,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.4,
  },
  title: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 8,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
