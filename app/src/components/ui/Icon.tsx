import React from 'react';
import Svg, { Path } from 'react-native-svg';

// Ported 1:1 from project/shared.jsx `Icon` — same path data, same 24x24
// viewBox, stroke-based so `color` always drives the tint.
const PATHS: Record<string, string | string[]> = {
  home: 'M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  book: 'M4 4h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4zM20 4h-6a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h6z',
  search: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM16 16l5 5',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 21h4',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  bookmark: 'M6 3h12v18l-6-4-6 4z',
  bookmarkF: 'M6 3h12v18l-6-4-6 4z',
  download: 'M12 3v12M6 11l6 6 6-6M4 21h16',
  heart: 'M12 21S4 14.5 4 9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-8 12-8 12z',
  settings:
    'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1A7 7 0 0 0 14.4 5l-.4-2.5h-4l-.4 2.5a7 7 0 0 0-2.1 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1c.6.5 1.4.9 2.1 1.2l.4 2.5h4l.4-2.5c.7-.3 1.5-.7 2.1-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z',
  chevronR: 'M9 5l7 7-7 7',
  chevronL: 'M15 5l-7 7 7 7',
  chevronD: 'M5 9l7 7 7-7',
  chevronU: 'M5 15l7-7 7 7',
  plus: 'M12 5v14M5 12h14',
  x: 'M6 6l12 12M6 18L18 6',
  filter: 'M3 5h18M6 12h12M10 19h4',
  sort: 'M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z',
  comment: 'M4 5h16v11H8l-4 4z',
  share: 'M4 12a4 4 0 1 0 0 .01zM20 5a4 4 0 1 0 0 .01zM20 19a4 4 0 1 0 0 .01zM7 10l10-5M7 14l10 5',
  play: 'M6 4l14 8-14 8z',
  flame: 'M12 2s5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 1-5s4-3 4-5zM12 22a3 3 0 0 0 3-3c0-2-3-4-3-4s-3 2-3 4a3 3 0 0 0 3 3z',
  star: 'M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',
  bars: 'M4 6h16M4 12h16M4 18h16',
  arrowR: 'M5 12h14M13 5l7 7-7 7',
  arrowL: 'M19 12H5M11 5l-7 7 7 7',
  check: 'M5 12l5 5 9-11',
  wifi: 'M5 12.5a10 10 0 0 1 14 0M8 16a6 6 0 0 1 8 0M12 19.5h.01',
  cellular: 'M2 19h2v3H2zM7 16h2v6H7zM12 13h2v9h-2zM17 9h2v13h-2z',
  battery: 'M3 8h16v8H3zM21 11v2',
  cloud: 'M7 18a4 4 0 1 1 .9-7.9A5 5 0 0 1 18 12a3 3 0 0 1-1 6z',
  history: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 7v5l3 2',
  crown: 'M3 8l4 3 5-6 5 6 4-3-2 11H5z',
  sparkle:
    'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  upload: 'M12 20V8M6 12l6-6 6 6M4 4h16',
  trophy: 'M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M9 20h6M12 14v6',
  camera: 'M4 8h3l1.5-2h7L17 8h3v12H4zM12 11a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8h.01M11.5 11.5h1V17h-1z',
};

export function Icon({
  name,
  size = 18,
  color = '#f4f4f6',
  strokeWidth = 1.6,
}: {
  name: keyof typeof PATHS;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const d = PATHS[name];
  if (!d) return null;
  const paths = Array.isArray(d) ? d : [d];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {paths.map((p, i) => (
        <Path
          key={i}
          d={p}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </Svg>
  );
}

export type IconName = keyof typeof PATHS;
