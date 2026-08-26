import React from 'react';
import { View } from 'react-native';
import { Slot } from 'expo-router';

import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useMangaTheme } from '@/theme/ThemeProvider';
import { TopNav } from '@/components/nav/TopNav';
import { BottomTabBar } from '@/components/nav/BottomTabBar';

// One layout, two chromes: a sticky top nav above the desktop breakpoint
// (project/desktop-frames.jsx `DesktopNav`) and a bottom tab bar below it
// (project/mobile-frames.jsx `MobileTabBar`) — same four routes either way,
// so there's a single set of screens instead of parallel desktop/mobile
// trees.
export default function TabsLayout() {
  const { isDesktop } = useBreakpoint();
  const { theme } = useMangaTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      {isDesktop && <TopNav />}
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      {!isDesktop && <BottomTabBar />}
    </View>
  );
}
