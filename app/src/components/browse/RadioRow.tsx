import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { useMangaTheme } from '@/theme/ThemeProvider';

// Ported from mobile-frames.jsx `RadioRow` — sort-option row in the filter sheet.
export function RadioRow({ label, active, onPress }: { label: string; active: boolean; onPress?: () => void }) {
  const { theme } = useMangaTheme();
  return (
    <Pressable onPress={onPress} style={[styles.row, { borderBottomColor: theme.colors.border }]}>
      <View style={[styles.dot, { borderColor: active ? theme.accent : theme.colors.borderStrong }]}>
        {active && <View style={[styles.dotInner, { backgroundColor: theme.accent }]} />}
      </View>
      <Text style={{ fontFamily: theme.bodyFont, fontSize: 13.5, fontWeight: '500', color: theme.colors.text }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  dotInner: { width: 7, height: 7, borderRadius: 3.5 },
});
