import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useAuth } from '@/auth/AuthProvider';
import { Avatar } from '@/components/ui/Avatar';
import { Icon, IconName } from '@/components/ui/Icon';
import { DesignTab } from '@/components/settings/DesignTab';
import { SettingsBlock, SettingRow } from '@/components/settings/SettingsBlock';
import { LevelCard, LevelLadder } from '@/components/monetization/LevelCard';
import { useEntitlement } from '@/monetization/useEntitlement';

// Tab set from account-frames.jsx `SETTINGS_TABS`. Design and Account are
// implemented; the rest are declared here so the shell matches the design
// and each lands with its own feature (downloads ships with the offline
// task, notifications/privacy need backend prefs).
const TABS: { id: string; label: string; icon: IconName }[] = [
  { id: 'account', label: 'Account', icon: 'user' },
  { id: 'premium', label: 'Premium', icon: 'crown' },
  { id: 'design', label: 'Design', icon: 'sparkle' },
  { id: 'reading', label: 'Reading', icon: 'book' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'downloads', label: 'Downloads', icon: 'download' },
  { id: 'privacy', label: 'Privacy', icon: 'lock' },
];

export default function ProfileScreen() {
  const { theme } = useMangaTheme();
  const { isDesktop } = useBreakpoint();
  const { user, ready, signOut } = useAuth();
  const ent = useEntitlement();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('design');

  const displayName =
    (user?.user_metadata?.display_name as string | undefined) || user?.email?.split('@')[0] || 'Reader';

  // ── Signed out ──────────────────────────────────────────────────
  if (ready && !user) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.bg }}
        contentContainerStyle={{ paddingHorizontal: isDesktop ? 32 : 20, paddingTop: isDesktop ? 40 : insets.top + 24, paddingBottom: 40, maxWidth: 720, width: '100%', alignSelf: 'center' }}
      >
        <View style={[styles.signedOutCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={[styles.signedOutIcon, { backgroundColor: theme.colors.surface2 }]}>
            <Icon name="user" size={26} color={theme.colors.text3} />
          </View>
          <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 20, color: theme.colors.text, marginTop: 16 }}>
            You&rsquo;re not signed in
          </Text>
          <Text style={{ fontFamily: theme.bodyFont, fontSize: 13, lineHeight: 20, color: theme.colors.text3, marginTop: 8, textAlign: 'center', maxWidth: 380 }}>
            Sign in to sync your library, reading position, and downloads across every device.
          </Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Pressable onPress={() => router.push('/auth/sign-in')} style={[styles.primaryBtn, { backgroundColor: theme.accent }]}>
              <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 13.5, color: '#fff' }}>Sign in</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/auth/sign-up')} style={[styles.secondaryBtn, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface2 }]}>
              <Text style={{ fontFamily: theme.displayFont, fontWeight: '500', fontSize: 13.5, color: theme.colors.text }}>Create account</Text>
            </Pressable>
          </View>
        </View>

        {/* Design settings work signed-out too — they're device-local until
            an account exists to sync them to. */}
        <View style={{ marginTop: 36 }}>
          <DesignTab />
        </View>
      </ScrollView>
    );
  }

  const AccountTab = () => (
    <View>
      <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: isDesktop ? 28 : 22, letterSpacing: -0.6, color: theme.colors.text, marginBottom: 28 }}>
        Account
      </Text>
      <SettingsBlock title="Profile" caption="How you appear in comments and reviews.">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Avatar name={displayName} size={56} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 15, color: theme.colors.text }}>{displayName}</Text>
            <Text style={{ fontFamily: theme.bodyFont, fontSize: 12, color: theme.colors.text3, marginTop: 4 }}>{user?.email}</Text>
          </View>
        </View>
      </SettingsBlock>

      <SettingsBlock title="Session" caption="Signing out clears your session on this device only.">
        <Pressable
          onPress={async () => {
            await signOut();
            router.replace('/');
          }}
          style={[styles.signOutBtn, { borderColor: theme.colors.border }]}
        >
          <Icon name="arrowR" size={14} color="#ff6b81" />
          <Text style={{ fontFamily: theme.displayFont, fontWeight: '500', fontSize: 13, color: '#ff6b81' }}>Sign out</Text>
        </Pressable>
      </SettingsBlock>
    </View>
  );

  const NotImplementedTab = ({ label, note }: { label: string; note: string }) => (
    <View>
      <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: isDesktop ? 28 : 22, letterSpacing: -0.6, color: theme.colors.text, marginBottom: 12 }}>
        {label}
      </Text>
      <Text style={{ fontFamily: theme.bodyFont, fontSize: 13, lineHeight: 20, color: theme.colors.text3 }}>{note}</Text>
    </View>
  );

  const content =
    tab === 'design' ? (
      <DesignTab />
    ) : tab === 'account' ? (
      <AccountTab />
    ) : tab === 'premium' ? (
      <View>
        <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: isDesktop ? 28 : 22, letterSpacing: -0.6, color: theme.colors.text, marginBottom: 20 }}>
          Premium
        </Text>
        <LevelCard
          premium={ent.premium}
          level={ent.level}
          xp={ent.xp}
          xpIntoLevel={ent.xpIntoLevel}
          xpForNextLevel={ent.xpForNextLevel}
          chaptersRead={ent.chaptersRead}
          label={displayName}
        />
        <View style={{ marginTop: 28 }}>
          <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 16, color: theme.colors.text, marginBottom: 14 }}>
            Tiers
          </Text>
          <LevelLadder currentLevel={ent.level} premium={ent.premium} />
        </View>
      </View>
    ) : tab === 'downloads' ? (
      <View>
        <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: isDesktop ? 28 : 22, letterSpacing: -0.6, color: theme.colors.text, marginBottom: 12 }}>
          Downloads
        </Text>
        <Text style={{ fontFamily: theme.bodyFont, fontSize: 13, lineHeight: 20, color: theme.colors.text3, marginBottom: 18 }}>
          Storage budget, Wi-Fi rules, and everything you&rsquo;ve saved for offline reading.
        </Text>
        <Pressable onPress={() => router.push('/downloads')} style={[styles.primaryBtn, { backgroundColor: theme.accent, alignSelf: 'flex-start' }]}>
          <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 13.5, color: '#fff' }}>Open downloads</Text>
        </Pressable>
      </View>
    ) : tab === 'reading' ? (
      <NotImplementedTab label="Reading" note="Global reader defaults live in the reader's own settings sheet for now — open any chapter and tap the gear." />
    ) : (
      <NotImplementedTab label={TABS.find((t) => t.id === tab)?.label ?? ''} note="Not implemented yet." />
    );

  // ── Signed in ───────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <View style={{ flexDirection: 'row', gap: 40, maxWidth: 1280, width: '100%', alignSelf: 'center', paddingHorizontal: 32, paddingTop: 32, paddingBottom: 60 }}>
          <View style={{ width: 260 }}>
            <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 24, letterSpacing: -0.6, color: theme.colors.text, marginBottom: 18 }}>
              Settings
            </Text>
            <View style={{ gap: 2 }}>
              {TABS.map((t) => {
                const active = tab === t.id;
                return (
                  <Pressable
                    key={t.id}
                    onPress={() => setTab(t.id)}
                    style={[
                      styles.tabRow,
                      { backgroundColor: active ? theme.colors.surface2 : 'transparent', borderLeftColor: active ? theme.accent : 'transparent' },
                    ]}
                  >
                    <Icon name={t.icon} size={16} color={active ? theme.colors.text : theme.colors.text2} />
                    <Text style={{ fontFamily: theme.bodyFont, fontWeight: '500', fontSize: 13.5, color: active ? theme.colors.text : theme.colors.text2 }}>
                      {t.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={[styles.userCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <Avatar name={displayName} size={36} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text numberOfLines={1} style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 13, color: theme.colors.text }}>
                    {displayName}
                  </Text>
                  <Text numberOfLines={1} style={{ fontFamily: theme.bodyFont, fontSize: 11, color: theme.colors.text3, marginTop: 4 }}>
                    {user?.email}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={async () => {
                  await signOut();
                  router.replace('/');
                }}
                style={[styles.userCardBtn, { borderColor: theme.colors.border }]}
              >
                <Text style={{ fontFamily: theme.displayFont, fontWeight: '500', fontSize: 12, color: theme.colors.text2 }}>Sign out</Text>
              </Pressable>
            </View>
          </View>

          <View style={{ flex: 1, minWidth: 0 }}>{content}</View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={{ paddingHorizontal: 20, paddingTop: insets.top + 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <Avatar name={displayName} size={48} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text numberOfLines={1} style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 18, color: theme.colors.text }}>
              {displayName}
            </Text>
            <Text numberOfLines={1} style={{ fontFamily: theme.bodyFont, fontSize: 12, color: theme.colors.text3, marginTop: 3 }}>
              {user?.email}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingBottom: 16 }}>
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              style={[styles.chip, { backgroundColor: active ? theme.accentSoft : theme.colors.surface2, borderColor: active ? theme.accent : theme.colors.border }]}
            >
              <Icon name={t.icon} size={13} color={active ? theme.accent : theme.colors.text3} />
              <Text style={{ fontFamily: theme.bodyFont, fontSize: 12.5, fontWeight: '500', color: active ? theme.accent : theme.colors.text2 }}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ paddingHorizontal: 20 }}>{content}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  signedOutCard: { alignItems: 'center', padding: 28, borderRadius: 14, borderWidth: 1 },
  signedOutIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  primaryBtn: { paddingHorizontal: 22, paddingVertical: 12, borderRadius: 9, minHeight: 44, justifyContent: 'center' },
  secondaryBtn: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 9, borderWidth: 1, minHeight: 44, justifyContent: 'center' },
  tabRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, borderLeftWidth: 2 },
  userCard: { marginTop: 28, padding: 14, borderRadius: 10, borderWidth: 1 },
  userCardBtn: { marginTop: 12, paddingVertical: 8, borderRadius: 7, borderWidth: 1, alignItems: 'center' },
  signOutBtn: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 8, borderWidth: 1 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
});
