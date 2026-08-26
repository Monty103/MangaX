import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { seriesById as mockSeriesById, SERIES } from './mockSeries';
import type { Series } from './types';

export interface ChapterRow {
  id: string;
  number: number;
  publishedAt: string;
  pageCount: number;
}

export async function fetchSeriesById(id: number): Promise<Series | undefined> {
  if (!isSupabaseConfigured) return mockSeriesById(id);

  try {
    const { data, error } = await supabase
      .from('series')
      .select('id, title, author, tags, demographic, status, year, cover_file, rating, rating_count')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return mockSeriesById(id);

    return {
      id: data.id,
      title: data.title,
      author: data.author ?? '',
      tags: data.tags ?? [],
      chapters: mockSeriesById(id)?.chapters ?? 0, // real chapter *count* comes from fetchChapters
      rating: Number(data.rating ?? 0),
      ratings: data.rating_count ?? 0,
      status: (data.status ?? 'Ongoing') as Series['status'],
      year: data.year ?? 0,
      demo: (data.demographic ?? 'Seinen') as Series['demo'],
      coverFile: data.cover_file,
    };
  } catch (err) {
    console.warn('[chapterRepository] fetchSeriesById threw, falling back to mock data:', err);
    return mockSeriesById(id);
  }
}

// Real DB only carries a handful of recent chapters per series (seeded —
// see supabase/schema.sql), not the full historical run a real content
// pipeline would have. Falls back to synthesizing a descending chapter list
// from the mock series' `chapters` count so the screen still has something
// to show without a seeded/connected backend.
export async function fetchChapters(seriesId: number): Promise<ChapterRow[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('id, number, published_at, page_count')
        .eq('series_id', seriesId)
        .order('number', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row) => ({
          id: String(row.id),
          number: Number(row.number),
          publishedAt: row.published_at,
          pageCount: row.page_count,
        }));
      }
    } catch (err) {
      console.warn('[chapterRepository] fetchChapters threw, falling back to synthesized list:', err);
    }
  }

  const mock = SERIES.find((s) => s.id === seriesId);
  const total = mock?.chapters ?? 0;
  const count = Math.min(total, 20);
  return Array.from({ length: count }, (_, i) => ({
    id: `${seriesId}-${total - i}`,
    number: total - i,
    publishedAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24 * 7).toISOString(),
    pageCount: 20 + ((total - i) % 15),
  }));
}
