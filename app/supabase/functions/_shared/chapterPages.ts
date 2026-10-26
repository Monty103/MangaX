// Resolves a website chapter (bigint series id + chapter number, the same
// pair the /reader/<seriesId>-<chapter> route carries) to the fetcher's
// three-state answer, trimmed to what the reader needs.
//
// Runtime-neutral like syncCatalogue.ts, so it can be exercised locally with
// tsx as well as from the chapter-pages Edge Function.

import { MangaFetcherError } from './manga-fetcher-client.ts';
import type { MangaFetcherClient } from './manga-fetcher-client.ts';

/** The slice of supabase-js used here (same shape as in syncCatalogue.ts). */
// deno-lint-ignore no-explicit-any
type ServiceDb = { from(table: string): any };

export interface ReaderPage {
  index: number;
  url: string;
  width: number | null;
  height: number | null;
}

export type ChapterPagesResult =
  | { status: 'available'; pages: ReaderPage[]; urlsExpireAt: string }
  | { status: 'ingesting'; retryAfterSeconds: number }
  | {
      status: 'unavailable';
      /** Shown to the reader as-is. */
      reason: string;
      /** The chapter exists and a signed-in user would queue it; prompt sign-in. */
      requiresSignIn?: true;
    };

export interface ChapterPagesRequest {
  fetcher: MangaFetcherClient;
  db: ServiceDb;
  seriesId: number;
  chapter: number;
  /** Queue an ingest on a miss. Only for signed-in users; anonymous reads never create work. */
  ingest: boolean;
}

export async function getChapterPages({ fetcher, db, seriesId, chapter, ingest }: ChapterPagesRequest): Promise<ChapterPagesResult> {
  const { data: series, error } = await db.from('series').select('fetcher_series_id').eq('id', seriesId).maybeSingle();
  if (error) throw new Error(`look up series ${seriesId}: ${error.message}`);
  if (!series) return { status: 'unavailable', reason: 'No such series.' };
  // The 12 demo titles predate the fetcher and have no pages anywhere.
  if (!series.fetcher_series_id) return { status: 'unavailable', reason: 'This series has no pages yet.' };

  let result;
  try {
    result = await fetcher.getChapterBySeries(series.fetcher_series_id, chapter, { language: 'en', ingest });
  } catch (err) {
    // A 404 *error* (rather than an 'unavailable' result) means the fetcher
    // has no such chapter number, or no longer has the series. Either way it
    // is a content gap, not a server failure.
    if (err instanceof MangaFetcherError && err.status === 404) {
      // Logged because a misconfigured MANGA_FETCHER_URL (e.g. ending in /v1)
      // also surfaces as a 404 ("no route for GET /v1/v1/...") and would
      // otherwise look exactly like a missing chapter.
      console.warn(`fetcher 404 for series ${seriesId} ch ${chapter}: ${err.message}`);
      return { status: 'unavailable', reason: 'This chapter isn’t available.' };
    }
    throw err;
  }

  switch (result.status) {
    case 'available':
      return {
        status: 'available',
        pages: result.chapter.pages.map((page) => ({ index: page.index, url: page.url, width: page.width, height: page.height })),
        urlsExpireAt: result.chapter.urlsExpireAt,
      };
    case 'ingesting':
      return { status: 'ingesting', retryAfterSeconds: result.retryAfterSeconds };
    case 'unavailable':
      // The fetcher's reason is written for API callers ("call again with
      // ingest=true"), not readers, so it is not passed through.
      if (!ingest && (await isRequestable(db, seriesId, chapter))) {
        return { status: 'unavailable', reason: 'This chapter hasn’t been prepared yet. Sign in to request it.', requiresSignIn: true };
      }
      return { status: 'unavailable', reason: 'This chapter isn’t available.' };
  }
}

/**
 * Whether the catalogue lists this chapter as known to the fetcher but not
 * yet mirrored, i.e. an ingest could produce it. 'failed' and 'unavailable'
 * are excluded: signing in would not help there.
 */
async function isRequestable(db: ServiceDb, seriesId: number, chapter: number): Promise<boolean> {
  const { data } = await db
    .from('chapters')
    .select('fetcher_status')
    .eq('series_id', seriesId)
    .eq('number', chapter)
    .maybeSingle();
  return data?.fetcher_status === 'announced' || data?.fetcher_status === 'pending';
}
