import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useMangaTheme } from '@/theme/ThemeProvider';

// Ported from desktop-frames.jsx `RangeSlider` — visual only, exactly as
// the source had it (no drag handling there either; it's a static mockup
// of the year/rating range, not wired to the filter logic).
export function RangeSliderStatic({ min, max, from, to, unit = '' }: { min: number; max: number; from: number; to: number; unit?: string }) {
  const { theme } = useMangaTheme();
  const pctA = ((from - min) / (max - min)) * 100;
  const pctB = ((to - min) / (max - min)) * 100;
  return (
    <View>
      <View style={{ height: 18, justifyContent: 'center' }}>
        <View style={[styles.track, { backgroundColor: theme.colors.surface3 }]} />
        <View style={[styles.fill, { left: `${pctA}%`, width: `${pctB - pctA}%`, backgroundColor: theme.accent }]} />
        <View style={[styles.handle, { left: `${pctA}%`, borderColor: theme.accent }]} />
        <View style={[styles.handle, { left: `${pctB}%`, borderColor: theme.accent }]} />
      </View>
      <View style={styles.labels}>
        <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 11, color: theme.colors.text3 }}>{from}{unit}</Text>
        <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 11, color: theme.colors.text3 }}>{to}{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { position: 'absolute', left: 0, right: 0, height: 3, borderRadius: 2 },
  fill: { position: 'absolute', height: 3, borderRadius: 2 },
  handle: { position: 'absolute', width: 12, height: 12, marginLeft: -6, top: 3, borderRadius: 6, backgroundColor: '#fff', borderWidth: 2 },
  labels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
});
