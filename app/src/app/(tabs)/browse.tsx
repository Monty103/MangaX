import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, useWindowDimensions, StyleSheet } from 'react-native';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Icon } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Tag';
import { SeriesCard } from '@/components/series/SeriesCard';
import { FilterGroup } from '@/components/browse/FilterGroup';
import { SegToggle } from '@/components/browse/SegToggle';
import { RangeSliderStatic } from '@/components/browse/RangeSliderStatic';
import { FilterSheet } from '@/components/browse/FilterSheet';
import { GENRES, DEMOS, STATUSES, SERIES } from '@/data/mockSeries';
import { fetchAllSeries } from '@/data/seriesRepository';
import { applyFilters, defaultFilterState, SORT_LABELS, SortKey } from '@/data/browseFilters';
import type { Series } from '@/data/types';
import type { DensityKey } from '@/theme/tokens';

const CONTENT_MAX_WIDTH = 1376;
const CONTENT_PAD = 32;
const PAGE_SIZE = 24;

const DESKTOP_COLS: Record<DensityKey, number> = { compact: 8, regular: 6, comfy: 5 };

function gridWidth(containerWidth: number, cols: number, gap: number) {
  return (containerWidth - gap * (cols - 1)) / cols;
}

export default function BrowseScreen() {
  const { theme, setDensity } = useMangaTheme();
  const { isDesktop } = useBreakpoint();
  const { width } = useWindowDimensions();

  const [all, setAll] = useState<Series[]>(SERIES);
  const [filters, setFilters] = useState(defaultFilterState());
  const [draftFilters, setDraftFilters] = useState(defaultFilterState());
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'Grid' | 'List'>('Grid');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    fetchAllSeries()
      .then(setAll)
      .catch(() => setAll(SERIES));
  }, []);

  const filtered = useMemo(() => applyFilters(all, filters), [all, filters]);
  const page = filtered.slice(0, visibleCount);

  const toggleGenre = (g: string, setTarget: React.Dispatch<React.SetStateAction<typeof filters>>) => {
    setTarget((prev) => {
      const next = new Set(prev.genres);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return { ...prev, genres: next };
    });
  };

  const activeChips: { key: string; label: string; clear: () => void }[] = [
    ...Array.from(filters.genres).map((g) => ({
      key: 'genre-' + g,
      label: g,
      clear: () => setFilters((f) => ({ ...f, genres: new Set([...f.genres].filter((x) => x !== g)) })),
    })),
    ...(filters.demo ? [{ key: 'demo', label: filters.demo, clear: () => setFilters((f) => ({ ...f, demo: null })) }] : []),
    ...(filters.status ? [{ key: 'status', label: filters.status, clear: () => setFilters((f) => ({ ...f, status: null })) }] : []),
  ];

  const clearAll = () => setFilters(defaultFilterState());

  const contentWidth = Math.min(width, CONTENT_MAX_WIDTH) - CONTENT_PAD * 2;
  const cols = DESKTOP_COLS[theme.densityKey];

  if (isDesktop) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: theme.colors.bg }} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ maxWidth: CONTENT_MAX_WIDTH, width: '100%', alignSelf: 'center', paddingHorizontal: CONTENT_PAD, paddingTop: 28, flexDirection: 'row', gap: 32 }}>
          {/* Filter rail */}
          <View style={{ width: 260, gap: 22 }}>
            <FilterGroup title="Genre" badge={filters.genres.size ? `${filters.genres.size} selected` : undefined}>
              {GENRES.map((g) => (
                <Tag key={g} active={filters.genres.has(g)} onPress={() => toggleGenre(g, setFilters)}>
                  {g}
                </Tag>
              ))}
            </FilterGroup>
            <FilterGroup title="Demographic">
              {DEMOS.map((d) => (
                <Tag key={d} active={filters.demo === d} onPress={() => setFilters((f) => ({ ...f, demo: f.demo === d ? null : d }))}>
                  {d}
                </Tag>
              ))}
            </FilterGroup>
            <FilterGroup title="Status">
              {STATUSES.map((s) => (
                <Tag key={s} active={filters.status === s} onPress={() => setFilters((f) => ({ ...f, status: f.status === s ? null : s }))}>
                  {s}
                </Tag>
              ))}
            </FilterGroup>
            <FilterGroup title="Year">
              <RangeSliderStatic min={2000} max={2026} from={2018} to={2026} />
            </FilterGroup>
            <FilterGroup title="Min rating">
              <RangeSliderStatic min={0} max={5} from={4.2} to={5} unit="★" />
            </FilterGroup>
          </View>

          {/* Results */}
          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={{ marginBottom: 18 }}>
              <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 28, color: theme.colors.text, letterSpacing: -0.5 }}>Browse</Text>
              <Text style={{ fontFamily: theme.bodyFont, fontSize: 13, color: theme.colors.text3, marginTop: 8 }}>
                {filtered.length} results{activeChips.length ? ' · ' + activeChips.map((c) => c.label).join(', ') : ''}
              </Text>
            </View>

            <View style={styles.chipsRow}>
              {activeChips.map((c) => (
                <Tag key={c.key} active onPress={c.clear}>
                  {c.label} ✕
                </Tag>
              ))}
              {activeChips.length > 0 && (
                <Pressable onPress={clearAll} style={{ marginLeft: 6 }}>
                  <Text style={{ fontFamily: theme.bodyFont, fontSize: 11.5, color: theme.colors.text3 }}>Clear all</Text>
                </Pressable>
              )}
              <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontFamily: theme.bodyFont, fontSize: 11.5, color: theme.colors.text3 }}>Sort</Text>
                <SortDropdown value={filters.sort} onChange={(s) => setFilters((f) => ({ ...f, sort: s }))} />
                <View style={{ width: 1, height: 18, backgroundColor: theme.colors.border, marginHorizontal: 4 }} />
                <SegToggle options={['Grid', 'List'] as const} active={viewMode} onChange={setViewMode} />
                <SegToggle
                  options={['Compact', 'Regular', 'Comfy'] as const}
                  active={theme.densityKey === 'compact' ? 'Compact' : theme.densityKey === 'comfy' ? 'Comfy' : 'Regular'}
                  onChange={(v) => setDensity(v === 'Compact' ? 'compact' : v === 'Comfy' ? 'comfy' : 'regular')}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {page.map((s) => (
                <SeriesCard key={s.id} series={s} width={gridWidth(contentWidth - 260 - 32, cols, 16)} />
              ))}
            </View>

            {visibleCount < filtered.length && (
              <View style={{ alignItems: 'center', marginTop: 28 }}>
                <Pressable
                  onPress={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  style={{ paddingHorizontal: 22, paddingVertical: 11, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}
                >
                  <Text style={{ fontFamily: theme.displayFont, fontWeight: '500', fontSize: 13, color: theme.colors.text }}>
                    Load {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }

  // ── Mobile ──────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={[styles.mobileTopBar, { borderBottomColor: theme.colors.border }]}>
        <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 18, color: theme.colors.text }}>Browse</Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Icon name="search" size={20} color={theme.colors.text} />
          <Icon name="sort" size={20} color={theme.colors.text} />
        </View>
      </View>

      <View style={[styles.mobileChipsRow, { borderBottomColor: theme.colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingHorizontal: 16 }}>
          <Pressable
            onPress={() => {
              setDraftFilters(filters);
              setSheetOpen(true);
            }}
            style={[styles.filtersBtn, { backgroundColor: theme.accent }]}
          >
            <Icon name="filter" size={11} color="#fff" />
            <Text style={{ fontFamily: theme.bodyFont, fontSize: 11.5, fontWeight: '600', color: '#fff' }}>
              {activeChips.length || 'No'} filters
            </Text>
          </Pressable>
          {activeChips.map((c) => (
            <Tag key={c.key} active onPress={c.clear}>
              {c.label} ×
            </Tag>
          ))}
        </ScrollView>
      </View>

      <View style={styles.mobileMetaRow}>
        <Text style={{ fontFamily: theme.bodyFont, fontSize: 11.5, color: theme.colors.text3 }}>
          {filtered.length} results · sorted by {SORT_LABELS[filters.sort]}
        </Text>
        <Text style={{ fontFamily: theme.bodyFont, fontSize: 11.5, color: theme.colors.text2 }}>3 cols</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {page.map((s) => (
            <SeriesCard key={s.id} series={s} width={gridWidth(width - 32, 3, 10)} starSize={9} showTag={false} />
          ))}
        </View>
      </ScrollView>

      <FilterSheet
        visible={sheetOpen}
        filters={draftFilters}
        resultCount={applyFilters(all, draftFilters).length}
        onClose={() => setSheetOpen(false)}
        onApply={() => {
          setFilters(draftFilters);
          setSheetOpen(false);
        }}
        onReset={() => setDraftFilters(defaultFilterState())}
        onToggleGenre={(g) => toggleGenre(g, setDraftFilters)}
        onSetDemo={(d) => setDraftFilters((f) => ({ ...f, demo: d }))}
        onSetStatus={(s) => setDraftFilters((f) => ({ ...f, status: s }))}
        onSetSort={(s) => setDraftFilters((f) => ({ ...f, sort: s }))}
      />
    </View>
  );
}

function SortDropdown({ value, onChange }: { value: SortKey; onChange: (s: SortKey) => void }) {
  const { theme } = useMangaTheme();
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 7, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}
      >
        <Text style={{ fontFamily: theme.bodyFont, fontSize: 12, fontWeight: '500', color: theme.colors.text }}>{SORT_LABELS[value]}</Text>
        <Icon name="chevronD" size={11} color={theme.colors.text} />
      </Pressable>
      {open && (
        <View style={{ position: 'absolute', top: 34, right: 0, backgroundColor: theme.colors.surface2, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border, paddingVertical: 4, minWidth: 160, zIndex: 20 }}>
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <Pressable
              key={key}
              onPress={() => {
                onChange(key);
                setOpen(false);
              }}
              style={{ paddingHorizontal: 12, paddingVertical: 8 }}
            >
              <Text style={{ fontFamily: theme.bodyFont, fontSize: 12.5, color: key === value ? theme.accent : theme.colors.text }}>
                {SORT_LABELS[key]}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginBottom: 18 },
  mobileTopBar: { height: 52, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 },
  mobileChipsRow: { paddingVertical: 12, borderBottomWidth: 1 },
  mobileMetaRow: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  filtersBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
});
