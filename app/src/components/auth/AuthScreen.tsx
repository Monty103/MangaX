import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useAuth } from '@/auth/AuthProvider';
import { CoverImage } from '@/components/ui/CoverImage';
import { Icon } from '@/components/ui/Icon';
import { Field, SSOBtn, Checkbox, Divider, Banner } from './AuthFields';

// Ported from account-frames.jsx `SignInDesktop` / `SignInMobile`. The
// prototype's split-panel desktop layout collapses to the mobile stacked
// form below the breakpoint, so both modes share one component.
export function AuthScreen({ mode }: { mode: 'signin' | 'signup' }) {
  const isUp = mode === 'signup';
  const { theme } = useMangaTheme();
  const { isDesktop } = useBreakpoint();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setInfo(null);

    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.');
      return;
    }
    if (isUp && !agreed) {
      setError('Please confirm you have read the Terms and Privacy Notice.');
      return;
    }
    if (isUp && password.length < 10) {
      setError('Choose a password of at least 10 characters.');
      return;
    }

    setBusy(true);
    const res = isUp ? await signUp(email, password, displayName) : await signIn(email, password);
    setBusy(false);

    if (res.error) {
      setError(res.error);
      return;
    }
    if (res.needsConfirmation) {
      setInfo(`Check ${email.trim()} for a confirmation link to finish creating your account.`);
      return;
    }
    router.replace('/');
  };

  const googleSignIn = async () => {
    setError(null);
    setInfo(null);
    setBusy(true);
    const res = await signInWithGoogle();
    setBusy(false);

    if (res.error) {
      setError(res.error);
      return;
    }
    // Backing out of the Google sheet leaves the form exactly as it was.
    if (res.cancelled) return;
    // On web the page redirects to Google, so there is nothing to do here.
    if (Platform.OS !== 'web') router.replace('/');
  };

  const form = (
    <View style={{ width: '100%', maxWidth: 460 }}>
      <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: isDesktop ? 32 : 26, lineHeight: isDesktop ? 36 : 30, letterSpacing: -0.7, color: theme.colors.text, marginBottom: 8 }}>
        {isUp ? 'Create your account' : 'Welcome back'}
      </Text>
      <Text style={{ fontFamily: theme.bodyFont, fontSize: 14, lineHeight: 21, color: theme.colors.text3, marginBottom: 28 }}>
        {isUp
          ? 'A reader account syncs your progress, library, downloads, and the design tweaks you make.'
          : 'Sign in to pick up where you left off across devices.'}
      </Text>

      {/* Google only, per the current scope: Sign in with Apple is parked
          until there's an Apple Developer account, and a dead button beside
          a working one reads as broken. Adding a provider back is one line. */}
      <View style={{ marginBottom: 24 }}>
        <SSOBtn label={isUp ? 'Sign up with Google' : 'Continue with Google'} glyph="G" onPress={googleSignIn} disabled={busy} />
      </View>

      <Divider label="or with email" />

      {error && <Banner kind="error">{error}</Banner>}
      {info && <Banner kind="info">{info}</Banner>}

      {isUp && (
        <Field label="Display name" value={displayName} onChangeText={setDisplayName} placeholder="silverfen" editable={!busy} />
      )}
      <Field label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" type="email" editable={!busy} />
      <Field
        label={isUp ? 'Create password' : 'Password'}
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••••"
        type="password"
        hint={isUp ? 'At least 10 characters' : null}
        forgot={!isUp}
        onForgot={() => setInfo('Password reset is not wired up yet.')}
        editable={!busy}
      />

      {isUp ? (
        <Checkbox checked={agreed} onToggle={() => setAgreed((a) => !a)}>
          I&rsquo;m 16+ and I&rsquo;ve read the Terms and Privacy Notice.
        </Checkbox>
      ) : (
        <Checkbox checked={keepSignedIn} onToggle={() => setKeepSignedIn((k) => !k)}>
          Keep me signed in for 30 days
        </Checkbox>
      )}

      <Pressable
        onPress={submit}
        disabled={busy}
        style={[styles.submit, { backgroundColor: theme.accent, opacity: busy ? 0.7 : 1 }]}
      >
        {busy ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 14, color: '#fff' }}>
              {isUp ? 'Create account' : 'Sign in'}
            </Text>
            <Icon name="arrowR" size={14} color="#fff" />
          </>
        )}
      </Pressable>

      <View style={{ flexDirection: 'row', gap: 5, marginTop: 22, flexWrap: 'wrap' }}>
        <Text style={{ fontFamily: theme.bodyFont, fontSize: 13, fontWeight: '500', color: theme.colors.text3 }}>
          {isUp ? 'Already have an account?' : "Don't have an account?"}
        </Text>
        <Pressable onPress={() => router.replace(isUp ? '/auth/sign-in' : '/auth/sign-up')}>
          <Text style={{ fontFamily: theme.bodyFont, fontSize: 13, fontWeight: '600', color: theme.accent }}>
            {isUp ? 'Sign in' : 'Create one'}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: theme.colors.bg }}>
        <View style={[styles.artPanel, { borderRightColor: theme.colors.border }]}>
          <CoverImage title="Iron Lantern" label="auth_art.jpg" style={{ width: '100%', height: '100%', borderRadius: 0 }} />
          <LinearGradient colors={['rgba(10,10,12,0.55)', 'rgba(10,10,12,0.85)']} style={StyleSheet.absoluteFill} />
          <View style={styles.artInner}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.brandMark, { backgroundColor: theme.accent }]}>
                <View style={[styles.brandMarkCut, { backgroundColor: theme.colors.bg }]} />
              </View>
              <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 22, letterSpacing: -0.4, color: theme.colors.text }}>
                MangaX
              </Text>
            </View>
            <View>
              <Text style={{ fontFamily: theme.displayFont, fontWeight: '500', fontSize: 11, letterSpacing: 1.8, textTransform: 'uppercase', color: theme.accent, marginBottom: 14 }}>
                Built for long sessions
              </Text>
              <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 38, lineHeight: 42, letterSpacing: -0.9, color: theme.colors.text, maxWidth: 480 }}>
                Your library, your reading position, on every device — at the speed your night demands.
              </Text>
            </View>
            <Text style={{ fontFamily: theme.bodyFont, fontSize: 12, lineHeight: 18, color: theme.colors.text3, maxWidth: 460 }}>
              Cover art is a generated placeholder until real assets are wired up.
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.formPanel}>{form}</ScrollView>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: insets.top + 16, paddingBottom: 40 }}
    >
      <Pressable onPress={() => router.back()} hitSlop={10} style={{ marginBottom: 20, alignSelf: 'flex-start' }}>
        <Icon name="chevronL" size={22} color={theme.colors.text} />
      </Pressable>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 28 }}>
        <View style={[styles.brandMark, { backgroundColor: theme.accent }]}>
          <View style={[styles.brandMarkCut, { backgroundColor: theme.colors.bg }]} />
        </View>
        <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 20, letterSpacing: -0.4, color: theme.colors.text }}>
          MangaX
        </Text>
      </View>
      {form}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  artPanel: { flex: 1, position: 'relative', overflow: 'hidden', borderRightWidth: 1 },
  artInner: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 56, justifyContent: 'space-between' },
  formPanel: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 60, paddingVertical: 60 },
  brandMark: { width: 26, height: 26, borderRadius: 5 },
  brandMarkCut: { position: 'absolute', top: 5, bottom: 5, left: 11, right: 5, borderRadius: 1 },
  submit: { marginTop: 24, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 48 },
});
