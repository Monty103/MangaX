import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { ACCENTS, ACCENT_ORDER, FONTS, AccentKey, FontKey, DensityKey, DEFAULT_TWEAKS } from '@/theme/tokens';
import { CoverImage } from '@/components/ui/CoverImage';
import { Stars } from '@/components/ui/Stars';
import { Tag } from '@/components/ui/Tag';
import { Icon } from '@/components/ui/Icon';
import { SettingsBlock } from './SettingsBlock';

// Ported from account-frames.jsx `DesignTabDesktop` / `DesignTabMobile`.
// Every control here drives the real theme system, so changes apply live
// across the whole app rather than previewing a mock.
export function DesignTab() {
  const { theme, setAccent, setFont, setDensity } = useMangaTheme();
  const { isDesktop } = useBreakpoint();

  return (
    <View>
      <View style={{ marginBottom: 28 }}>
        <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: isDesktop ? 28 : 22, letterSpacing: -0.6, color: theme.colors.text }}>
          Design
        </Text>
        <Text style={{ fontFamily: theme.bodyFont, fontSize: 13, lineHeight: 20, color: theme.colors.text3, marginTop: 8 }}>
          Make MangaX feel like yours. Changes apply instantly and are saved on this device.
        </Text>
      </View>

      {/* Live preview — real components, so it genuinely reflects the theme. */}
      <View style={[styles.preview, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.eyebrow, { color: theme.colors.text3, fontFamily: theme.displayFont }]}>LIVE PREVIEW</Text>
        <View style={{ flexDirection: 'row', gap: 18, alignItems: 'center' }}>
          <CoverImage title="Iron Lantern" label="" style={{ width: 120 }} badge="Hot" />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 22, letterSpacing: -0.4, color: theme.colors.text }}>
              Iron Lantern
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              <Stars value={4.7} count={12840} />
              <Text style={{ fontFamily: theme.bodyFont, fontSize: 12, color: theme.colors.text3 }}>K. Mori · Ch. 142</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
              <Tag active>Action</Tag>
              <Tag active>Supernatural</Tag>
              <Tag>Magic</Tag>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
              <View style={[styles.previewBtn, { backgroundColor: theme.accent }]}>
                <Icon name="play" size={12} color="#fff" />
                <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 12.5, color: '#fff' }}>Continue</Text>
              </View>
              <View style={[styles.previewBtn, { backgroundColor: theme.colors.surface2, borderWidth: 1, borderColor: theme.colors.border }]}>
                <Icon name="bookmark" size={12} color={theme.colors.text} />
                <Text style={{ fontFamily: theme.displayFont, fontWeight: '500', fontSize: 12.5, color: theme.colors.text }}>Library</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <SettingsBlock
        title="Accent color"
        caption="Used for buttons, highlights, the active reader chapter, and your ratings."
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {ACCENT_ORDER.map((key) => {
            const p = ACCENTS[key];
            const active = theme.accentKey === key;
            return (
              <Pressable
                key={key}
                onPress={() => setAccent(key)}
                style={[
                  styles.swatch,
                  {
                    width: isDesktop ? 112 : '30%',
                    backgroundColor: p.hex,
                    borderColor: active ? p.hex : theme.colors.border,
                    borderWidth: active ? 3 : 1,
                  },
                ]}
              >
                {active && (
                  <View style={styles.swatchCheck}>
                    <Icon name="check" size={12} strokeWidth={2.6} color={p.hex} />
                  </View>
                )}
                <Text style={styles.swatchLabel}>{p.name}</Text>
              </Pressable>
            );
          })}
        </View>
      </SettingsBlock>

      <SettingsBlock
        title="Typography"
        caption="The display face is used for titles and chapter headings; body text stays Inter for legibility."
      >
        <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 10 }}>
          {(Object.keys(FONTS) as FontKey[]).map((key) => {
            const f = FONTS[key];
            const active = theme.fontKey === key;
            return (
              <Pressable
                key={key}
                onPress={() => setFont(key)}
                style={[
                  styles.fontChip,
                  { flex: isDesktop ? 1 : undefined, borderColor: active ? theme.accent : theme.colors.border, backgroundColor: active ? theme.accentSoft : theme.colors.surface2 },
                ]}
              >
                <Text style={{ fontFamily: f.display, fontSize: 20, fontWeight: '700', color: theme.colors.text }}>Iron Lantern</Text>
                <Text style={{ fontFamily: theme.bodyFont, fontSize: 11.5, fontWeight: '500', color: active ? theme.accent : theme.colors.text3, marginTop: 8 }}>
                  {f.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SettingsBlock>

      <SettingsBlock title="Layout density" caption="How tightly browse and library grids pack.">
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {(['compact', 'regular', 'comfy'] as DensityKey[]).map((key) => {
            const active = theme.densityKey === key;
            return (
              <Pressable
                key={key}
                onPress={() => setDensity(key)}
                style={[
                  styles.densityChip,
                  { borderColor: active ? theme.accent : theme.colors.border, backgroundColor: active ? theme.accentSoft : theme.colors.surface2 },
                ]}
              >
                <View style={{ flexDirection: 'row', gap: 3, marginBottom: 10 }}>
                  {Array.from({ length: key === 'compact' ? 5 : key === 'regular' ? 4 : 3 }).map((_, i) => (
                    <View
                      key={i}
                      style={{
                        width: key === 'compact' ? 8 : key === 'regular' ? 11 : 15,
                        height: key === 'compact' ? 12 : key === 'regular' ? 16 : 21,
                        borderRadius: 2,
                        backgroundColor: active ? theme.accent : theme.colors.surface3,
                      }}
                    />
                  ))}
                </View>
                <Text style={{ fontFamily: theme.bodyFont, fontSize: 12, fontWeight: '500', color: active ? theme.accent : theme.colors.text2, textTransform: 'capitalize' }}>
                  {key}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SettingsBlock>

      <SettingsBlock title="Reset" caption="Roll back to MangaX defaults — you can re-customize at any time.">
        <Pressable
          onPress={() => {
            setAccent(DEFAULT_TWEAKS.accent);
            setFont(DEFAULT_TWEAKS.font);
            setDensity(DEFAULT_TWEAKS.density);
          }}
          style={[styles.resetBtn, { borderColor: theme.colors.border }]}
        >
          <Text style={{ fontFamily: theme.displayFont, fontWeight: '500', fontSize: 13, color: theme.colors.text2 }}>Reset design</Text>
        </Pressable>
      </SettingsBlock>
    </View>
  );
}

const styles = StyleSheet.create({
  preview: { marginBottom: 32, padding: 20, borderRadius: 12, borderWidth: 1 },
  eyebrow: { fontSize: 11, fontWeight: '600', letterSpacing: 1.6, marginBottom: 14 },
  previewBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 7 },
  swatch: { height: 76, borderRadius: 10, justifyContent: 'flex-end', padding: 10, minWidth: 96 },
  swatchCheck: { position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  swatchLabel: { fontSize: 11, fontWeight: '600', color: '#fff' },
  fontChip: { padding: 16, borderRadius: 10, borderWidth: 1, alignItems: 'flex-start' },
  densityChip: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  resetBtn: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, borderWidth: 1 },
});
