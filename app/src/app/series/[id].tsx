import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, useWindowDimensions, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { CoverImage } from '@/components/ui/CoverImage';
import { Stars } from '@/components/ui/Stars';
import { Tag } from '@/components/ui/Tag';
import { Icon } from '@/components/ui/Icon';
import { SeriesCard } from '@/components/series/SeriesCard';
import { SecondaryBtn } from '@/components/series/SecondaryBtn';
import { DetailRow } from '@/components/series/DetailRow';
import { ChapterRowDesktop, ChapterRowMobile } from '@/components/series/ChapterRow';
import { fetchSeriesById, fetchChapters, ChapterRow } from '@/data/chapterRepository';
import { SERIES } from '@/data/mockSeries';
import type { Series } from '@/data/types';

// The design's flavor synopsis was written for one series (Iron Lantern);
// our schema has no `synopsis` column yet, so every other title gets an
// honest "not available" state rather than invented copy.
const SYNOPSIS: Record<number, string> = {
  1: "In a city built atop the bones of an older one, the lanterns lit at dusk are not for travelers — they are for the dead. Hana, daughter of the last guild blacksmith, inherits both the forge and a debt: a single iron lantern that can summon any soul who has wronged her, with one caveat. She must hear them out.",
};

type Tab = 'chapters' | 'about' | 'comments' | 'recommended';

