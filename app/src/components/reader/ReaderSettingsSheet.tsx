import React from 'react';
import { View, Text, Pressable, ScrollView, Modal, StyleSheet } from 'react-native';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { Icon } from '@/components/ui/Icon';
import { SheetSection, Seg, SwitchRow, SliderRow } from './SettingsControls';
import { ReaderSettingsState } from '@/theme/readerSettings';

// Ported from reader-frames.jsx `ReaderSettingsMobile` — same sections,
// reused for both mobile and desktop (desktop opens it as a right-anchored
// panel via the settings chrome button).
export function ReaderSettingsSheet({
  visible,
  onClose,
  settings,
  onChange,
  seriesTitle,
  chapterNumber,
}: {
  visible: boolean;
  onClose: () => void;
  settings: ReaderSettingsState;
  onChange: (patch: Partial<ReaderSettingsState>) => void;
  seriesTitle: string;
  chapterNumber: number;
}) {
  const { theme } = useMangaTheme();
  const isVertical = settings.mode === 'vertical';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderStrong }]}>
        <View style={styles.grabberRow}>
          <View style={[styles.grabber, { backgroundColor: theme.colors.surface3 }]} />
        </View>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 17, color: theme.colors.text, letterSpacing: -0.3 }}>
              Reader settings
            </Text>
            <Text style={{ fontFamily: theme.bodyFont, fontSize: 11, color: theme.colors.text3, marginTop: 5 }}>
              {seriesTitle} · Ch. {chapterNumber}
            </Text>
          </View>
          <Pressable onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.colors.surface2 }]}>
            <Icon name="x" size={15} color={theme.colors.text2} />
          </Pressable>
        </View>

        <ScrollView style={{ borderTopWidth: 1, borderTopColor: theme.colors.border }}>
          <SheetSection label="Reading mode" hint="Vertical is the default">
            <Seg
              cols={2}
              value={settings.mode}
              onChange={(mode) => onChange({ mode })}
              options={[
                { value: 'vertical', label: 'Vertical', sub: 'WEBTOON', glyph: 'vertical' },
                { value: 'rtl', label: 'Right → Left', sub: 'MANGA', glyph: 'rtl' },
                { value: 'ltr', label: 'Left → Right', sub: 'COMIC', glyph: 'ltr' },
                { value: 'single', label: 'Single page', sub: 'TAP', glyph: 'single' },
              ]}
            />
            {isVertical && (
              <View style={[styles.hintBox, { backgroundColor: theme.accentSoft, borderColor: theme.accent }]}>
                <Icon name="check" size={13} strokeWidth={2.2} color={theme.accent} />
                <Text style={{ flex: 1, fontFamily: theme.bodyFont, fontSize: 11, lineHeight: 15, color: theme.colors.text2 }}>
                  Continuous scroll — pages and chapters flow into each other with no page turns.
                </Text>
              </View>
            )}
          </SheetSection>

          <SheetSection label="Page fit">
            <Seg
              value={settings.fit}
              onChange={(fit) => onChange({ fit })}
              options={[
                { value: 'width', label: 'Fit width' },
                { value: 'height', label: 'Fit height' },
                { value: 'original', label: 'Original' },
              ]}
            />
          </SheetSection>

          <SheetSection label="Page gap" hint={isVertical ? undefined : 'Vertical only'}>
            <View style={{ opacity: isVertical ? 1 : 0.4 }} pointerEvents={isVertical ? 'auto' : 'none'}>
              <Seg
                value={settings.gap}
                onChange={(gap) => onChange({ gap })}
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'sm', label: 'Small' },
                  { value: 'md', label: 'Medium' },
                ]}
              />
            </View>
          </SheetSection>

          <SheetSection label="Display">
            <SliderRow label="Brightness" value={settings.brightness} onChange={(brightness) => onChange({ brightness })} min={20} max={100} />
            <View style={{ height: 6 }} />
            <SwitchRow label="Keep screen awake" sub="While the reader is open" on={settings.keepAwake} onToggle={(keepAwake) => onChange({ keepAwake })} />
            <SwitchRow label="Show tap zones" sub="Overlay guide on first tap" on={settings.tapZones} onToggle={(tapZones) => onChange({ tapZones })} />
          </SheetSection>

          <SheetSection label="Chapter flow">
            <SwitchRow
              label="Seamless next chapter"
              sub={isVertical ? 'Keep scrolling past the last page to roll into the next chapter' : 'Requires vertical reading mode'}
              on={isVertical && settings.seamless}
              onToggle={(seamless) => onChange({ seamless })}
              disabled={!isVertical}
            />
          </SheetSection>

          <SheetSection label="Apply to">
            <Seg
              value={settings.scope}
              onChange={(scope) => onChange({ scope })}
              options={[
                { value: 'series', label: 'This series' },
                { value: 'all', label: 'All series' },
              ]}
            />
          </SheetSection>

          <View style={{ padding: 16, paddingBottom: 28 }}>
            <Pressable style={[styles.doneBtn, { backgroundColor: theme.accent }]} onPress={onClose}>
              <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 14, color: '#fff' }}>Done</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '86%', borderTopWidth: 1, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  grabberRow: { paddingTop: 10, paddingBottom: 2, alignItems: 'center' },
  grabber: { width: 38, height: 4, borderRadius: 2 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  closeBtn: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  hintBox: { marginTop: 10, flexDirection: 'row', gap: 8, padding: 10, borderWidth: 1, borderRadius: 8 },
  doneBtn: { paddingVertical: 13, borderRadius: 10, alignItems: 'center' },
});
