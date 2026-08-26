import React from 'react';
import { View, Text } from 'react-native';

import { useMangaTheme } from '@/theme/ThemeProvider';

export function DetailRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  const { theme } = useMangaTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: theme.colors.border,
      }}
    >
      <Text style={{ fontFamily: theme.bodyFont, fontSize: 12.5, fontWeight: '500', color: theme.colors.text3 }}>{label}</Text>
      <Text style={{ fontFamily: theme.bodyFont, fontSize: 12.5, fontWeight: '500', color: theme.colors.text }}>{value}</Text>
    </View>
  );
}
