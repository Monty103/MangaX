import React, { useRef, useState } from 'react';
import { View, Text, Pressable, PanResponder, StyleSheet } from 'react-native';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { Icon } from '@/components/ui/Icon';
import { ModeGlyph } from './ModeGlyph';
import type { ReaderMode } from '@/theme/readerSettings';

// Ported from reader-frames.jsx `SheetSection`.
export function SheetSection({ label, hint, children }: { label: string; hint?: string | null; children: React.ReactNode }) {
  const { theme } = useMangaTheme();
  return (
    <View style={[styles.section, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.sectionHead}>
        <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase', color: theme.colors.text3 }}>
          {label}
        </Text>
        {hint ? <Text style={{ fontFamily: theme.bodyFont, fontSize: 10.5, color: theme.colors.text4 }}>{hint}</Text> : null}
      </View>
      {children}
    </View>
  );
}

interface SegOption<T extends string> {
  value: T;
  label: string;
  sub?: string;
  glyph?: ReaderMode;
}

// Ported from reader-frames.jsx `Seg` — segmented control that wraps into
// a 2-col grid when `cols` is given.
export function Seg<T extends string>({ options, value, onChange, cols }: { options: SegOption<T>[]; value: T; onChange: (v: T) => void; cols?: number }) {
  const { theme } = useMangaTheme();
  const columns = cols ?? options.length;
  const rows: SegOption<T>[][] = [];
  for (let i = 0; i < options.length; i += columns) rows.push(options.slice(i, i + columns));

  return (
    <View style={{ gap: 6 }}>
      {rows.map((row, ri) => (
        <View key={ri} style={{ flexDirection: 'row', gap: 6 }}>
          {row.map((o) => {
            const on = o.value === value;
            return (
              <Pressable
                key={o.value}
                onPress={() => onChange(o.value)}
                style={[
                  styles.segBtn,
                  { flex: 1, borderColor: on ? theme.accent : theme.colors.border, backgroundColor: on ? theme.accentSoft : theme.colors.surface2 },
                ]}
              >
                {o.glyph && <ModeGlyph kind={o.glyph} color={on ? theme.accent : theme.colors.text3} />}
                <Text style={{ fontFamily: theme.bodyFont, fontSize: 11.5, fontWeight: on ? '600' : '500', color: on ? theme.accent : theme.colors.text2 }}>
                  {o.label}
                </Text>
                {o.sub ? (
                  <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 9, color: theme.colors.text4, letterSpacing: 0.3 }}>{o.sub}</Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

// Ported from reader-frames.jsx `SwitchRow`.
export function SwitchRow({ label, sub, on, onToggle, disabled }: { label: string; sub?: string; on: boolean; onToggle: (v: boolean) => void; disabled?: boolean }) {
  const { theme } = useMangaTheme();
  return (
    <Pressable
      onPress={() => !disabled && onToggle(!on)}
      style={[styles.switchRow, { opacity: disabled ? 0.4 : 1 }]}
    >
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontFamily: theme.bodyFont, fontSize: 13, color: theme.colors.text }}>{label}</Text>
        {sub ? <Text style={{ fontFamily: theme.bodyFont, fontSize: 11, color: theme.colors.text3, marginTop: 3 }}>{sub}</Text> : null}
      </View>
      <View style={[styles.switchTrack, { backgroundColor: on ? theme.accent : theme.colors.surface3 }]}>
        <View style={[styles.switchThumb, { transform: [{ translateX: on ? 17 : 0 }] }]} />
      </View>
    </Pressable>
  );
}

// Custom slider (PanResponder-based, no extra native dependency) — ported
// from reader-frames.jsx `SliderRow`.
export function SliderRow({ label, value, onChange, min = 0, max = 100, unit = '%' }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; unit?: string }) {
  const { theme } = useMangaTheme();
  const [trackWidth, setTrackWidth] = useState(0);
  const trackWidthRef = useRef(0);

  const setFromX = (x: number) => {
    const w = trackWidthRef.current;
    if (w <= 0) return;
    const pct = Math.max(0, Math.min(1, x / w));
    onChange(Math.round(min + pct * (max - min)));
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => setFromX(e.nativeEvent.locationX),
      onPanResponderMove: (e) => setFromX(e.nativeEvent.locationX),
    })
  ).current;

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <View>
      <View style={styles.sliderHead}>
        <Text style={{ fontFamily: theme.bodyFont, fontSize: 13, color: theme.colors.text }}>{label}</Text>
        <Text style={{ fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 11.5, color: theme.colors.text3 }}>
          {value}
          {unit}
        </Text>
      </View>
      <View
        style={styles.sliderTrackWrap}
        onLayout={(e) => {
          trackWidthRef.current = e.nativeEvent.layout.width;
          setTrackWidth(e.nativeEvent.layout.width);
        }}
        {...pan.panHandlers}
      >
        <View style={[styles.sliderTrack, { backgroundColor: theme.colors.surface3 }]} />
        <View style={[styles.sliderFill, { width: `${pct}%`, backgroundColor: theme.accent }]} />
        <View style={[styles.sliderHandle, { left: `${pct}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 18, borderBottomWidth: 1, gap: 4 },
  sectionHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 11 },
  segBtn: { borderWidth: 1, borderRadius: 9, paddingVertical: 9, paddingHorizontal: 6, alignItems: 'center', gap: 5 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9 },
  switchTrack: { width: 42, height: 25, borderRadius: 999, padding: 2, flexShrink: 0 },
  switchThumb: { width: 21, height: 21, borderRadius: 11, backgroundColor: '#fff' },
  sliderHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9 },
  sliderTrackWrap: { height: 22, justifyContent: 'center' },
  sliderTrack: { position: 'absolute', left: 0, right: 0, height: 4, borderRadius: 2 },
  sliderFill: { position: 'absolute', left: 0, height: 4, borderRadius: 2 },
  sliderHandle: { position: 'absolute', width: 18, height: 18, marginLeft: -9, borderRadius: 9, backgroundColor: '#fff' },
});
