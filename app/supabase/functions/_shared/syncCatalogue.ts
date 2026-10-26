// Keeps the website's series/chapters tables in step with manga_fetcher's
// catalogue (INTEGRATION_PLAN.md, decision 2).
//
// Runtime-neutral on purpose: no Deno globals and no npm:/bare imports, so the
// same code runs in the sync-catalogue Edge Function and in the local runner
// (scripts/sync-catalogue.ts). Callers hand in the fetcher client and a
// service-role Supabase client.
//
// The fetcher has no "list every series" endpoint, so /v1/updates drives it:
// every series that gained an available chapter since the stored cursor is
// re-synced in full (details + every chapter). A series with nothing readable
// yet never shows up, which is what the site wants anyway.

import type {
  ChapterSummary,
  MangaFetcherClient,
  Series as FetcherSeries,
  SeriesStatus as FetcherSeriesStatus,
} from './manga-fetcher-client.ts';

/** The slice of supabase-js this module uses, so it doesn't import a runtime-specific build. */
// deno-lint-ignore no-explicit-any
export type ServiceDb = { from(table: string): any };

export interface SyncOptions {
  fetcher: MangaFetcherClient;
  db: ServiceDb;
  /** Also re-sync every series already linked, not just ones in the updates feed. */
  full?: boolean;
  log?: (message: string) => void;
}

export interface SyncReport {
  since: string | null;
  newSince: string | null;
  updatesSeen: number;
  seriesSynced: { slug: string; seriesId: number; chapters: number; skippedUnnumbered: number }[];
}

/** Only English for now, so (series_id, number) can't collide across languages. */
const LANGUAGE = 'en';
const CHAPTER_PAGE_SIZE = 500;

const STATUS: Record<FetcherSeriesStatus, string> = {
  ongoing: 'Ongoing',
  completed: 'Completed',
  hiatus: 'Hiatus',
  cancelled: 'Cancelled',
  // The website's check constraint has no "unknown".
  unknown: 'Ongoing',
};

export async function syncCatalogue({ fetcher, db, full = false, log = () => {} }: SyncOptions): Promise<SyncReport> {
  const state = await must(db.from('sync_state').select('updates_since').eq('id', true).single(), 'read sync_state');
  // Postgres returns timestamptz as "...+00:00", but the fetcher only accepts
  // the "...Z" form (zod datetime). Normalise once, so both the request and
  // the string comparison below use the same shape.
  const since: string | null = state.updates_since ? new Date(state.updates_since).toISOString() : null;

  try {
    const slugs = new Set<string>();
    let newest = since;
    let updatesSeen = 0;
    for await (const entry of fetcher.iterateUpdates({ since: since ?? undefined, pageSize: 200 })) {
      updatesSeen++;
      slugs.add(entry.seriesSlug);
      const at = entry.chapter.mirroredAt && new Date(entry.chapter.mirroredAt).toISOString();
      if (at && (!newest || at > newest)) newest = at;
    }
    log(`updates since ${since ?? 'the beginning'}: ${updatesSeen} chapter(s) across ${slugs.size} series`);

    if (full) {
      const linked = await must(db.from('series').select('fetcher_slug').not('fetcher_slug', 'is', null), 'list linked series');
      for (const row of linked) slugs.add(row.fetcher_slug);
    }

    const seriesSynced: SyncReport['seriesSynced'] = [];
    for (const slug of slugs) {
      const result = await syncSeries(fetcher, db, slug);
      log(`  ${slug}: ${result.chapters} chapter(s)${result.skippedUnnumbered ? `, ${result.skippedUnnumbered} unnumbered skipped` : ''}`);
      seriesSynced.push({ slug, ...result });
    }

    // Advance the cursor only after every series succeeded; a failed run
    // retries the same window next time. `since` is inclusive on the fetcher,
    // so the newest chapter is seen again next run; re-syncing that one series
    // is harmless (upserts) and guarantees nothing at the boundary is missed.
    await must(
      db.from('sync_state').update({ updates_since: newest, last_run_at: new Date().toISOString(), last_error: null }).eq('id', true),
      'save sync_state',
    );
    return { since, newSince: newest, updatesSeen, seriesSynced };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await db.from('sync_state').update({ last_run_at: new Date().toISOString(), last_error: message }).eq('id', true);
    throw err;
  }
}

async function syncSeries(fetcher: MangaFetcherClient, db: ServiceDb, slug: string) {
  const series = await fetcher.getSeries(slug);

  // Upsert on the fetcher id. Website-only fields (demographic, rating,
  // cover_file) are never written here, so hand edits survive re-syncs.
  const row = await must(
    db
      .from('series')
      .upsert(seriesRow(series), { onConflict: 'fetcher_series_id' })
      .select('id')
      .single(),
    `upsert series ${slug}`,
  );
  const seriesId: number = row.id;

  const chapters = await allChapters(fetcher, series.id);
  const byNumber = new Map<number, ChapterSummary>();
  let skippedUnnumbered = 0;
  for (const chapter of chapters) {
    // The website addresses chapters by number (/reader/<series>-<number>),
    // so unnumbered extras have nowhere to live yet.
    if (chapter.number === null) {
      skippedUnnumbered++;
      continue;
    }
    // unique(series_id, number): keep the first if the fetcher ever holds two.
    if (!byNumber.has(chapter.number)) byNumber.set(chapter.number, chapter);
  }

  const rows = [...byNumber.values()].map((chapter) => ({
    series_id: seriesId,
    fetcher_chapter_id: chapter.id,
    number: chapter.number,
    title: chapter.title,
    // published_at is NOT NULL; omitting it lets the column default apply.
    ...((chapter.publishedAt ?? chapter.mirroredAt) ? { published_at: chapter.publishedAt ?? chapter.mirroredAt } : {}),
    page_count: chapter.pageCount,
    fetcher_status: chapter.status,
  }));

  if (rows.length > 0) {
    // defaultToNull: false so a row without published_at gets the default
    // rather than an explicit null.
    await must(
      db.from('chapters').upsert(rows, { onConflict: 'fetcher_chapter_id', defaultToNull: false }),
      `upsert chapters for ${slug}`,
    );
  }
  // Chapters the fetcher dropped are left in place: reading progress and
  // comments point at them. Their fetcher_status goes stale instead.

  return { seriesId, chapters: rows.length, skippedUnnumbered };
}

function seriesRow(series: FetcherSeries) {
  return {
    fetcher_series_id: series.id,
    fetcher_slug: series.slug,
    title: series.title,
    author: series.authors.length > 0 ? series.authors.join(', ') : null,
    tags: [...new Set([...series.genres, ...series.tags])],
    status: STATUS[series.status] ?? 'Ongoing',
    year: series.year,
    description: series.description,
  };
}

async function allChapters(fetcher: MangaFetcherClient, fetcherSeriesId: string): Promise<ChapterSummary[]> {
  const all: ChapterSummary[] = [];
  for (let offset = 0; ; offset += CHAPTER_PAGE_SIZE) {
    const page = await fetcher.listChapters(fetcherSeriesId, {
      language: LANGUAGE,
      order: 'asc',
      limit: CHAPTER_PAGE_SIZE,
      offset,
    });
    all.push(...page.items);
    if (page.items.length < CHAPTER_PAGE_SIZE || all.length >= page.page.total) return all;
  }
}

/** Unwraps a supabase-js `{ data, error }` result, throwing with context on error. */
// deno-lint-ignore no-explicit-any
async function must(query: PromiseLike<{ data: any; error: { message: string } | null }>, what: string) {
  const { data, error } = await query;
  if (error) throw new Error(`${what}: ${error.message}`);
  return data;
}
