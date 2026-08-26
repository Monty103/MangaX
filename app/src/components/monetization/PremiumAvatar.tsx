import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Circle } from 'react-native-svg';

import { useMangaTheme } from '@/theme/ThemeProvider';
import type { Tier } from '@/monetization/tiers';

// Ported from monetization-frames.jsx `Avatar` (renamed to avoid colliding
// with the plain shared Avatar — the same collision the design chat hit).
//
// The premium tell is exactly one thing: free accounts get a plain hairline
// ring, premium gets the tier ring plus level badge. No separate badge
// shouting at people.
export function PremiumAvatar({
  size = 56,
  label = 'HM',
  tier,
  premium = true,
  lv,
}: {
  size?: number;
  label?: string;
  tier?: Tier;
  premium?: boolean;
  lv?: number | null;
}) {
  const { theme } = useMangaTheme();
  const ring = premium && tier ? tier.ring : { type: 'none' as const, colors: [] as string[] };
  const pad = ring.type === 'none' ? 0 : ring.type === 'double' ? 5 : 3;
  const c = ring.colors;
  const gradId = `tier-${React.useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  // RN has no conic-gradient; a stroked SVG circle with a linear gradient
  // reads the same at avatar scale for the conic/animated tiers.
  const isGradient = ring.type === 'conic' || ring.type === 'animated';

  return (
    <View style={{ width: size, height: size }}>
      {ring.type === 'none' ? (
        <View style={[StyleSheet.absoluteFill, { borderRadius: size / 2, borderWidth: 1, borderColor: theme.colors.borderStrong }]} />
      ) : isGradient ? (
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          <Defs>
            <SvgGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              {c.map((color, i) => (
                <Stop key={i} offset={`${(i / Math.max(1, c.length - 1)) * 100}%`} stopColor={color} />
              ))}
            </SvgGradient>
          </Defs>
          <Circle cx={size / 2} cy={size / 2} r={(size - pad) / 2} fill="none" stroke={`url(#${gradId})`} strokeWidth={pad} />
        </Svg>
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: size / 2,
              borderWidth: pad,
              borderColor: c[0],
              ...(ring.type === 'double' ? { shadowColor: theme.colors.bg } : {}),
            },
          ]}
        />
      )}

      <View
        style={{
          position: 'absolute',
          top: pad + 1,
          left: pad + 1,
          right: pad + 1,
          bottom: pad + 1,
          borderRadius: size / 2,
          overflow: 'hidden',
          backgroundColor: theme.colors.surface3,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: Math.round(size * 0.3), color: theme.colors.text2 }}>
          {label.slice(0, 2).toUpperCase()}
        </Text>
      </View>

      {premium && lv != null && (
        <View
          style={[
            styles.lvBadge,
            { backgroundColor: theme.colors.bg, borderColor: c[0] || theme.colors.borderStrong },
          ]}
        >
          <Text style={{ fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 10, color: c[0] || theme.colors.text2 }}>{lv}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  lvBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
