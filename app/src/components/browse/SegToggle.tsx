import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { useMangaTheme } from '@/theme/ThemeProvider';

// Ported from desktop-frames.jsx `SegToggle` — small segmented control used
// for the Grid/List and Compact/Regular/Comfy switches.
export function SegToggle<T extends string>({
  options,
  active,
  onChange,
}: {
  options: T[];
  active: T;
  onChange?: (value: T) => void;
}) {
  const { theme } = useMangaTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      {options.map((o) => (
        <Pressable
          key={o}
          onPress={() => onChange?.(o)}
          style={[styles.btn, o === active && { backgroundColor: theme.colors.surface3 }]}
        >
          <Text style={{ fontFamily: theme.bodyFont, fontSize: 11.5, fontWeight: '500', color: o === active ? theme.colors.text : theme.colors.text3 }}>
            {o}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', borderWidth: 1, borderRadius: 7, padding: 2 },
  btn: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 5 },
});
