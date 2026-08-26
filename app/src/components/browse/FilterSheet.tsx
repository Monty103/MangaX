import React from 'react';
import { View, Text, Pressable, ScrollView, Modal, StyleSheet } from 'react-native';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { Tag } from '@/components/ui/Tag';
import { FilterGroup } from './FilterGroup';
import { RadioRow } from './RadioRow';
import { RangeSliderStatic } from './RangeSliderStatic';
import { GENRES, DEMOS, STATUSES } from '@/data/mockSeries';
import { BrowseFilterState, SortKey, SORT_LABELS } from '@/data/browseFilters';

// Ported from mobile-frames.jsx `BrowseFiltersMobile` bottom sheet.
export function FilterSheet({
  visible,
  filters,
  resultCount,
  onClose,
  onApply,
  onReset,
  onToggleGenre,
  onSetDemo,
  onSetStatus,
  onSetSort,
}: {
  visible: boolean;
  filters: BrowseFilterState;
  resultCount: number;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  onToggleGenre: (g: string) => void;
  onSetDemo: (d: string | null) => void;
  onSetStatus: (s: string | null) => void;
  onSetSort: (s: SortKey) => void;
}) {
  const { theme } = useMangaTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: theme.colors.bg, borderColor: theme.colors.border }]}>
        <View style={styles.grabberRow}>
          <View style={[styles.grabber, { backgroundColor: theme.colors.surface3 }]} />
        </View>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 18, color: theme.colors.text, letterSpacing: -0.3 }}>
            Filters
          </Text>
          <Pressable onPress={onReset}>
            <Text style={{ fontFamily: theme.bodyFont, fontSize: 12, color: theme.colors.text2 }}>Reset all</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.body}>
          <FilterGroup title="Sort by">
            <View style={{ width: '100%' }}>
              {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                <RadioRow key={key} label={SORT_LABELS[key]} active={filters.sort === key} onPress={() => onSetSort(key)} />
              ))}
            </View>
          </FilterGroup>
          <FilterGroup title="Genre" badge={filters.genres.size ? `${filters.genres.size} selected` : undefined}>
            {GENRES.map((g) => (
              <Tag key={g} active={filters.genres.has(g)} onPress={() => onToggleGenre(g)}>
                {g}
              </Tag>
            ))}
          </FilterGroup>
          <FilterGroup title="Demographic">
            {DEMOS.map((d) => (
              <Tag key={d} active={filters.demo === d} onPress={() => onSetDemo(filters.demo === d ? null : d)}>
                {d}
              </Tag>
            ))}
          </FilterGroup>
          <FilterGroup title="Status">
            {STATUSES.map((s) => (
              <Tag key={s} active={filters.status === s} onPress={() => onSetStatus(filters.status === s ? null : s)}>
                {s}
              </Tag>
            ))}
          </FilterGroup>
          <FilterGroup title="Year">
            <RangeSliderStatic min={2000} max={2026} from={2018} to={2026} />
          </FilterGroup>
        </ScrollView>
        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <Pressable style={[styles.cancelBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} onPress={onClose}>
            <Text style={{ fontFamily: theme.displayFont, fontWeight: '500', fontSize: 13, color: theme.colors.text }}>Cancel</Text>
          </Pressable>
          <Pressable style={[styles.applyBtn, { backgroundColor: theme.accent }]} onPress={onApply}>
            <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 13, color: '#fff' }}>
              Show {resultCount} results
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '85%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
  },
  grabberRow: { paddingVertical: 8, alignItems: 'center' },
  grabber: { width: 36, height: 4, borderRadius: 2 },
  header: { paddingHorizontal: 20, paddingBottom: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 },
  body: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 20, gap: 22 },
  footer: { padding: 16, paddingBottom: 28, flexDirection: 'row', gap: 10, borderTopWidth: 1 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  applyBtn: { flex: 2, paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
