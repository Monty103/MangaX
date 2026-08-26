import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { Icon } from '@/components/ui/Icon';
import { PremiumAvatar } from './PremiumAvatar';
import { TIERS, tierFor, nextTier } from '@/monetization/tiers';

/**
 * Progression card. For free accounts this deliberately shows the level
 * they would *already* have earned — per the design, that's the strongest
 * upgrade prompt available, and it's honest rather than invented.
 */
export function LevelCard({
  premium,
  level,
  xp,
  xpIntoLevel,
  xpForNextLevel,
  chaptersRead,
  label,
}: {
  premium: boolean;
  level: number;
  xp: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  chaptersRead: number;
  label: string;
}) {
  const { theme } = useMangaTheme();
  const router = useRouter();
  const tier = tierFor(level);
  const next = nextTier(level);
  const pct = Math.round((xpIntoLevel / xpForNextLevel) * 100);

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <PremiumAvatar size={64} label={label} tier={tier} premium={premium} lv={premium ? level : null} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 16, color: theme.colors.text }}>
            {premium ? `Lv ${level} · ${tier.name}` : `You'd be Lv ${level}`}
          </Text>
          <Text style={{ fontFamily: theme.bodyFont, fontSize: 11.5, lineHeight: 17, color: theme.colors.text3, marginTop: 4 }}>
            {premium
              ? `${chaptersRead} chapters read · ${xp} XP`
              : `${chaptersRead} chapters read. Premium unlocks levels and tier rings.`}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 14 }}>
        <View style={{ height: 5, borderRadius: 3, backgroundColor: theme.colors.surface3, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${pct}%`, backgroundColor: premium ? theme.accent : theme.colors.text4 }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 }}>
          <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 10, color: theme.colors.text4 }}>
            {xpIntoLevel} / {xpForNextLevel} XP
          </Text>
          {next && (
            <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 10, color: theme.colors.text4 }}>
              NEXT TIER · LV {next.lv} {next.name.toUpperCase()}
            </Text>
          )}
        </View>
      </View>

      {!premium && (
        <Pressable onPress={() => router.push('/premium')} style={[styles.cta, { backgroundColor: theme.accent }]}>
          <Icon name="crown" size={13} color="#fff" />
          <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 13, color: '#fff' }}>Get Premium</Text>
        </Pressable>
      )}
    </View>
  );
}

/** Ported from monetization-frames.jsx `LevelLadderMobile` — all 11 tiers. */
export function LevelLadder({ currentLevel, premium }: { currentLevel: number; premium: boolean }) {
  const { theme } = useMangaTheme();
  return (
    <View style={{ gap: 8 }}>
      {TIERS.map((t) => {
        const reached = currentLevel >= t.lv;
        return (
          <View
            key={t.lv}
            style={[
              styles.ladderRow,
              { borderColor: reached ? theme.accent : theme.colors.border, backgroundColor: reached ? theme.accentSoft : theme.colors.surface },
            ]}
          >
            <PremiumAvatar size={38} label={String(t.lv)} tier={t} premium={premium && reached} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 13, color: theme.colors.text }}>{t.name}</Text>
              <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 10, color: theme.colors.text3, marginTop: 3 }}>
                LV {t.lv}+
              </Text>
            </View>
            {reached && <Icon name="check" size={15} strokeWidth={2.4} color={theme.accent} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, borderWidth: 1 },
  cta: { marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 11, borderRadius: 9, minHeight: 44 },
  ladderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, borderWidth: 1 },
});
