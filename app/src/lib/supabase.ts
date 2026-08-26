import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// EXPO_PUBLIC_* vars are inlined at build time and are safe to ship to the
// client — the anon key is meant to be public; access control lives in
// Postgres RLS policies (see supabase/schema.sql), not in secrecy of this
// key. Fill these in from your Supabase project's Settings > API page.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // Don't throw: screens fall back to mock data (src/data/mockSeries.ts)
  // until a real project is wired up, so the app stays runnable out of the
  // box for UI work.
  console.warn(
    '[supabase] EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY are not set — running against mock data only. See app/.env.example.'
  );
}

// `expo export`'s static web output prerenders every route once in plain
// Node (no `window`) to produce first-paint HTML. AsyncStorage's web shim
// reaches for `window.localStorage` as soon as the auth client is
// constructed (it restores the session eagerly), which crashes that Node
// pass. Real browsers and native both have a usable storage; only the
// web+no-window combination is the Node prerender, so swap in a no-op
// there — the client re-hydrates normally once the page's JS runs for real.
const isNodePrerender = Platform.OS === 'web' && typeof window === 'undefined';
const noopStorage = {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
};

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder', {
  auth: {
    storage: isNodePrerender ? noopStorage : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});
