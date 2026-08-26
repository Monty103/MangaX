import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/Icon';
import { useMangaTheme } from '@/theme/ThemeProvider';
import { NAV_ITEMS } from './navItems';

// Ported from project/mobile-frames.jsx `MobileTabBar` — fixed bottom bar,
// active item tinted with the accent color.
export function BottomTabBar() {
  const { theme } = useMangaTheme();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      {NAV_ITEMS.map((item) => {
        const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        const color = active ? theme.accent : theme.colors.text3;
        return (
          <Pressable key={item.key} style={styles.item} onPress={() => router.push(item.href)}>
            <Icon name={item.icon} size={22} color={color} strokeWidth={active ? 2 : 1.6} />
            <Text style={[styles.label, { color, fontFamily: theme.bodyFont }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 2,
  },
  label: {
    fontSize: 10.5,
    fontWeight: '500',
  },
});
