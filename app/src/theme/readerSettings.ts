export type ReaderMode = 'vertical' | 'rtl' | 'ltr' | 'single';
export type PageFit = 'width' | 'height' | 'original';
export type PageGap = 'none' | 'sm' | 'md';
export type ReaderScope = 'series' | 'all';

export interface ReaderSettingsState {
  mode: ReaderMode;
  fit: PageFit;
  gap: PageGap;
  brightness: number; // 20..100
  seamless: boolean;
  tapZones: boolean;
  keepAwake: boolean;
  scope: ReaderScope;
}

// Vertical is the default everywhere, per chats/chat2.md.
export const DEFAULT_READER_SETTINGS: ReaderSettingsState = {
  mode: 'vertical',
  fit: 'width',
  gap: 'none',
  brightness: 100,
  seamless: true,
  tapZones: true,
  keepAwake: true,
  scope: 'all',
};

export const GAP_PX: Record<PageGap, number> = { none: 0, sm: 6, md: 16 };
