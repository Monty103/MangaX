// Copied verbatim from manga_fetcher client/manga-fetcher-client.ts
// (fetcher repo commit f939437). Do not edit here: change it in the fetcher
// and copy it again. Contract v1 only ever adds fields, so this copy stays
// valid until the fetcher ships /v2.

/**
 * ============================================================
 * manga_fetcher client - drop this file into the reading platform
 * ============================================================
 *
 * Zero dependencies, standard fetch only. Copy it into the platform repo (or
 * publish it as an internal package) and point it at whatever URL the fetcher
 * is running on today.
 *
 * The platform should know exactly two things about the fetcher: its base URL
 * and its API key. Everything else - which sources exist, where bytes live,
 * how ingestion is scheduled - is deliberately invisible from here.
 *
 *   const fetcher = new MangaFetcherClient({
 *     baseUrl: process.env.MANGA_FETCHER_URL!,
 *     apiKey:  process.env.MANGA_FETCHER_KEY!,
 *   });
 *
 *   const result = await fetcher.getChapterByTitle('One Piece', '150');
 *   if (result.status === 'available') render(result.chapter.pages);
 */

// ---------- contract types (mirror of src/contract/v1.ts) ----------

export type SeriesStatus = 'ongoing' | 'completed' | 'hiatus' | 'cancelled' | 'unknown';
export type ContentRating = 'safe' | 'suggestive' | 'erotica' | 'pornographic';
export type ChapterStatus =
  | 'announced'
  | 'pending'
  | 'mirroring'
  | 'available'
  | 'failed'
  | 'unavailable';

export interface SeriesSummary {
  id: string;
  slug: string;
  title: string;
  altTitles: string[];
  status: SeriesStatus;
  contentRating: ContentRating;
  year: number | null;
  authors: string[];
  artists: string[];
  genres: string[];
  tags: string[];
  coverUrl: string | null;
  /** Permanent cover URL, safe to store; null when unavailable. */
  coverPublicUrl: string | null;
  chapterCount: number;
  availableCount: number;
  lastChapterAt: string | null;
}

export interface Series extends SeriesSummary {
  description: string | null;
  originalLanguage: string | null;
  languages: string[];
}

export interface ChapterSummary {
  id: string;
  seriesId: string;
  language: string;
  number: number | null;
  numberText: string;
  volume: string | null;
  title: string | null;
  status: ChapterStatus;
  pageCount: number;
  publishedAt: string | null;
  mirroredAt: string | null;
}

export interface Page {
  index: number;
  url: string;
  mime: string;
  bytes: number;
  width: number | null;
  height: number | null;
}

export interface Chapter extends ChapterSummary {
  pages: Page[];
  /** Signed page URLs stop working after this. Re-request to refresh them. */
  urlsExpireAt: string;
}

export type FetchResult =
  | { status: 'available'; chapter: Chapter }
  | { status: 'ingesting'; chapter: ChapterSummary | null; jobId: string | null; retryAfterSeconds: number }
  | { status: 'unavailable'; reason: string };

export interface PageInfo {
  total: number;
  limit: number;
  offset: number;
}

export interface SearchResponse {
  items: SeriesSummary[];
  page: PageInfo;
}

export interface ChapterListResponse {
  seriesId: string;
  items: ChapterSummary[];
  page: PageInfo;
}

export interface UpdateEntry {
  chapter: ChapterSummary;
  seriesSlug: string;
  seriesTitle: string;
}

export interface UpdatesResponse {
  items: UpdateEntry[];
  nextCursor: string | null;
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  version: string;
  contract: string;
  uptimeSeconds: number;
  checks: { database: 'ok' | 'fail'; storage: 'ok' | 'fail' };
  counts?: { series: number; chaptersAvailable: number; jobsQueued: number };
}

// ---------- errors ----------

export class MangaFetcherError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly requestId?: string,
  ) {
    super(message);
    this.name = 'MangaFetcherError';
  }

  /** True when retrying the identical request could plausibly succeed. */
  get retryable(): boolean {
    return this.status === 429 || this.status >= 500;
  }
}

// ---------- client ----------

export interface MangaFetcherClientOptions {
  baseUrl: string;
  apiKey: string;
  /** Per-request timeout. Default 15s. */
  timeoutMs?: number;
  /** Retries for transient failures (429/5xx/network). Default 2. */
  retries?: number;
  fetch?: typeof globalThis.fetch;
}

