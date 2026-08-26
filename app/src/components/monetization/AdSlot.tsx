import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { Icon } from '@/components/ui/Icon';

// Ported from monetization-frames.jsx `AdLabel` / `RemoveAdsLink` /
// `InlineReaderAd`. Every ad carries the same three affordances: an AD
// label, a bounded and predictable size, and a one-tap route out.

export function AdLabel({ children = 'Advertisement' }: { children?: string }) {
  const { theme } = useMangaTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
      <View style={[styles.adTag, { borderColor: theme.colors.borderStrong }]}>
        <Text style={{ fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 8.5, letterSpacing: 1.2, color: theme.colors.text4 }}>AD</Text>
      </View>
      <Text style={{ fontFamily: theme.bodyFont, fontSize: 9.5, fontWeight: '500', color: theme.colors.text4, letterSpacing: 0.4 }}>
        {children}
      </Text>
    </View>
  );
}

// 44px tap target, achieved with padding plus a matching negative margin so
// it hits the minimum without shifting the layout — the fix the design
// landed on after its own accessibility pass.
export function RemoveAdsLink({ compact }: { compact?: boolean }) {
  const { theme } = useMangaTheme();
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push('/premium')} style={styles.removeAds}>
      <Text style={{ fontFamily: theme.bodyFont, fontWeight: '600', fontSize: compact ? 11.5 : 12.5, color: theme.accent }}>
        Remove ads
      </Text>
      <Icon name="chevronR" size={compact ? 12 : 13} color={theme.accent} />
    </Pressable>
  );
}

/**
 * Inline reader ad: a bounded block in the vertical flow that scrolls past
 * like any page. Never overlays art, never intercepts the tap-to-toggle or
 * scroll gesture — an interstitial here would break the seamless reading
 * the reader is built around.
 */
export function InlineReaderAd({ height = 250, note }: { height?: number; note?: string }) {
  const { theme } = useMangaTheme();
  return (
    <View style={[styles.inline, { backgroundColor: theme.colors.bg, borderColor: theme.colors.border }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
        <AdLabel>{note || 'Between pages'}</AdLabel>
        <RemoveAdsLink compact />
      </View>
      <View style={[styles.creative, { height, borderColor: theme.colors.borderStrong, backgroundColor: theme.colors.surface }]}>
        <Text style={{ fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 11, color: theme.colors.text3, letterSpacing: 0.6 }}>
          300 × {height}
        </Text>
        <Text style={{ fontFamily: theme.bodyFont, fontSize: 10, fontWeight: '500', color: theme.colors.text4, marginTop: 7 }}>
          House slot · no network configured
        </Text>
      </View>
    </View>
  );
}

/** Chapter-break slot — attention is free at a natural pause. */
export function ChapterBreakAd() {
  const { theme } = useMangaTheme();
  return (
    <View style={[styles.breakWrap, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <AdLabel>Chapter break</AdLabel>
        <RemoveAdsLink compact />
      </View>
      <View style={[styles.creative, { height: 180, borderColor: theme.colors.borderStrong, backgroundColor: theme.colors.surface2 }]}>
        <Text style={{ fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 11, color: theme.colors.text3, letterSpacing: 0.6 }}>
          320 × 180
        </Text>
        <Text style={{ fontFamily: theme.bodyFont, fontSize: 10, fontWeight: '500', color: theme.colors.text4, marginTop: 7 }}>
          House slot · no network configured
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  adTag: { borderWidth: 1, borderRadius: 3, paddingHorizontal: 4, paddingVertical: 3 },
  removeAds: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 13,
    paddingHorizontal: 8,
    marginVertical: -13,
    marginHorizontal: -8,
    minHeight: 44,
  },
  inline: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 14, borderTopWidth: 1, borderBottomWidth: 1 },
  breakWrap: { margin: 16, padding: 14, borderRadius: 12, borderWidth: 1 },
  creative: { borderRadius: 8, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
});
