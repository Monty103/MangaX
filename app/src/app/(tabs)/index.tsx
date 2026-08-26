import React from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';

import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useMangaTheme } from '@/theme/ThemeProvider';
import { Section } from '@/components/layout/Section';
import { HomeHero } from '@/components/home/HomeHero';
import { ContinueCard, ContinueEntry } from '@/components/series/ContinueCard';
import { SeriesCard } from '@/components/series/SeriesCard';
import { UpdateCard, UpdateEntry } from '@/components/series/UpdateCard';
import { SERIES } from '@/data/mockSeries';

const CONTENT_MAX_WIDTH = 1376;
const CONTENT_PAD = 32;

function gridWidth(containerWidth: number, cols: number, gap: number) {
  return (containerWidth - gap * (cols - 1)) / cols;
}

// Mock progress/recency — replaced by `reading_progress` / `chapters` rows
// from Supabase once the catalog is real (task: Supabase client + DB schema).
const CONTINUE_ENTRIES: ContinueEntry[] = SERIES.slice(0, 5).map((series, i) => ({
  series,
  progress: [0.3, 0.7, 0.5, 0.9, 0.1][i],
  lastChapter: series.chapters - [1, 2, 1, 1, 3][i],
}));

const TRENDING = [
  { series: SERIES[4], badge: 'Hot' },
  { series: SERIES[6], badge: null },
  { series: SERIES[2], badge: 'New' },
  { series: SERIES[8], badge: null },
  { series: SERIES[1], badge: null },
  { series: SERIES[10], badge: null },
];

const LATEST_UPDATES: UpdateEntry[] = [
  { series: SERIES[0], ago: '2 min ago', chapter: 142, fresh: true, isNew: true },
  { series: SERIES[3], ago: '14 min ago', chapter: 38, fresh: true, isNew: true },
  { series: SERIES[6], ago: '48 min ago', chapter: 67, fresh: true, isNew: true },
  { series: SERIES[8], ago: '2 h ago', chapter: 91, fresh: false },
  { series: SERIES[2], ago: '4 h ago', chapter: 64, fresh: false },
  { series: SERIES[10], ago: '6 h ago', chapter: 23, fresh: false },
  { series: SERIES[5], ago: '9 h ago', chapter: 119, fresh: false },
  { series: SERIES[1], ago: 'Yesterday', chapter: 87, fresh: false },
];

const BECAUSE_YOU_READ = [SERIES[2], SERIES[5], SERIES[7], SERIES[9], SERIES[11], SERIES[3]];

export default function HomeScreen() {
  const { theme } = useMangaTheme();
  const { isDesktop } = useBreakpoint();
  const { width } = useWindowDimensions();

  const contentWidth = Math.min(width, CONTENT_MAX_WIDTH) - CONTENT_PAD * 2;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={
        isDesktop
          ? { maxWidth: CONTENT_MAX_WIDTH, width: '100%', alignSelf: 'center', paddingHorizontal: CONTENT_PAD, paddingTop: 28, paddingBottom: 60 }
          : { paddingTop: 8, paddingBottom: 24 }
      }
    >
      <HomeHero series={SERIES[0]} isDesktop={isDesktop} />

      {!isDesktop && <View style={{ height: 24 }} />}

      <Section title="Continue reading" caption="Picks up where you left off" isDesktop={isDesktop}>
        {isDesktop ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {CONTINUE_ENTRIES.map((entry) => (
              <ContinueCard key={entry.series.id} entry={entry} width={gridWidth(contentWidth, 5, 16)} layout="row" />
            ))}
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}>
            {CONTINUE_ENTRIES.map((entry) => (
              <ContinueCard key={entry.series.id} entry={entry} width={130} layout="column" />
            ))}
          </ScrollView>
        )}
      </Section>

      <Section title="Top this week" caption="Most read across all readers" action="See chart" isDesktop={isDesktop}>
        {isDesktop ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {TRENDING.map((t, i) => (
              <SeriesCard key={t.series.id} series={t.series} width={gridWidth(contentWidth, 6, 16)} badge={t.badge} rank={i + 1} />
            ))}
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}>
            {TRENDING.map((t, i) => (
              <SeriesCard key={t.series.id} series={t.series} width={156} badge={t.badge} rank={i + 1} />
            ))}
          </ScrollView>
        )}
      </Section>

      <Section title="Latest updated" caption="Newest chapter drops, freshest first" action="See all updates" isDesktop={isDesktop}>
        {isDesktop ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {LATEST_UPDATES.map((u, i) => (
              <UpdateCard key={u.series.id + '-' + i} entry={u} width={gridWidth(contentWidth, 6, 16)} />
            ))}
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}>
            {LATEST_UPDATES.map((u, i) => (
              <UpdateCard key={u.series.id + '-' + i} entry={u} width={130} showAuthor={false} />
            ))}
          </ScrollView>
        )}
      </Section>

      <Section title="Because you read Saltwater Atlas" caption={isDesktop ? 'Slow-burn drama, salt-wind aesthetic' : undefined} isDesktop={isDesktop}>
        {isDesktop ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {BECAUSE_YOU_READ.map((s) => (
              <SeriesCard key={s.id} series={s} width={gridWidth(contentWidth, 6, 16)} />
            ))}
          </View>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 16 }}>
            {BECAUSE_YOU_READ.map((s) => (
              <SeriesCard key={s.id} series={s} width={gridWidth(width - 32, 3, 12)} starSize={9} />
            ))}
          </View>
        )}
      </Section>
    </ScrollView>
  );
}
