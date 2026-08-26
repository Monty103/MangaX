// MangaX design tokens — ported 1:1 from the Claude Design prototype
// (project/shared.jsx `themeVars`, `ACCENTS`, `FONTS`). The prototype used
// CSS variables cascaded onto each frame's root; React Native has no CSS
// cascade, so the same values are exposed through `useTheme()` instead and
// consumed directly by every component.

export type AccentKey = 'crimson' | 'amber' | 'iris' | 'mint' | 'rose' | 'azure' | 'ember' | 'sage';
export type FontKey = 'grotesk' | 'serif' | 'mono';
export type DensityKey = 'compact' | 'regular' | 'comfy';

// The first three are the prototype's tweak-panel swatches; the rest come
// from the Design tab's 8-preset grid (account-frames.jsx ACCENT_PRESETS),
// so every preset the settings screen offers is a real, working accent.
export const ACCENTS: Record<AccentKey, { hex: string; soft: string; name: string }> = {
  crimson: { hex: '#ff2e4d', soft: 'rgba(255,46,77,0.15)', name: 'Crimson' },
  amber: { hex: '#ff9e2c', soft: 'rgba(255,158,44,0.15)', name: 'Amber' },
  iris: { hex: '#7c5cff', soft: 'rgba(124,92,255,0.15)', name: 'Iris' },
  mint: { hex: '#34d399', soft: 'rgba(52,211,153,0.15)', name: 'Mint' },
  rose: { hex: '#fb7185', soft: 'rgba(251,113,133,0.15)', name: 'Rose' },
  azure: { hex: '#38bdf8', soft: 'rgba(56,189,248,0.15)', name: 'Azure' },
  ember: { hex: '#fb923c', soft: 'rgba(251,146,60,0.15)', name: 'Ember' },
  sage: { hex: '#a3e635', soft: 'rgba(163,230,53,0.15)', name: 'Sage' },
};

export const ACCENT_ORDER: AccentKey[] = ['crimson', 'amber', 'iris', 'mint', 'rose', 'azure', 'ember', 'sage'];

// Font family names as registered with `expo-font` in ThemeProvider's font
// loader (see theme/fonts.ts). `body` is always Inter — only the display
// pairing changes.
export const FONTS: Record<FontKey, { display: string; body: string; name: string }> = {
  grotesk: { display: 'SpaceGrotesk_600SemiBold', body: 'Inter_400Regular', name: 'Grotesk + Inter' },
  serif: { display: 'Fraunces_700Bold', body: 'Inter_400Regular', name: 'Editorial Serif' },
  mono: { display: 'JetBrainsMono_600SemiBold', body: 'Inter_400Regular', name: 'Mono Display' },
};

// Density only changes cover-grid card sizing/gap on Browse — matches the
// prototype's `density` tweak.
export const DENSITY: Record<DensityKey, { columnsMobile: number; gap: number; minCardWidth: number }> = {
  compact: { columnsMobile: 3, gap: 8, minCardWidth: 96 },
  regular: { columnsMobile: 2, gap: 12, minCardWidth: 128 },
  comfy: { columnsMobile: 2, gap: 16, minCardWidth: 152 },
};

// Base palette — the design is dark-mode-first (near-black + crimson), so
// this is the only palette for now. A light "Paper"/"Sepia" preset from the
// Account > Design tab (chat1) can extend this map later without touching
// consumers, since everything reads through `useTheme()`.
export const BASE = {
  bg: '#0a0a0c',
  surface: '#131318',
  surface2: '#1c1c24',
  surface3: '#26262f',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.14)',
  text: '#f4f4f6',
  text2: 'rgba(244,244,246,0.72)',
  text3: 'rgba(244,244,246,0.48)',
  text4: 'rgba(244,244,246,0.30)',
};

export interface MangaTheme {
  accentKey: AccentKey;
  fontKey: FontKey;
  densityKey: DensityKey;
  accent: string;
  accentSoft: string;
  displayFont: string;
  bodyFont: string;
  density: (typeof DENSITY)[DensityKey];
  colors: typeof BASE;
}

export function buildTheme(accentKey: AccentKey, fontKey: FontKey, densityKey: DensityKey): MangaTheme {
  const a = ACCENTS[accentKey] ?? ACCENTS.crimson;
  const f = FONTS[fontKey] ?? FONTS.grotesk;
  return {
    accentKey,
    fontKey,
    densityKey,
    accent: a.hex,
    accentSoft: a.soft,
    displayFont: f.display,
    bodyFont: f.body,
    density: DENSITY[densityKey] ?? DENSITY.comfy,
    colors: BASE,
  };
}

export const DEFAULT_TWEAKS: { accent: AccentKey; font: FontKey; density: DensityKey } = {
  accent: 'crimson',
  font: 'mono',
  density: 'comfy',
};
