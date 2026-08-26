import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

import { useMangaTheme } from '@/theme/ThemeProvider';

// Ported from project/shared.jsx `Tag` — genre/status filter chip used
// across Browse's filter rail/sheet and series tag rows.
export function Tag({
  children,
  active = false,
  accent = false,
  size = 'md',
  onPress,
  count,
}: {
  children: React.ReactNode;
  active?: boolean;
  accent?: boolean;
  size?: 'sm' | 'md';
  onPress?: () => void;
  count?: number;
}) {
  const { theme } = useMangaTheme();
  const padX = size === 'sm' ? 7 : 10;
  const padY = size === 'sm' ? 3 : 5;
  const fs = size === 'sm' ? 10.5 : 12;

  const borderColor = active ? theme.accent : theme.colors.border;
  const backgroundColor = active ? theme.accentSoft : accent ? theme.accent : 'transparent';
  const color = active ? theme.accent : accent ? '#fff' : theme.colors.text2;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        { paddingHorizontal: padX, paddingVertical: padY, borderColor, backgroundColor },
      ]}
    >
      <Text style={{ fontSize: fs, fontFamily: theme.bodyFont, fontWeight: '500', color }}>{children}</Text>
      {count != null && (
        <Text style={{ fontSize: fs, fontFamily: theme.bodyFont, color, opacity: 0.55 }}>{count}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
});
