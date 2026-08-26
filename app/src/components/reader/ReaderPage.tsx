import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Rect, Line } from 'react-native-svg';

import { hashHue, hsl } from '@/lib/hashHue';

// Full-bleed page placeholder — same striped-swatch language as
// CoverImage, but no rounded corners/scrim and labeled by page number
// instead of title, matching how project/reader-frames.jsx and
// desktop-frames-2.jsx's Reader use CoverPlaceholder per page.
export function ReaderPage({ chapterKey, index, height }: { chapterKey: string; index: number; height: number }) {
  const patternId = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const hue = hashHue(`${chapterKey}-${index}`);
  const bg = hsl(hue, 30, 10);
  const stripe = hsl(hue, 26, 15);
  const label = `pg_${String(index + 1).padStart(3, '0')}.webp`;

  return (
    <View style={{ height, backgroundColor: bg, overflow: 'hidden' }}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern id={patternId} patternUnits="userSpaceOnUse" width={16} height={16} patternTransform="rotate(45)">
            <Rect width={16} height={16} fill={bg} />
            <Line x1={0} y1={0} x2={0} y2={16} stroke={stripe} strokeWidth={1} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </Svg>
      <View style={styles.labelTag}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <View style={styles.centerLabel}>
        <Text style={styles.centerText}>Page {index + 1}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelTag: {
    position: 'absolute',
    left: 10,
    top: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  labelText: { fontFamily: 'JetBrainsMono_500Medium', fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.4 },
  centerLabel: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  centerText: { fontFamily: 'JetBrainsMono_500Medium', fontSize: 13, color: 'rgba(255,255,255,0.25)', letterSpacing: 1 },
});
