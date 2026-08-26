import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import * as storage from './storage';
import { DEFAULT_RULES, DownloadEntry, DownloadRules } from './types';

const RULES_KEY = 'mangax.download-rules.v1';

/** Page image URLs for a chapter, from the catalog. */
async function fetchPageUrls(seriesId: number, chapterNumber: number): Promise<string[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data: ch } = await supabase
      .from('chapters')
      .select('id')
      .eq('series_id', seriesId)
      .eq('number', chapterNumber)
      .maybeSingle();
    if (!ch) return [];
    const { data: pages } = await supabase
      .from('chapter_pages')
      .select('image_url, page_index')
      .eq('chapter_id', ch.id)
      .order('page_index', { ascending: true });
    return (pages ?? []).map((p) => p.image_url).filter(Boolean);
  } catch {
    return [];
  }
}

export function useDownloads() {
  const [entries, setEntries] = useState<DownloadEntry[]>([]);
  const [usage, setUsage] = useState(0);
  const [rules, setRules] = useState<DownloadRules>(DEFAULT_RULES);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const [list, bytes] = await Promise.all([storage.listEntries(), storage.diskUsage()]);
    setEntries(list);
    setUsage(bytes);
  }, []);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(RULES_KEY).catch(() => null);
      if (raw) {
        try {
          setRules({ ...DEFAULT_RULES, ...JSON.parse(raw) });
        } catch {
          // keep defaults
        }
      }
      await refresh();
      setReady(true);
    })();
  }, [refresh]);

  const updateRules = useCallback((patch: Partial<DownloadRules>) => {
    setRules((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(RULES_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  /**
   * Queues a chapter and downloads its pages. Returns a human-readable
   * reason when it can't proceed, so callers can surface it rather than
   * failing silently.
   */
  const enqueue = useCallback(
    async (seriesId: number, seriesTitle: string, chapterNumber: number): Promise<string | null> => {
      if (!storage.isSupported) return 'Downloads are only available in the iOS and Android apps.';

      const id = `${seriesId}-${chapterNumber}`;
      const urls = await fetchPageUrls(seriesId, chapterNumber);
      if (urls.length === 0) {
        return 'This chapter has no page images in the catalog yet, so there is nothing to download.';
      }

      const base: DownloadEntry = {
        id,
        seriesId,
        seriesTitle,
        chapterNumber,
        state: 'downloading',
        progress: 0,
        bytes: 0,
        pageCount: urls.length,
        pagesDone: 0,
        updatedAt: Date.now(),
      };
      await storage.upsertEntry(base);
      await refresh();

      let bytes = 0;
      for (let i = 0; i < urls.length; i++) {
        if (usage + bytes >= rules.budgetBytes) {
          await storage.upsertEntry({ ...base, state: 'error', error: 'Storage budget reached', bytes, pagesDone: i, updatedAt: Date.now() });
          await refresh();
          return 'Storage budget reached — free up space or raise the limit.';
        }
        try {
          bytes += await storage.downloadPage(id, i, urls[i]);
        } catch (err: any) {
          await storage.upsertEntry({
            ...base,
            state: 'error',
            error: err?.message ?? 'Download failed',
            bytes,
            pagesDone: i,
            updatedAt: Date.now(),
          });
          await refresh();
          return err?.message ?? 'Download failed.';
        }
        await storage.upsertEntry({
          ...base,
          state: 'downloading',
          bytes,
          pagesDone: i + 1,
          progress: (i + 1) / urls.length,
          updatedAt: Date.now(),
        });
        if (i % 3 === 0) await refresh();
      }

      await storage.upsertEntry({ ...base, state: 'done', bytes, pagesDone: urls.length, progress: 1, updatedAt: Date.now() });
      await refresh();
      return null;
    },
    [refresh, rules.budgetBytes, usage]
  );

  const remove = useCallback(
    async (id: string) => {
      await storage.deleteEntry(id);
      await refresh();
    },
    [refresh]
  );

  return {
    entries,
    active: entries.filter((e) => e.state !== 'done'),
    saved: entries.filter((e) => e.state === 'done'),
    usage,
    rules,
    ready,
    isSupported: storage.isSupported,
    enqueue,
    remove,
    updateRules,
    refresh,
  };
}
