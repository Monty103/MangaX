import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';

import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useMangaTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/auth/AuthProvider';
import { Section } from '@/components/layout/Section';
import { HomeHero } from '@/components/home/HomeHero';
import { ContinueCard, ContinueEntry } from '@/components/series/ContinueCard';
import { SeriesCard } from '@/components/series/SeriesCard';
import { UpdateCard, UpdateEntry } from '@/components/series/UpdateCard';
import { fetchContinueReading, fetchHomeSeries, type ContinueItem, type HomeSeries } from '@/data/homeRepository';
import { relativeTime } from '@/lib/relativeTime';

const CONTENT_MAX_WIDTH = 1376;
const CONTENT_PAD = 32;
const SECTION_LIMIT = 12;
const HOUR_MS = 60 * 60 * 1000;

function gridWidth(containerWidth: number, cols: number, gap: number) {
  return (containerWidth - gap * (cols - 1)) / cols;
}

const latestFirst = (a: HomeSeries, b: HomeSeries) => Date.parse(b.latestChapterAt!) - Date.parse(a.latestChapterAt!);

export default function HomeScreen() {
  const { theme } = useMangaTheme();
  const { isDesktop } = useBreakpoint();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { user } = useAuth();

  const [series, setSeries] = useState<HomeSeries[] | null>(null);
  const [continueItems, setContinueItems] = useState<ContinueItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchHomeSeries().then((rows) => !cancelled && setSeries(rows));
    return () => {
      cancelled = true;
    };
  }, []);

  // Only a real account has reading progress; guests skip the request.
  const userId = user && !user.is_anonymous ? user.id : null;
  useEffect(() => {
    if (!userId || !series) {
      setContinueItems([]);
      return;
    }
    let cancelled = false;
    fetchContinueReading(userId, series).then((items) => !cancelled && setContinueItems(items));
    return () => {
      cancelled = true;
    };
  }, [userId, series]);

  const sections = useMemo(() => {
    const all = series ?? [];
    // Series with something readable, most recently updated first.
    const updated = all.filter((s) => s.latestChapter != null && s.latestChapterAt != null).sort(latestFirst);
    const latest: UpdateEntry[] = updated.slice(0, SECTION_LIMIT).map((s) => {
      const age = Date.now() - Date.parse(s.latestChapterAt!);
      return { series: s, chapter: s.latestChapter!, ago: relativeTime(s.latestChapterAt!), fresh: age < 24 * HOUR_MS, isNew: age < 72 * HOUR_MS };
    });
    // Nothing records reads yet, so "top" means rated; empty until ratings exist.
    const topRated = all
      .filter((s) => s.ratings > 0)
      .sort((a, b) => b.rating - a.rating || b.ratings - a.ratings)
      .slice(0, 6);
    const catalogue = [...all].sort((a, b) => a.title.localeCompare(b.title)).slice(0, SECTION_LIMIT);
    return { hero: updated[0] ?? all[0] ?? null, latest, topRated, catalogue };
  }, [series]);

  const continueEntries: ContinueEntry[] = continueItems.map(({ series: s, chapter }) => ({
    series: s,
    lastChapter: chapter,
    progress: s.chapters > 0 ? Math.min(1, chapter / s.chapters) : 0,
  }));

  const contentWidth = Math.min(width, CONTENT_MAX_WIDTH) - CONTENT_PAD * 2;
  const goBrowse = () => router.push('/browse');

  if (series == null || sections.hero == null) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        {series == null ? (
          <ActivityIndicator color={theme.accent} />
        ) : (
          <Text style={{ fontFamily: theme.bodyFont, fontSize: 13, color: theme.colors.text3, textAlign: 'center' }}>
            No series yet. New titles appear here once they are added to the catalogue.
          </Text>
        )}
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={
        isDesktop
          ? { maxWidth: CONTENT_MAX_WIDTH, width: '100%', alignSelf: 'center', paddingHorizontal: CONTENT_PAD, paddingTop: 28, paddingBottom: 60 }
          : { paddingTop: 8, paddingBottom: 24 }
      }
    >
      <HomeHero series={sections.hero} isDesktop={isDesktop} />

      {!isDesktop && <View style={{ height: 24 }} />}

      {continueEntries.length > 0 && (
        <Section title="Continue reading" caption="Picks up where you left off" action="Library" onPressAction={() => router.push('/library')} isDesktop={isDesktop}>
          {isDesktop ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {continueEntries.map((entry) => (
                <ContinueCard key={entry.series.id} entry={entry} width={gridWidth(contentWidth, 5, 16)} layout="row" />
              ))}
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}>
              {continueEntries.map((entry) => (
                <ContinueCard key={entry.series.id} entry={entry} width={130} layout="column" />
              ))}
            </ScrollView>
          )}
        </Section>
      )}

      {sections.latest.length > 0 && (
        <Section title="Latest updated" caption="Newest readable chapters, freshest first" action="Browse all" onPressAction={goBrowse} isDesktop={isDesktop}>
          {isDesktop ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {sections.latest.map((u) => (
                <UpdateCard key={u.series.id} entry={u} width={gridWidth(contentWidth, 6, 16)} />
              ))}
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}>
              {sections.latest.map((u) => (
                <UpdateCard key={u.series.id} entry={u} width={130} showAuthor={false} />
              ))}
            </ScrollView>
          )}
        </Section>
      )}

      {sections.topRated.length > 0 && (
        <Section title="Top rated" caption="Highest rated by readers" action="Browse all" onPressAction={goBrowse} isDesktop={isDesktop}>
          {isDesktop ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {sections.topRated.map((s, i) => (
                <SeriesCard key={s.id} series={s} width={gridWidth(contentWidth, 6, 16)} rank={i + 1} />
              ))}
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}>
              {sections.topRated.map((s, i) => (
                <SeriesCard key={s.id} series={s} width={156} rank={i + 1} />
              ))}
            </ScrollView>
          )}
        </Section>
      )}

      <Section title="All series" caption={isDesktop ? 'Everything in the catalogue, A to Z' : undefined} action="Browse all" onPressAction={goBrowse} isDesktop={isDesktop}>
        {isDesktop ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {sections.catalogue.map((s) => (
              <SeriesCard key={s.id} series={s} width={gridWidth(contentWidth, 6, 16)} />
            ))}
          </View>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 16 }}>
            {sections.catalogue.map((s) => (
              <SeriesCard key={s.id} series={s} width={gridWidth(width - 32, 3, 12)} starSize={9} />
            ))}
          </View>
        )}
      </Section>
    </ScrollView>
  );
}
