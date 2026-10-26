// sync-catalogue: pulls manga_fetcher's catalogue into series/chapters.
//
// Server-to-server only (pg_cron, or an operator): callers must send one of
// the project's secret keys in the `apikey` header. Deploy with
// verify_jwt = false. The platform's JWT check doesn't understand sb_secret_
// keys, so the check is done here instead.
//
// Body (optional JSON): { "full": true } also re-syncs every linked series.
//
// Secrets: MANGA_FETCHER_URL, MANGA_FETCHER_KEY (a read-scope fetcher key).

import { createClient } from 'npm:@supabase/supabase-js@2.112.4';
import { MangaFetcherClient } from '../_shared/manga-fetcher-client.ts';
import { syncCatalogue } from '../_shared/syncCatalogue.ts';

const secretKeys: string[] = Object.values(JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}'));

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  const presented = req.headers.get('apikey') ?? '';
  if (!presented || !secretKeys.some((key) => timingSafeEqual(key, presented))) {
    return json({ error: 'unauthorized' }, 401);
  }

  const fetcherUrl = Deno.env.get('MANGA_FETCHER_URL');
  const fetcherKey = Deno.env.get('MANGA_FETCHER_KEY');
  if (!fetcherUrl || !fetcherKey) return json({ error: 'MANGA_FETCHER_URL / MANGA_FETCHER_KEY are not set' }, 500);

  let full = false;
  try {
    const body = await req.json();
    full = body?.full === true;
  } catch {
    // No body: incremental sync.
  }

  const db = createClient(Deno.env.get('SUPABASE_URL')!, secretKeys[0], {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const fetcher = new MangaFetcherClient({ baseUrl: fetcherUrl, apiKey: fetcherKey });

  try {
    const report = await syncCatalogue({ fetcher, db, full, log: console.log });
    return json(report);
  } catch (err) {
    console.error('sync-catalogue failed:', err);
    return json({ error: err instanceof Error ? err.message : String(err) }, 502);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
