import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AccentKey, DensityKey, FontKey, MangaTheme, DEFAULT_TWEAKS, buildTheme } from './tokens';

const STORAGE_KEY = 'mangax.theme.v1';

interface ThemeContextValue {
  theme: MangaTheme;
  setAccent: (accent: AccentKey) => void;
  setFont: (font: FontKey) => void;
  setDensity: (density: DensityKey) => void;
  ready: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Local-first: tweaks apply instantly and persist to device storage. Once
// auth (task #10/#11) is wired up, the same setters additionally push to the
// user's `profiles.theme` column in Supabase so the choice syncs across
// devices — this provider is the single place that would change.
export function MangaThemeProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<AccentKey>(DEFAULT_TWEAKS.accent);
  const [font, setFontState] = useState<FontKey>(DEFAULT_TWEAKS.font);
  const [density, setDensityState] = useState<DensityKey>(DEFAULT_TWEAKS.density);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (cancelled || !raw) {
        setReady(true);
        return;
      }
      try {
        const saved = JSON.parse(raw);
        if (saved.accent) setAccentState(saved.accent);
        if (saved.font) setFontState(saved.font);
        if (saved.density) setDensityState(saved.density);
      } catch {
        // corrupt/old value — fall back to defaults
      } finally {
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: { accent: AccentKey; font: FontKey; density: DensityKey }) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const setAccent = useCallback(
    (v: AccentKey) => {
      setAccentState(v);
      persist({ accent: v, font, density });
    },
    [font, density, persist]
  );
  const setFont = useCallback(
    (v: FontKey) => {
      setFontState(v);
      persist({ accent, font: v, density });
    },
    [accent, density, persist]
  );
  const setDensity = useCallback(
    (v: DensityKey) => {
      setDensityState(v);
      persist({ accent, font, density: v });
    },
    [accent, font, persist]
  );

  const theme = useMemo(() => buildTheme(accent, font, density), [accent, font, density]);

  const value = useMemo(
    () => ({ theme, setAccent, setFont, setDensity, ready }),
    [theme, setAccent, setFont, setDensity, ready]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useMangaTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useMangaTheme must be used within MangaThemeProvider');
  return ctx;
}
