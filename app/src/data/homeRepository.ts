import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SERIES } from './mockSeries';
import type { Series } from './types';

/** A series plus what the Home screen shows about its chapters. */
export interface HomeSeries extends Series {
  description: string | null;
  /** Newest readable chapter; null while nothing is readable yet. */
  latestChapter: number | null;
  latestChapterAt: string | null;
}

export interface ContinueItem {
  series: HomeSeries;
  chapter: number;
}

// The public.series_overview view (one row per series, chapter facts
// precomputed). Falls back to the mock titles only when there is no backend
// or the request fails, like the other repositories; an empty catalogue is
// returned as empty so Home can say so.
export async function fetchHomeSeries(): Promise<HomeSeries[]> {
  if (!isSupabaseConfigured) return mockHomeSeries();

  try {
    const { data, error } = await supabase
      .from('series_overview')
      .select(
        'id, title, author, tags, demographic, status, year, cover_file, rating, rating_count, description, last_chapter, latest_chapter, latest_chapter_at'
      );

    if (error || !data) {
      if (error) console.warn('[homeRepository] fetchHomeSeries failed, falling back to mock data:', error.message);
      return mockHomeSeries();
    }

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      author: row.author ?? '',
      tags: row.tags ?? [],
      chapters: row.last_chapter != null ? Number(row.last_chapter) : 0,
      rating: Number(row.rating ?? 0),
      ratings: row.rating_count ?? 0,
      status: (row.status ?? 'Ongoing') as Series['status'],
      year: row.year ?? 0,
      demo: (row.demographic ?? 'Seinen') as Series['demo'],
      coverFile: row.cover_file,
      description: row.description ?? null,
      latestChapter: row.latest_chapter != null ? Number(row.latest_chapter) : null,
      latestChapterAt: row.latest_chapter_at ?? null,
    }));
  } catch (err) {
    console.warn('[homeRepository] fetchHomeSeries threw, falling back to mock data:', err);
    return mockHomeSeries();
  }
}

/**
 * The signed-in reader's most recently read series, newest first, matched
 * against `series` (rows for series not in it are dropped). Empty when
 * signed out, offline, or nothing has been read.
 */
export async function fetchContinueReading(userId: string, series: HomeSeries[]): Promise<ContinueItem[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('reading_progress')
      .select('series_id, updated_at, chapter:chapters(number)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(10);
    if (error || !data) return [];

    const byId = new Map(series.map((s) => [s.id, s]));
    const items: ContinueItem[] = [];
    for (const row of data) {
      const s = byId.get(row.series_id);
      // supabase-js types a to-one embed as an object or an array depending
      // on generated types; accept both.
      const chapter = Array.isArray(row.chapter) ? row.chapter[0] : row.chapter;
      if (s && chapter?.number != null) items.push({ series: s, chapter: Number(chapter.number) });
    }
    return items;
  } catch {
    return [];
  }
}

// Offline/no-backend stand-in so Home still renders for UI work.
function mockHomeSeries(): HomeSeries[] {
  const hour = 60 * 60 * 1000;
  return SERIES.map((s, i) => ({
    ...s,
    description: null,
    latestChapter: s.chapters,
    latestChapterAt: new Date(Date.now() - i * 3 * hour).toISOString(),
  }));
}
