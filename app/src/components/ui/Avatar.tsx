import React from 'react';
import { View, Text } from 'react-native';

import { hashHue, hsl } from '@/lib/hashHue';
import { useMangaTheme } from '@/theme/ThemeProvider';

// Ported from project/shared.jsx `Avatar` — plain round initials pill for
// free accounts and anywhere a tier ring doesn't apply. The premium
// tier-ring variant (project/monetization-frames.jsx `Avatar`) is a
// separate `PremiumAvatar` component (task: monetization) so the two never
// collide, mirroring the naming fix in chats/chat1.md.
export function Avatar({ name = 'KX', size = 28, color }: { name?: string; size?: number; color?: string }) {
  const { theme } = useMangaTheme();
  const hue = hashHue(name);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color || hsl(hue, 45, 30),
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontFamily: theme.displayFont, fontSize: size * 0.42, fontWeight: '600' }}>
        {name.slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
}