export default function SeriesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const seriesId = Number(id);
  const { theme } = useMangaTheme();
  const { isDesktop } = useBreakpoint();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [series, setSeries] = useState<Series | undefined>(() => SERIES.find((s) => s.id === seriesId));
  const [chapters, setChapters] = useState<ChapterRow[]>([]);
  const [tab, setTab] = useState<Tab>('chapters');

  useEffect(() => {
    fetchSeriesById(seriesId).then((s) => s && setSeries(s));
    fetchChapters(seriesId).then(setChapters);
  }, [seriesId]);

  if (!series) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: theme.bodyFont, color: theme.colors.text3 }}>Series not found.</Text>
      </View>
    );
  }

  const latestChapter = chapters[0]?.number ?? series.chapters;
  const recommended = SERIES.filter((s) => s.id !== series.id).slice(0, 4);
  const tabs: { key: Tab; label: string }[] = isDesktop
    ? [
        { key: 'chapters', label: 'Chapters' },
        { key: 'about', label: 'About' },
        { key: 'comments', label: 'Comments' },
        { key: 'recommended', label: 'Recommended' },
      ]
    : [
        { key: 'chapters', label: 'Chapters' },
        { key: 'about', label: 'About' },
        { key: 'recommended', label: 'Similar' },
      ];

  const synopsis = SYNOPSIS[series.id] ?? 'No synopsis available yet.';

  const TabContent = () => {
    if (tab === 'chapters') {
      return (
        <View style={{ marginTop: 14, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 10, overflow: 'hidden', backgroundColor: theme.colors.surface }}>
          {chapters.map((c) =>
            isDesktop ? (
              <ChapterRowDesktop key={c.id} seriesId={series!.id} chapter={c} />
            ) : (
              <ChapterRowMobile key={c.id} seriesId={series!.id} chapter={c} />
            )
          )}
        </View>
      );
    }
    if (tab === 'about') {
      return (
        <View style={{ marginTop: 14, gap: 14 }}>
          <Text style={{ fontFamily: theme.bodyFont, fontSize: isDesktop ? 14.5 : 13, lineHeight: isDesktop ? 23 : 20, color: theme.colors.text2, maxWidth: 720 }}>
            {synopsis}
          </Text>
        </View>
      );
    }
    if (tab === 'comments') {
      return (
        <View style={{ marginTop: 14, alignItems: 'center', paddingVertical: 40 }}>
          <Icon name="comment" size={22} color={theme.colors.text4} />
          <Text style={{ fontFamily: theme.bodyFont, fontSize: 12.5, color: theme.colors.text3, marginTop: 10 }}>
            No comments yet — sign in to be the first.
          </Text>
        </View>
      );
    }
    return (
      <View style={{ marginTop: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {recommended.map((r) => (
          <SeriesCard key={r.id} series={r} width={isDesktop ? 150 : (width - 32 - 24) / 3} starSize={10} showTag={false} />
        ))}
      </View>
    );
  };

  const DetailsCard = () => (
    <View style={{ backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 10, padding: 18 }}>
      <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 16, color: theme.colors.text, marginBottom: 14 }}>Details</Text>
      <DetailRow label="Author" value={series.author} />
      <DetailRow label="Status" value={series.status} />
      <DetailRow label="Year" value={String(series.year)} />
      <DetailRow label="Demographic" value={series.demo} last />
    </View>
  );

  if (isDesktop) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={{ height: 320, position: 'relative' }}>
          <CoverImage title={series.title} file={series.coverFile} label="banner_2880x720.jpg" dim style={{ height: '100%', width: '100%', borderRadius: 0 }} />
          <LinearGradient colors={['rgba(10,10,12,0.4)', 'rgba(10,10,12,0.85)', theme.colors.bg]} locations={[0, 0.7, 1]} style={StyleSheet.absoluteFill} />
        </View>

        <View style={{ maxWidth: 1376, width: '100%', alignSelf: 'center', paddingHorizontal: 32, paddingBottom: 60, marginTop: -180 }}>
          <View style={{ flexDirection: 'row', gap: 32, alignItems: 'flex-end', marginBottom: 36 }}>
            <CoverImage title={series.title} file={series.coverFile} label="cover_high.jpg" style={{ width: 240, height: 340, borderRadius: 10 }} />
            <View style={{ flex: 1, paddingBottom: 6 }}>
              <Text style={{ fontFamily: theme.displayFont, fontWeight: '500', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: theme.accent, marginBottom: 12 }}>
                {series.demo} · {series.status}
              </Text>
              <Text style={{ fontFamily: theme.displayFont, fontWeight: '800', fontSize: 44, lineHeight: 46, letterSpacing: -1, color: theme.colors.text }}>
                {series.title}
              </Text>
              <Text style={{ fontFamily: theme.bodyFont, fontSize: 14, fontWeight: '500', color: theme.colors.text2, marginTop: 14 }}>
                by {series.author} · {series.year}–present
              </Text>
              <View style={{ marginTop: 18 }}>
                <Stars value={series.rating} count={series.ratings} size={14} />
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 18 }}>
                {series.tags.map((t) => (
                  <Tag key={t} active>
                    {t}
                  </Tag>
                ))}
              </View>
            </View>
            <View style={{ width: 320, gap: 8 }}>
              <Pressable
                style={{ backgroundColor: theme.accent, paddingVertical: 14, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onPress={() => router.push(`/reader/${series.id}-${latestChapter}`)}
              >
                <Icon name="play" size={14} color="#fff" />
                <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 14, color: '#fff' }}>Read Chapter {latestChapter}</Text>
              </Pressable>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <SecondaryBtn icon="bookmark">Add to library</SecondaryBtn>
                <SecondaryBtn icon="download">Download</SecondaryBtn>
                <SecondaryBtn icon="bell">Notify</SecondaryBtn>
                <SecondaryBtn icon="share">Share</SecondaryBtn>
              </View>
            </View>
          </View>

          <View style={[styles.tabBar, { borderBottomColor: theme.colors.border }]}>
            {tabs.map((t) => (
              <Pressable key={t.key} onPress={() => setTab(t.key)} style={[styles.tab, { borderBottomColor: tab === t.key ? theme.accent : 'transparent' }]}>
                <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 14, color: tab === t.key ? theme.colors.text : theme.colors.text3 }}>
                  {t.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={{ flexDirection: 'row', gap: 40 }}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <TabContent />
            </View>
            <View style={{ width: 360, gap: 24 }}>
              <DetailsCard />
              <View>
                <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 16, color: theme.colors.text, marginBottom: 14 }}>You might like</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  {recommended.map((r) => (
                    <SeriesCard key={r.id} series={r} width={164} starSize={10} showTag={false} />
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  // ── Mobile ──────────────────────────────────────────────────────
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ height: 320, position: 'relative' }}>
        <CoverImage title={series.title} file={series.coverFile} label="banner_phone.jpg" dim style={{ height: '100%', width: '100%', borderRadius: 0 }} />
        <LinearGradient colors={['rgba(10,10,12,0.5)', 'rgba(10,10,12,0.4)', theme.colors.bg]} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />
        <View style={[styles.mobileTopIcons, { top: insets.top + 8 }]}>
          <Pressable onPress={() => router.back()} style={styles.circleBtn}>
            <Icon name="chevronL" size={18} color="#fff" />
          </Pressable>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={styles.circleBtn}>
              <Icon name="share" size={16} color="#fff" />
            </View>
            <View style={styles.circleBtn}>
              <Icon name="bars" size={18} color="#fff" />
            </View>
          </View>
        </View>
        <View style={styles.mobileHeaderRow}>
          <CoverImage title={series.title} file={series.coverFile} label="cover.jpg" style={{ width: 110, height: 156 }} />
          <View style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
            <Text style={{ fontFamily: theme.displayFont, fontWeight: '500', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: theme.accent, marginBottom: 8 }}>
              {series.demo} · {series.status}
            </Text>
            <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 22, lineHeight: 24, letterSpacing: -0.4, color: theme.colors.text }}>
              {series.title}
            </Text>
            <Text style={{ fontFamily: theme.bodyFont, fontSize: 11.5, fontWeight: '500', color: theme.colors.text2, marginTop: 6 }}>
              {series.author} · {series.year}
            </Text>
            <View style={{ marginTop: 8 }}>
              <Stars value={series.rating} count={series.ratings} size={11} />
            </View>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, padding: 16 }}>
        <Pressable
          style={{ flex: 1, backgroundColor: theme.accent, paddingVertical: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          onPress={() => router.push(`/reader/${series.id}-${latestChapter}`)}
        >
          <Icon name="play" size={13} color="#fff" />
          <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 13, color: '#fff' }}>Read Chapter {latestChapter}</Text>
        </Pressable>
        <SecondaryBtn icon="bookmark" />
        <SecondaryBtn icon="download" />
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {series.tags.map((t) => (
          <Tag key={t} size="sm">
            {t}
          </Tag>
        ))}
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
        <Text style={{ fontFamily: theme.bodyFont, fontSize: 13, lineHeight: 20, color: theme.colors.text2 }} numberOfLines={3}>
          {synopsis}
        </Text>
      </View>

      <View style={[styles.tabBar, { borderBottomColor: theme.colors.border, paddingHorizontal: 16 }]}>
        {tabs.map((t) => (
          <Pressable key={t.key} onPress={() => setTab(t.key)} style={[styles.tab, { borderBottomColor: tab === t.key ? theme.accent : 'transparent' }]}>
            <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 13, color: tab === t.key ? theme.colors.text : theme.colors.text3 }}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>
        <TabContent />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', gap: 24, borderBottomWidth: 1, marginBottom: 28 },
  tab: { paddingVertical: 12, borderBottomWidth: 2, marginBottom: -1 },
  mobileTopIcons: { position: 'absolute', left: 8, right: 8, flexDirection: 'row', justifyContent: 'space-between' },
  circleBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  mobileHeaderRow: { position: 'absolute', left: 16, right: 16, bottom: 16, flexDirection: 'row', gap: 14, alignItems: 'flex-end' },
});
