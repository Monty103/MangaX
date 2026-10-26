import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchChapterPages, type ChapterPagesResult, type ReaderPage } from '@/data/pageRepository';

export type ChapterPagesState =
  /** Supabase isn't configured: render the generated placeholder pages. */
  | { status: 'placeholder' }
  | { status: 'loading' }
  | { status: 'available'; pages: ReaderPage[]; urlsExpireAt: string }
  | { status: 'ingesting'; retryAfterSeconds: number }
  | { status: 'unavailable'; reason: string; requiresSignIn?: true }
  | { status: 'error'; message: string };

// Refetch this long before the signed URLs expire, so a reader mid-chapter
// never hits a dead link.
const REFRESH_BEFORE_EXPIRY_MS = 5 * 60_000;
// The fetcher says how long to wait while it mirrors; give up after this many
// polls (~5 min at the usual 20-30s) rather than spin forever.
const MAX_INGEST_POLLS = 12;
// An image error usually means an expired URL. One refetch per this window,
// so a genuinely broken image can't trigger a request loop.
const ERROR_REFETCH_COOLDOWN_MS = 30_000;

// Shared across hook instances. The reader preloads the next chapter with a
// second instance; when the seamless handoff makes it the current chapter,
// the first render must already have its pages, or the swap would flash a
// loading state and jump the scroll.
const cache = new Map<string, ChapterPagesState>();

function fresh(state: ChapterPagesState | undefined): state is ChapterPagesState {
  if (!state) return false;
  if (state.status !== 'available') return state.status === 'unavailable' || state.status === 'placeholder';
  return Date.parse(state.urlsExpireAt) - Date.now() > REFRESH_BEFORE_EXPIRY_MS;
}

function toState(result: ChapterPagesResult | null): ChapterPagesState {
  if (result === null) return { status: 'placeholder' };
  return result;
}

/**
 * Page images for one chapter. Pass `chapter = null` to load nothing (e.g. no
 * next chapter to preload).
 *
 * `refresh()` refetches now; the reader calls it when an image fails to load,
 * since that usually means the signed URLs expired.
 */
export function useChapterPages(seriesId: number, chapter: number | null) {
  const key = chapter == null ? null : `${seriesId}-${chapter}`;
  const [entry, setEntry] = useState<{ key: string | null; state: ChapterPagesState }>(() => ({
    key,
    state: (key && cache.get(key)) || { status: 'loading' },
  }));
  const [generation, setGeneration] = useState(0);
  const lastFetchAt = useRef(0);

  // Derived during render so a key change never shows the previous chapter's
  // pages, and a cached chapter shows on the very first render.
  const state: ChapterPagesState = entry.key === key ? entry.state : (key && cache.get(key)) || { status: 'loading' };

  useEffect(() => {
    if (key == null || chapter == null) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let polls = 0;

    const publish = (next: ChapterPagesState) => {
      if (cancelled) return;
      cache.set(key, next);
      setEntry({ key, state: next });
    };

    const load = async () => {
      lastFetchAt.current = Date.now();
      let next: ChapterPagesState;
      try {
        next = toState(await fetchChapterPages(seriesId, chapter));
      } catch (err) {
        // Keep showing pages we already have; a failed background refresh
        // shouldn't blank a chapter that is still readable.
        const current = cache.get(key);
        if (current?.status === 'available') return;
        next = { status: 'error', message: err instanceof Error ? err.message : 'Could not load this chapter.' };
      }
      if (cancelled) return;

      if (next.status === 'ingesting') {
        if (++polls > MAX_INGEST_POLLS) {
          publish({ status: 'unavailable', reason: 'This chapter is still being prepared. Try again in a few minutes.' });
          return;
        }
        timer = setTimeout(load, Math.max(5, next.retryAfterSeconds) * 1000);
      } else if (next.status === 'available') {
        const refreshIn = Date.parse(next.urlsExpireAt) - Date.now() - REFRESH_BEFORE_EXPIRY_MS;
        timer = setTimeout(load, Math.max(30_000, refreshIn));
      }
      publish(next);
    };

    const cached = cache.get(key);
    if (generation === 0 && fresh(cached)) {
      setEntry({ key, state: cached });
      if (cached.status === 'available') {
        const refreshIn = Date.parse(cached.urlsExpireAt) - Date.now() - REFRESH_BEFORE_EXPIRY_MS;
        timer = setTimeout(load, Math.max(30_000, refreshIn));
      }
    } else {
      load();
    }

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [key, seriesId, chapter, generation]);

  const refresh = useCallback(() => {
    if (Date.now() - lastFetchAt.current < ERROR_REFETCH_COOLDOWN_MS) return;
    setGeneration((g) => g + 1);
  }, []);

  return { state, refresh };
}
