import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { Icon } from '@/components/ui/Icon';

// Top chrome — ported from mobile-frames.jsx `ReaderMobile` top overlay and
// desktop-frames-2.jsx `ReaderDesktop` top bar.
export function ReaderTopChrome({
  visible,
  seriesTitle,
  chapterNumber,
  subtitle,
  onBack,
  onOpenSettings,
}: {
  visible: boolean;
  seriesTitle: string;
  chapterNumber: number;
  subtitle: string;
  onBack: () => void;
  onOpenSettings: () => void;
}) {
  const { theme } = useMangaTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.topWrap, { opacity: visible ? 1 : 0, paddingTop: insets.top + 14 }]} pointerEvents={visible ? 'auto' : 'none'}>
      <LinearGradient colors={['rgba(10,10,12,0.95)', 'transparent']} style={StyleSheet.absoluteFill} />
      <Pressable onPress={onBack} hitSlop={8}>
        <Icon name="chevronL" size={22} color={theme.colors.text} />
      </Pressable>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 13, color: theme.colors.text }}>
          {seriesTitle} · Ch. {chapterNumber}
        </Text>
        <Text numberOfLines={1} style={{ fontFamily: theme.bodyFont, fontSize: 10.5, fontWeight: '500', color: theme.colors.text3, marginTop: 3 }}>
          {subtitle}
        </Text>
      </View>
      <Icon name="bookmark" size={20} color={theme.colors.text} />
      <Pressable onPress={onOpenSettings} hitSlop={8}>
        <Icon name="settings" size={20} color={theme.colors.text} />
      </Pressable>
    </View>
  );
}

// Bottom chrome — page progress + prev/current/next chapter navigation.
// Ported from mobile-frames.jsx `ReaderMobile` bottom overlay (added in
// chats/chat2.md's first request).
export function ReaderBottomChrome({
  visible,
  page,
  pageCount,
  chapter,
  totalChapters,
  pickerOpen,
  onTogglePicker,
  onPrev,
  onNext,
}: {
  visible: boolean;
  page: number;
  pageCount: number;
  chapter: number;
  totalChapters: number;
  pickerOpen: boolean;
  onTogglePicker: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { theme } = useMangaTheme();
  const insets = useSafeAreaInsets();
  const atFirst = chapter <= 1;
  const atLast = chapter >= totalChapters;
  const pct = pageCount > 0 ? Math.min(100, (page / pageCount) * 100) : 0;

  return (
    <View
      style={[styles.bottomWrap, { opacity: visible ? 1 : 0, paddingBottom: insets.bottom + 16 }]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <LinearGradient colors={['transparent', 'rgba(10,10,12,0.95)']} locations={[0, 0.4]} style={StyleSheet.absoluteFill} />

      <View style={styles.progressRow}>
        <Text style={{ fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 10.5, color: theme.colors.text3 }}>{page}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: theme.accent }]} />
        </View>
        <Text style={{ fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 10.5, color: theme.colors.text3 }}>{pageCount}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable onPress={onPrev} disabled={atFirst} style={[styles.navBtn, { opacity: atFirst ? 0.45 : 1 }]}>
          <Icon name="chevronL" size={13} color={atFirst ? theme.colors.text3 : theme.colors.text} />
          <View style={{ alignItems: 'flex-start', gap: 3 }}>
            <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 9, color: theme.colors.text3, letterSpacing: 0.4 }}>PREV</Text>
            <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 11.5, color: atFirst ? theme.colors.text3 : theme.colors.text }}>
              Ch. {Math.max(1, chapter - 1)}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={onTogglePicker}
          style={[
            styles.chapterBtn,
            { backgroundColor: pickerOpen ? theme.accentSoft : 'rgba(255,255,255,0.06)', borderColor: pickerOpen ? theme.accent : 'rgba(255,255,255,0.08)' },
          ]}
        >
          <View style={{ alignItems: 'center', gap: 3 }}>
            <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 9, color: theme.colors.text3, letterSpacing: 0.5 }}>CHAPTER</Text>
            <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 14, color: theme.colors.text }}>
              {chapter} <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 11, color: theme.colors.text3 }}>/ {totalChapters}</Text>
            </Text>
          </View>
          <Icon name="chevronD" size={13} color={theme.colors.text} />
        </Pressable>

        <Pressable
          onPress={onNext}
          disabled={atLast}
          style={[
            styles.navBtn,
            {
              backgroundColor: atLast ? 'rgba(255,255,255,0.06)' : theme.accent,
              borderColor: atLast ? 'rgba(255,255,255,0.08)' : theme.accent,
              opacity: atLast ? 0.55 : 1,
            },
          ]}
        >
          <View style={{ alignItems: 'flex-end', gap: 3 }}>
            <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 9, color: atLast ? theme.colors.text3 : 'rgba(255,255,255,0.7)', letterSpacing: 0.4 }}>
              NEXT
            </Text>
            <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 11.5, color: atLast ? theme.colors.text3 : '#fff' }}>
              Ch. {Math.min(totalChapters, chapter + 1)}
            </Text>
          </View>
          <Icon name="chevronR" size={13} color={atLast ? theme.colors.text3 : '#fff'} />
        </Pressable>
      </View>
    </View>
  );
}

// Chapter picker — anchored above the bottom chrome.
export function ChapterPicker({
  visible,
  chapters,
  current,
  totalChapters,
  onSelect,
  bottomOffset,
}: {
  visible: boolean;
  chapters: number[];
  current: number;
  totalChapters: number;
  onSelect: (n: number) => void;
  bottomOffset: number;
}) {
  const { theme } = useMangaTheme();
  if (!visible) return null;

  return (
    <View style={[styles.picker, { bottom: bottomOffset, backgroundColor: 'rgba(20,20,22,0.98)', borderColor: theme.colors.border }]}>
      <View style={[styles.pickerHead, { borderBottomColor: theme.colors.border }]}>
        <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 12, color: theme.colors.text }}>Jump to chapter</Text>
        <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 10.5, color: theme.colors.text3 }}>{totalChapters} total</Text>
      </View>
      <ScrollView style={{ maxHeight: 232 }}>
        {chapters.map((n) => {
          const isCurrent = n === current;
          return (
            <Pressable
              key={n}
              onPress={() => onSelect(n)}
              style={[styles.pickerRow, { backgroundColor: isCurrent ? theme.accentSoft : 'transparent' }]}
            >
              <Text style={{ width: 40, fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 12, color: isCurrent ? theme.accent : theme.colors.text2 }}>
                Ch.{n}
              </Text>
              <Text numberOfLines={1} style={{ flex: 1, fontFamily: theme.bodyFont, fontSize: 12, color: isCurrent ? theme.colors.text : theme.colors.text2 }}>
                Chapter {n}
              </Text>
              {isCurrent && (
                <Text style={{ fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 9, color: theme.accent, letterSpacing: 0.4 }}>READING</Text>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 6,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bottomWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 5, paddingHorizontal: 12, paddingTop: 14 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 4, marginBottom: 12 },
  progressTrack: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chapterBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1 },
  picker: { position: 'absolute', left: 12, right: 12, zIndex: 7, borderWidth: 1, borderRadius: 12, overflow: 'hidden', maxHeight: 280 },
  pickerHead: { paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 },
  pickerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
});
