import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMangaTheme } from '@/theme/ThemeProvider';

// Marks a route that exists (so navigation/back stacks work end to end)
// but hasn't been ported from the design yet — swapped out task by task.
export function PlaceholderScreen({ title, note }: { title: string; note?: string }) {
  const { theme } = useMangaTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24, paddingTop: insets.top + 24 }}>
      <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 22, color: theme.colors.text }}>{title}</Text>
      {note && (
        <Text style={{ fontFamily: theme.bodyFont, fontSize: 13, color: theme.colors.text3, marginTop: 10, textAlign: 'center', maxWidth: 320 }}>
          {note}
        </Text>
      )}
    </View>
  );
}
