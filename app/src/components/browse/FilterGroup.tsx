import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useMangaTheme } from '@/theme/ThemeProvider';

// Ported from desktop-frames.jsx `FilterGroup` / mobile-frames.jsx `FGroup`
// — identical shape, reused by both the desktop sidebar rail and the mobile
// filter sheet.
export function FilterGroup({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  const { theme } = useMangaTheme();
  return (
    <View>
      <View style={styles.header}>
        <Text
          style={{
            fontFamily: theme.displayFont,
            fontWeight: '600',
            fontSize: 11,
            letterSpacing: 1.3,
            textTransform: 'uppercase',
            color: theme.colors.text3,
          }}
        >
          {title}
        </Text>
        {badge ? <Text style={{ fontFamily: theme.bodyFont, fontSize: 10, color: theme.accent }}>{badge}</Text> : null}
      </View>
      <View style={styles.tags}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
});
