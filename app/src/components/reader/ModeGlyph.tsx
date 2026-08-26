import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

import type { ReaderMode } from '@/theme/readerSettings';

// Ported from reader-frames.jsx `ModeGlyph` — tiny diagrams so reading
// direction reads at a glance in the settings sheet.
export function ModeGlyph({ kind, color }: { kind: ReaderMode; color: string }) {
  const box = { fill: 'none', stroke: color, strokeWidth: 1.4 } as const;
  if (kind === 'vertical') {
    return (
      <Svg width={28} height={20} viewBox="0 0 28 20">
        <Rect x={9} y={1} width={10} height={7} rx={1.5} {...box} />
        <Rect x={9} y={10} width={10} height={7} rx={1.5} {...box} />
        <Path d="M14 8.4v1.2" stroke={color} strokeWidth={1.4} />
        <Path d="M23 5v9M20.8 11.8L23 14.4l2.2-2.6" stroke={color} strokeWidth={1.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  if (kind === 'ltr') {
    return (
      <Svg width={28} height={20} viewBox="0 0 28 20">
        <Rect x={2} y={1} width={10} height={12} rx={1.5} {...box} />
        <Rect x={14} y={1} width={10} height={12} rx={1.5} {...box} />
        <Path d="M9 17h8M14.4 14.8L17 17l-2.6 2.2" stroke={color} strokeWidth={1.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  if (kind === 'rtl') {
    return (
      <Svg width={28} height={20} viewBox="0 0 28 20">
        <Rect x={2} y={4} width={10} height={12} rx={1.5} {...box} />
        <Rect x={14} y={4} width={10} height={12} rx={1.5} {...box} />
        <Path d="M17 17h-8M11.6 14.8L9 17l2.6 2.2" stroke={color} strokeWidth={1.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  return (
    <Svg width={28} height={20} viewBox="0 0 28 20">
      <Rect x={9} y={3} width={10} height={14} rx={1.5} {...box} />
    </Svg>
  );
}
