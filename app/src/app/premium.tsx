import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Icon, IconName } from '@/components/ui/Icon';
import { PremiumAvatar } from '@/components/monetization/PremiumAvatar';
import { useEntitlement } from '@/monetization/useEntitlement';
import { getPurchasesService, PlanId } from '@/monetization/services';
import { tierFor } from '@/monetization/tiers';

// Ported from monetization-frames.jsx `PremiumPaywallMobile`.
const PERKS: { icon: IconName; title: string; sub: string }[] = [
  { icon: 'x', title: 'No ads anywhere', sub: 'Reader, browse, chapter breaks' },
  { icon: 'trophy', title: 'Levels & tier rings', sub: 'Earn XP for every chapter you read' },
  { icon: 'user', title: 'Avatar packs', sub: 'Premium art, or upload your own' },
  { icon: 'download', title: 'Unlimited downloads', sub: '4 GB → unlimited offline storage' },
  { icon: 'sparkle', title: 'Early chapters', sub: 'No ad-watching required' },
];

export default function PremiumScreen() {
  const { theme } = useMangaTheme();
  const { isDesktop } = useBreakpoint();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { level, premium } = useEntitlement();
  const purchases = getPurchasesService();

  const [plan, setPlan] = useState<PlanId>('lifetime');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setBusy(true);
    setMessage(null);
    const res = await fn();
    setBusy(false);
    if (!res.ok) setMessage(res.error ?? 'Something went wrong.');
    else router.back();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ paddingBottom: 40, maxWidth: isDesktop ? 560 : undefined, width: '100%', alignSelf: 'center' }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 16, alignItems: 'flex-end' }}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={[styles.closeBtn, { backgroundColor: theme.colors.surface2 }]}>
          <Icon name="x" size={15} color={theme.colors.text3} />
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 22, alignItems: 'center' }}>
        <PremiumAvatar size={70} label="HM" tier={tierFor(level)} premium lv={level} />
        <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 24, letterSpacing: -0.7, color: theme.colors.text, marginTop: 16, textAlign: 'center' }}>
          MangaX Premium
        </Text>
        <Text style={{ fontFamily: theme.bodyFont, fontSize: 12.5, lineHeight: 19, fontWeight: '500', color: theme.colors.text2, marginTop: 9, textAlign: 'center' }}>
          {premium ? 'You already have Premium — thank you.' : 'Drop the ads. Start earning levels.'}
        </Text>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        {purchases.getPlans().map((p) => {
          const on = plan === p.id;
          return (
            <Pressable
              key={p.id}
              onPress={() => setPlan(p.id)}
              style={[
                styles.plan,
                { borderColor: on ? theme.accent : theme.colors.border, backgroundColor: on ? theme.accentSoft : theme.colors.surface },
              ]}
            >
              <View style={[styles.radio, { borderColor: on ? theme.accent : theme.colors.borderStrong, backgroundColor: on ? theme.accent : 'transparent' }]}>
                {on && <Icon name="check" size={11} strokeWidth={3} color="#fff" />}
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                  <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 14, color: theme.colors.text }}>{p.title}</Text>
                  {p.tag && (
                    <View style={[styles.tag, { borderColor: theme.accent }]}>
                      <Text style={{ fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 8.5, letterSpacing: 0.8, color: theme.accent }}>{p.tag}</Text>
                    </View>
                  )}
                </View>
                <Text style={{ fontFamily: theme.bodyFont, fontSize: 11, fontWeight: '500', color: theme.colors.text3, marginTop: 5 }}>{p.note}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 19, letterSpacing: -0.4, color: theme.colors.text }}>{p.price}</Text>
                <Text style={{ fontFamily: theme.bodyFont, fontSize: 11, fontWeight: '500', color: theme.colors.text3, marginLeft: 2 }}>{p.unit}</Text>
              </View>
            </Pressable>
          );
        })}
        <Text style={{ fontFamily: theme.bodyFont, fontSize: 10.5, lineHeight: 15, fontWeight: '500', color: theme.colors.text4, textAlign: 'center', paddingTop: 4 }}>
          Lifetime pays for itself in 15 months.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 6 }}>
        {PERKS.map((p) => (
          <View key={p.title} style={{ flexDirection: 'row', gap: 11, paddingVertical: 10, alignItems: 'flex-start' }}>
            <Icon name={p.icon} size={15} color={theme.accent} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: theme.bodyFont, fontWeight: '600', fontSize: 13, color: theme.colors.text }}>{p.title}</Text>
              <Text style={{ fontFamily: theme.bodyFont, fontSize: 11, lineHeight: 15, color: theme.colors.text3, marginTop: 3 }}>{p.sub}</Text>
            </View>
          </View>
        ))}
      </View>

      {message && (
        <View style={[styles.notice, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Icon name="info" size={14} color={theme.colors.text3} />
          <Text style={{ flex: 1, fontFamily: theme.bodyFont, fontSize: 12.5, lineHeight: 18, color: theme.colors.text2 }}>{message}</Text>
        </View>
      )}

      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 26 }}>
        <Pressable
          disabled={busy}
          onPress={() => run(() => purchases.purchase(plan))}
          style={[styles.buyBtn, { backgroundColor: theme.accent, opacity: busy ? 0.7 : 1 }]}
        >
          <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 15, color: '#fff' }}>
            {plan === 'lifetime' ? 'Buy Lifetime · $15' : 'Subscribe · $1/mo'}
          </Text>
        </Pressable>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 4 }}>
          <Pressable onPress={() => run(() => purchases.restore())} style={styles.footerLink}>
            <Text style={{ fontFamily: theme.bodyFont, fontSize: 12, fontWeight: '500', color: theme.colors.text3 }}>Restore purchase</Text>
          </Pressable>
          <Pressable style={styles.footerLink}>
            <Text style={{ fontFamily: theme.bodyFont, fontSize: 12, fontWeight: '500', color: theme.colors.text3 }}>Terms</Text>
          </Pressable>
        </View>
        <Text style={{ fontFamily: theme.bodyFont, fontSize: 10.5, lineHeight: 15, color: theme.colors.text4, textAlign: 'center', marginTop: 10 }}>
          Billing provider: {purchases.providerName}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  closeBtn: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  plan: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, marginBottom: 9, borderRadius: 12, borderWidth: 1.5 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  tag: { borderWidth: 1, borderRadius: 3, paddingHorizontal: 4, paddingVertical: 3 },
  notice: { flexDirection: 'row', gap: 9, marginHorizontal: 16, padding: 12, borderRadius: 9, borderWidth: 1 },
  buyBtn: { paddingVertical: 14, borderRadius: 11, alignItems: 'center', minHeight: 48, justifyContent: 'center' },
  footerLink: { paddingVertical: 13, paddingHorizontal: 12, minHeight: 44, justifyContent: 'center' },
});
