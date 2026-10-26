import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import type { Session, User } from '@supabase/supabase-js';

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface AuthResult {
  error: string | null;
  // Set when sign-up succeeded but the account still needs email
  // confirmation before a session exists.
  needsConfirmation?: boolean;
  // Set when the user backed out of a social sign-in. Not an error, but
  // not a success either — callers must not treat it as signed in.
  cancelled?: boolean;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  /** False until the stored session has been restored — gate redirects on this. */
  ready: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, displayName: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setReady(true);
      return;
    }
    let cancelled = false;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!cancelled) setSession(data.session ?? null);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured) return { error: 'Supabase is not configured. Add your project URL and key to .env.local.' };
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      return { error: error?.message ?? null };
    } catch (err: any) {
      return { error: err?.message ?? 'Could not reach the server. Check your connection.' };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured) return { error: 'Supabase is not configured. Add your project URL and key to .env.local.' };
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        // Lands in raw_user_meta_data; the profiles row itself is created by
        // the on_auth_user_created trigger (see supabase/migrations/).
        options: { data: { display_name: displayName.trim() } },
      });
      if (error) return { error: error.message };
      return { error: null, needsConfirmation: !data.session };
    } catch (err: any) {
      return { error: err?.message ?? 'Could not reach the server. Check your connection.' };
    }
  }, []);

  /**
   * Google sign-in through Supabase.
   *
   * Two flows, because the platforms differ:
   *  - Web: Supabase redirects the page to Google and back. The session is
   *    picked up from the URL by `detectSessionInUrl`.
   *  - Native: we ask Supabase for the authorize URL, open it in a secure
   *    in-app browser tab, and exchange the code it returns for a session.
   *
   * Requires Google to be enabled under Authentication > Providers in the
   * Supabase dashboard; until then Supabase returns a "provider is not
   * enabled" error, which is surfaced to the user as-is.
   */
  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured. Add your project URL and key to .env.local.' };
    }
    try {
      const redirectTo = Linking.createURL('/auth/callback');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          // On web let Supabase navigate; on native we drive the browser.
          skipBrowserRedirect: Platform.OS !== 'web',
        },
      });

      if (error) return { error: error.message };
      if (Platform.OS === 'web') return { error: null };

      if (!data?.url) return { error: 'Google sign-in could not be started.' };

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type !== 'success') {
        // Backing out is a normal user action, not an error to shout about —
        // but it is not a sign-in either, so flag it so callers don't
        // navigate as though it worked.
        const backedOut = result.type === 'cancel' || result.type === 'dismiss';
        return backedOut ? { error: null, cancelled: true } : { error: 'Google sign-in did not complete.' };
      }

      const parsed = Linking.parse(result.url);
      const code = parsed.queryParams?.code;
      if (typeof code === 'string') {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        return { error: exchangeError?.message ?? null };
      }

      // Implicit flow fallback: tokens arrive in the URL fragment.
      const fragment = result.url.split('#')[1] ?? '';
      const params = new URLSearchParams(fragment);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      if (access_token && refresh_token) {
        const { error: sessionError } = await supabase.auth.setSession({ access_token, refresh_token });
        return { error: sessionError?.message ?? null };
      }

      return { error: 'Google sign-in returned no session.' };
    } catch (err: any) {
      return { error: err?.message ?? 'Could not reach the server. Check your connection.' };
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.auth.signOut();
    } catch {
      // Local session is cleared by onAuthStateChange regardless.
    }
  }, []);

  const value = useMemo(
    () => ({ session, user: session?.user ?? null, ready, signIn, signUp, signInWithGoogle, signOut }),
    [session, ready, signIn, signUp, signInWithGoogle, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
