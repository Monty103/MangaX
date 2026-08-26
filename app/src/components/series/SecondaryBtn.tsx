import React from 'react';
import { Pressable, Text } from 'react-native';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { Icon, IconName } from '@/components/ui/Icon';

// Ported from desktop-frames-2.jsx `SecondaryBtn` / the mobile icon-only
// equivalent. Visual + tappable, but not wired to real state yet — library
// membership, downloads, and notify subscriptions land with their own
// tasks (Library/Downloads/Account).
export function SecondaryBtn({ icon, children, onPress }: { icon: IconName; children?: React.ReactNode; onPress?: () => void }) {
  const { theme } = useMangaTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
      }}
    >
      <Icon name={icon} size={13} color={theme.colors.text} />
      {children ? (
        <Text style={{ fontFamily: theme.displayFont, fontWeight: '500', fontSize: 12.5, color: theme.colors.text }}>{children}</Text>
      ) : null}
    </Pressable>
  );
}