export class MangaFetcherClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeoutMs: number;
  private readonly retries: number;
  private readonly doFetch: typeof globalThis.fetch;

  constructor(options: MangaFetcherClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.apiKey = options.apiKey;
    this.timeoutMs = options.timeoutMs ?? 15_000;
    this.retries = options.retries ?? 2;
    this.doFetch = options.fetch ?? globalThis.fetch.bind(globalThis);
  }

  // ----- catalogue -----

  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>('GET', '/v1/health');
  }

  /** Fuzzy title search; tolerates typos and matches alternative titles. */
  async search(query: string, options: { limit?: number; offset?: number } = {}): Promise<SearchResponse> {
    return this.request<SearchResponse>('GET', '/v1/search', {
      q: query,
      limit: options.limit,
      offset: options.offset,
    });
  }

  async getSeries(idOrSlug: string): Promise<Series> {
    return this.request<Series>('GET', `/v1/series/${encodeURIComponent(idOrSlug)}`);
  }

  async listChapters(
    idOrSlug: string,
    options: {
      language?: string;
      status?: ChapterStatus;
      order?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<ChapterListResponse> {
    return this.request<ChapterListResponse>(
      'GET',
      `/v1/series/${encodeURIComponent(idOrSlug)}/chapters`,
      options as Record<string, unknown>,
    );
  }

  // ----- reading -----

  /**
   * "I need <title> chapter <n>."
   *
   * Returns one of three states rather than throwing on a miss, because "not
   * mirrored yet" is a normal outcome the UI should render, not an error.
   */
  async getChapterByTitle(
    title: string,
    chapter: string | number,
    options: { language?: string; ingest?: boolean } = {},
  ): Promise<FetchResult> {
    return this.request<FetchResult>('GET', '/v1/fetch', {
      title,
      chapter: String(chapter),
      language: options.language ?? 'en',
      ingest: options.ingest,
    });
  }

  async getChapterBySeries(
    seriesIdOrSlug: string,
    chapter: string | number,
    options: { language?: string; ingest?: boolean } = {},
  ): Promise<FetchResult> {
    return this.request<FetchResult>(
      'GET',
      `/v1/series/${encodeURIComponent(seriesIdOrSlug)}/chapters/${encodeURIComponent(String(chapter))}`,
      { language: options.language ?? 'en', ingest: options.ingest },
    );
  }

  async getChapterById(chapterId: string, options: { ingest?: boolean } = {}): Promise<FetchResult> {
    return this.request<FetchResult>('GET', `/v1/chapters/${encodeURIComponent(chapterId)}`, {
      ingest: options.ingest,
    });
  }

  /**
   * Ask, then wait for an in-progress ingest to finish.
   *
   * Honours the server's retryAfterSeconds instead of guessing an interval.
   * Give it an AbortSignal from the request you are serving so an abandoned
   * page load stops the polling too.
   */
  async waitForChapter(
    request: () => Promise<FetchResult>,
    options: { timeoutMs?: number; signal?: AbortSignal } = {},
  ): Promise<FetchResult> {
    const deadline = Date.now() + (options.timeoutMs ?? 120_000);

    for (;;) {
      const result = await request();
      if (result.status !== 'ingesting') return result;
      if (Date.now() >= deadline) return result;

      const waitMs = Math.max(1000, result.retryAfterSeconds * 1000);
      await new Promise<void>((resolvePoll, rejectPoll) => {
        if (options.signal?.aborted) return rejectPoll(options.signal.reason);
        const timer = setTimeout(() => {
          options.signal?.removeEventListener('abort', onAbort);
          resolvePoll();
        }, Math.min(waitMs, Math.max(0, deadline - Date.now())));
        const onAbort = () => {
          clearTimeout(timer);
          rejectPoll(options.signal?.reason);
        };
        options.signal?.addEventListener('abort', onAbort, { once: true });
      });
    }
  }

  // ----- sync -----

  /** Newly-available chapters, newest first. Page with `cursor` until null. */
  async updates(
    options: { since?: string; cursor?: string; limit?: number } = {},
  ): Promise<UpdatesResponse> {
    return this.request<UpdatesResponse>('GET', '/v1/updates', options as Record<string, unknown>);
  }

  /** Walks the whole feed, newest first. */
  async *iterateUpdates(options: { since?: string; pageSize?: number } = {}): AsyncGenerator<UpdateEntry> {
    let cursor: string | null | undefined;
    do {
      const page: UpdatesResponse = await this.updates({
        since: options.since,
        cursor: cursor ?? undefined,
        limit: options.pageSize ?? 50,
      });
      for (const entry of page.items) yield entry;
      cursor = page.nextCursor;
    } while (cursor);
  }

  // ----- transport -----

  private async request<T>(
    method: 'GET' | 'POST',
    path: string,
    params?: Record<string, unknown>,
  ): Promise<T> {
    const url = new URL(this.baseUrl + path);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
      }
    }

    let lastError: unknown;
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const response = await this.doFetch(url.toString(), {
          method,
          headers: { authorization: `Bearer ${this.apiKey}`, accept: 'application/json' },
          signal: controller.signal,
        });

        const text = await response.text();
        const body: unknown = text ? JSON.parse(text) : null;

        // 202 and 404 are meaningful FetchResult states, not transport failures.
        if (response.ok || response.status === 202) return body as T;
        if (response.status === 404 && isFetchResult(body)) return body as T;

        const error = asErrorBody(body);
        const failure = new MangaFetcherError(
          response.status,
          error.code,
          error.message,
          error.requestId,
        );
        if (!failure.retryable || attempt === this.retries) throw failure;
        lastError = failure;
      } catch (error) {
        if (error instanceof MangaFetcherError && !error.retryable) throw error;
        if (attempt === this.retries) throw error;
        lastError = error;
      } finally {
        clearTimeout(timer);
      }

      await new Promise((r) => setTimeout(r, 250 * 2 ** attempt));
    }

    throw lastError instanceof Error ? lastError : new Error('request failed');
  }
}

function isFetchResult(body: unknown): boolean {
  return (
    typeof body === 'object' &&
    body !== null &&
    'status' in body &&
    (body as { status: unknown }).status === 'unavailable'
  );
}

function asErrorBody(body: unknown): { code: string; message: string; requestId?: string } {
  if (typeof body === 'object' && body !== null && 'error' in body) {
    const error = (body as { error: { code?: string; message?: string }; requestId?: string });
    return {
      code: error.error?.code ?? 'unknown',
      message: error.error?.message ?? 'request failed',
      requestId: error.requestId,
    };
  }
  return { code: 'unknown', message: 'request failed' };
}
