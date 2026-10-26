import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { Icon } from '@/components/ui/Icon';

const RING_CIRCUMFERENCE = 157; // 2πr for r=25

// Ported from reader-frames.jsx `ReaderEndChapterMobile`'s seam block: the
// end-of-chapter card that sits between the last page of one chapter and
// the stitched first page of the next. `pull` (0..1) is how far the reader
// has scrolled through the seam; at 1 the next chapter commits.
export function ChapterSeam({
  chapter,
  prevChapter,
  nextChapter,
  lastChapter,
  pull,
  seamless,
  onPrev,
  onNext,
}: {
  chapter: number;
  prevChapter: number | null;
  nextChapter: number | null;
  /** Highest chapter number; shown as "X OF last" (a count reads wrong once numbers skip). */
  lastChapter: number;
  pull: number;
  seamless: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { theme } = useMangaTheme();
  const complete = pull >= 1;

  return (
    <View style={[styles.seam, { backgroundColor: theme.colors.bg }]}>
      <Text style={{ fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 10, letterSpacing: 1.6, color: theme.colors.text4 }}>
        END OF CHAPTER {chapter}
      </Text>
      <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 21, lineHeight: 25, letterSpacing: -0.4, color: theme.colors.text, marginTop: 10, textAlign: 'center' }}>
        Chapter {chapter}
      </Text>

      <View style={styles.actions}>
        {([
          { icon: 'star', label: 'Rate' },
          { icon: 'comment', label: 'Comments' },
          { icon: 'bookmark', label: 'Save' },
          { icon: 'share', label: 'Share' },
        ] as const).map((a) => (
          <View key={a.label} style={[styles.actionBtn, { backgroundColor: theme.colors.surface2, borderColor: theme.colors.border }]}>
            <Icon name={a.icon} size={13} color={theme.colors.text2} />
            <Text style={{ fontFamily: theme.bodyFont, fontSize: 11.5, fontWeight: '500', color: theme.colors.text2 }}>{a.label}</Text>
          </View>
        ))}
      </View>

      {seamless && nextChapter != null && (
        <View style={styles.meterWrap}>
          <View style={{ width: 58, height: 58 }}>
            <Svg width={58} height={58} viewBox="0 0 58 58" style={{ transform: [{ rotate: '-90deg' }] }}>
              <Circle cx={29} cy={29} r={25} fill="none" stroke={theme.colors.surface3} strokeWidth={3} />
              <Circle
                cx={29}
                cy={29}
                r={25}
                fill="none"
                stroke={theme.accent}
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={RING_CIRCUMFERENCE * (1 - pull)}
              />
            </Svg>
            <View style={styles.meterIcon}>
              <Icon name={complete ? 'check' : 'chevronD'} size={20} strokeWidth={2.2} color={complete ? theme.accent : theme.colors.text3} />
            </View>
          </View>
          <Text style={{ fontFamily: theme.bodyFont, fontSize: 12, fontWeight: '600', color: complete ? theme.accent : theme.colors.text2, textAlign: 'center' }}>
            {complete ? `Loading Chapter ${nextChapter}…` : 'Keep scrolling for the next chapter'}
          </Text>
        </View>
      )}

      <View style={styles.navRow}>
        <Pressable onPress={onPrev} disabled={prevChapter == null} style={[styles.prevBtn, { backgroundColor: theme.colors.surface2, borderColor: theme.colors.border, opacity: prevChapter == null ? 0.45 : 1 }]}>
          <Icon name="chevronL" size={13} color={theme.colors.text2} />
          <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 11.5, color: theme.colors.text2 }}>Ch. {prevChapter ?? chapter}</Text>
        </Pressable>
        <Pressable onPress={onNext} disabled={nextChapter == null} style={[styles.nextBtn, { backgroundColor: theme.accent, opacity: nextChapter == null ? 0.45 : 1 }]}>
          <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 13, color: '#fff' }}>
            {nextChapter == null ? 'Last chapter' : `Next chapter · ${nextChapter}`}
          </Text>
          {nextChapter != null && <Icon name="chevronR" size={14} color="#fff" />}
        </Pressable>
      </View>

      <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 10, color: theme.colors.text4, marginTop: 14, letterSpacing: 0.6 }}>
        {chapter} OF {lastChapter}
      </Text>
    </View>
  );
}

// The header strip that marks where the next chapter's pages begin.
export function NextChapterStrip({ chapter, pageCount }: { chapter: number; pageCount: number }) {
  const { theme } = useMangaTheme();
  return (
    <View style={[styles.strip, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.borderStrong, borderBottomColor: theme.colors.border }]}>
      <Text style={{ fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 11, color: theme.accent, letterSpacing: 0.8 }}>CH.{chapter}</Text>
      <Text numberOfLines={1} style={{ flex: 1, fontFamily: theme.displayFont, fontWeight: '600', fontSize: 12, color: theme.colors.text }}>
        Chapter {chapter}
      </Text>
      <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 10, color: theme.colors.text3 }}>{pageCount} pg</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  seam: { paddingHorizontal: 18, paddingTop: 30, paddingBottom: 34, alignItems: 'center' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 20 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 13, paddingVertical: 9, borderRadius: 9, borderWidth: 1 },
  meterWrap: { marginTop: 30, alignItems: 'center', gap: 12 },
  meterIcon: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  navRow: { flexDirection: 'row', gap: 8, marginTop: 26, alignSelf: 'stretch' },
  prevBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 13, paddingVertical: 11, borderRadius: 10, borderWidth: 1 },
  nextBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingHorizontal: 13, paddingVertical: 11, borderRadius: 10 },
  strip: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderBottomWidth: 1 },
});
