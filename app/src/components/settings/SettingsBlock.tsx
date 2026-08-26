import React from 'react';
import { View, Text } from 'react-native';

import { useMangaTheme } from '@/theme/ThemeProvider';

// Ported from account-frames.jsx `SettingsBlock`.
export function SettingsBlock({ title, caption, children }: { title: string; caption?: string; children: React.ReactNode }) {
  const { theme } = useMangaTheme();
  return (
    <View style={{ marginBottom: 36, paddingBottom: 32, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
      <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 17, letterSpacing: -0.25, color: theme.colors.text }}>
        {title}
      </Text>
      {caption ? (
        <Text style={{ fontFamily: theme.bodyFont, fontSize: 12.5, lineHeight: 19, color: theme.colors.text3, marginTop: 6, marginBottom: 18, maxWidth: 580 }}>
          {caption}
        </Text>
      ) : (
        <View style={{ height: 14 }} />
      )}
      {children}
    </View>
  );
}

// Ported from account-frames.jsx `SettingRow`.
export function SettingRow({ title, caption, children }: { title: string; caption?: string; children: React.ReactNode }) {
  const { theme } = useMangaTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 12 }}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontFamily: theme.displayFont, fontWeight: '500', fontSize: 13, color: theme.colors.text }}>{title}</Text>
        {caption ? (
          <Text style={{ fontFamily: theme.bodyFont, fontSize: 11, lineHeight: 16, color: theme.colors.text3, marginTop: 4 }}>{caption}</Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}
