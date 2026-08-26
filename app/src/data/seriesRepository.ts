import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SERIES } from './mockSeries';
import type { Series } from './types';

// Real catalog lives in Postgres now (see supabase/schema.sql, seeded with
// the same 12 titles as mockSeries.ts so ids line up 1:1). Falls back to
// the local mock array whenever Supabase isn't configured or the request
// fails — keeps every screen renderable offline / in environments without
// network access to the project.
export async function fetchAllSeries(): Promise<Series[]> {
  if (!isSupabaseConfigured) return SERIES;

  // A blocked/offline network can make the request itself throw (not just
  // resolve with `{error}`), so the fallback has to sit outside the query,
  // not just around a truthy check on the result.
  try {
    const { data, error } = await supabase
      .from('series')
      .select('id, title, author, tags, demographic, status, year, cover_file, rating, rating_count')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.warn('[seriesRepository] fetchAllSeries failed, falling back to mock data:', error.message);
      return SERIES;
    }

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      author: row.author ?? '',
      tags: row.tags ?? [],
      chapters: 0, // chapter counts come from `chapters` — see fetchLatestChapterNumbers
      rating: Number(row.rating ?? 0),
      ratings: row.rating_count ?? 0,
      status: (row.status ?? 'Ongoing') as Series['status'],
      year: row.year ?? 0,
      demo: (row.demographic ?? 'Seinen') as Series['demo'],
      coverFile: row.cover_file,
    }));
  } catch (err) {
    console.warn('[seriesRepository] fetchAllSeries threw, falling back to mock data:', err);
    return SERIES;
  }
}
