import React from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

import { Icon } from '@/components/ui/Icon';
import { Avatar } from '@/components/ui/Avatar';
import { useMangaTheme } from '@/theme/ThemeProvider';

// Ported from project/desktop-frames.jsx `DesktopNav` — sticky top bar with
// logo, primary links, inline search, and utility icons. Shown instead of
// the bottom tab bar at/above the desktop breakpoint (see useBreakpoint).
export function TopNav() {
  const { theme } = useMangaTheme();
  const router = useRouter();
  const pathname = usePathname();

  const links: { key: string; href: '/' | '/browse' | '/library'; label: string }[] = [
    { key: 'home', href: '/', label: 'Home' },
    { key: 'browse', href: '/browse', label: 'Browse' },
    { key: 'library', href: '/library', label: 'Library' },
  ];

  return (
    <View style={[styles.bar, { backgroundColor: theme.colors.bg, borderBottomColor: theme.colors.border }]}>
      <Pressable style={styles.brand} onPress={() => router.push('/')}>
        <View style={[styles.brandMark, { backgroundColor: theme.accent }]}>
          <View style={[styles.brandMarkCut, { backgroundColor: theme.colors.bg }]} />
        </View>
        <Text style={[styles.brandText, { fontFamily: theme.displayFont, color: theme.colors.text }]}>MangaX</Text>
      </Pressable>

      <View style={styles.links}>
        {links.map((l) => {
          const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href);
          return (
            <Pressable
              key={l.key}
              onPress={() => router.push(l.href)}
              style={[styles.link, active && { backgroundColor: theme.colors.surface2 }]}
            >
              <Text
                style={{
                  fontFamily: theme.bodyFont,
                  fontSize: 13.5,
                  fontWeight: '500',
                  color: active ? theme.colors.text : theme.colors.text3,
                }}
              >
                {l.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        style={[styles.searchBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        onPress={() => router.push('/search')}
      >
        <Icon name="search" size={15} color={theme.colors.text4} />
        <TextInput
          editable={false}
          pointerEvents="none"
          placeholder="Search titles, authors, tags…"
          placeholderTextColor={theme.colors.text4}
          style={[styles.searchInput, { fontFamily: theme.bodyFont, color: theme.colors.text }]}
        />
        <View style={[styles.kbd, { borderColor: theme.colors.border }]}>
          <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 10, color: theme.colors.text4 }}>⌘K</Text>
        </View>
      </Pressable>

      <View style={styles.utility}>
        <Icon name="bell" size={18} color={theme.colors.text3} />
        <Pressable onPress={() => router.push('/library')}>
          <Icon name="bookmark" size={18} color={theme.colors.text3} />
        </Pressable>
        <Pressable onPress={() => router.push('/profile')}>
          <Avatar name="HM" size={30} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 60,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
    borderBottomWidth: 1,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandMark: { width: 22, height: 22, borderRadius: 4 },
  brandMarkCut: { position: 'absolute', top: 4, bottom: 4, left: 9, right: 4, borderRadius: 1 },
  brandText: { fontSize: 19, fontWeight: '700', letterSpacing: -0.4 },
  links: { flexDirection: 'row', gap: 4 },
  link: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  searchBox: {
    flex: 1,
    maxWidth: 480,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 13, height: '100%' },
  kbd: { paddingHorizontal: 6, paddingVertical: 3, borderWidth: 1, borderRadius: 4 },
  utility: { flexDirection: 'row', alignItems: 'center', gap: 14 },
});
