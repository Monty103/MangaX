import { supabase, isSupabaseConfigured } from '@/lib/supabase';
// Type-only: the Edge Function owns the response shape, so the app reads it
// from there rather than keeping a copy that could drift.
import type { ChapterPagesResult, ReaderPage } from '../../supabase/functions/_shared/chapterPages.ts';

export type { ChapterPagesResult, ReaderPage };

/**
 * Page images for one chapter, via the chapter-pages Edge Function (which
 * holds the fetcher key; the app never talks to the fetcher directly).
 *
 * Returns null when Supabase isn't configured, so the reader can keep its
 * placeholder pages for offline UI work. Throws on transport/server errors;
 * "not mirrored yet" and "unavailable" are normal results, not errors.
 */
export async function fetchChapterPages(seriesId: number, chapter: number): Promise<ChapterPagesResult | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.functions.invoke<ChapterPagesResult>('chapter-pages', {
    body: { seriesId, chapter },
  });
  if (error) throw error;
  if (!data) throw new Error('chapter-pages returned no body');
  return data;
}
