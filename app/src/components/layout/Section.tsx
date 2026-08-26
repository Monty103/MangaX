import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { useMangaTheme } from '@/theme/ThemeProvider';

// Ported from desktop-frames.jsx `Section` / mobile-frames.jsx `MobileSection`
// — same header shape, different type scale per breakpoint.
export function Section({
  title,
  caption,
  action = 'View all',
  onPressAction,
  isDesktop,
  children,
}: {
  title: string;
  caption?: string;
  action?: string;
  onPressAction?: () => void;
  isDesktop: boolean;
  children: React.ReactNode;
}) {
  const { theme } = useMangaTheme();
  return (
    <View style={{ marginBottom: isDesktop ? 36 : 28 }}>
      <View style={[styles.header, { paddingHorizontal: isDesktop ? 0 : 16 }]}>
        <View>
          <Text
            style={{
              fontFamily: theme.displayFont,
              fontWeight: '700',
              fontSize: isDesktop ? 20 : 16,
              color: theme.colors.text,
              letterSpacing: -0.3,
            }}
          >
            {title}
          </Text>
          {caption ? (
            <Text
              style={{
                fontFamily: theme.bodyFont,
                fontSize: isDesktop ? 12.5 : 11.5,
                color: theme.colors.text3,
                marginTop: isDesktop ? 6 : 4,
              }}
            >
              {caption}
            </Text>
          ) : null}
        </View>
        <Pressable onPress={onPressAction} style={styles.action}>
          <Text style={{ fontFamily: theme.bodyFont, fontSize: isDesktop ? 12 : 11.5, color: theme.colors.text2 }}>
            {isDesktop ? action : 'All'}
          </Text>
          {isDesktop && <Icon name="chevronR" size={12} color={theme.colors.text2} />}
        </Pressable>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
