// chapter-pages: the reader's (and downloads') only way to get page images.
//
// The app calls it with supabase.functions.invoke('chapter-pages', { body:
// { seriesId, chapter } }), which sends the publishable key in `apikey` and,
// when signed in, the user's JWT in `Authorization`. The fetcher API key
// never leaves this function.
//
// Deploy with verify_jwt = false: anonymous readers have no JWT, and the
// platform check doesn't understand sb_publishable_ keys. Both headers are
// checked here instead.
//
// Always answers 200 with { status: 'available' | 'ingesting' | 'unavailable' }
// for a well-formed request. "Not mirrored yet" is a state the reader renders,
// not an error, and functions.invoke turns non-2xx into exceptions.
//
// Secrets: MANGA_FETCHER_URL, MANGA_FETCHER_KEY (read-scope fetcher key).

import { createClient } from 'npm:@supabase/supabase-js@2.112.4';
import { corsHeaders } from 'npm:@supabase/supabase-js@2.112.4/cors';
import { MangaFetcherClient } from '../_shared/manga-fetcher-client.ts';
import { getChapterPages } from '../_shared/chapterPages.ts';

const publishableKeys: string[] = Object.values(JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') ?? '{}'));
const secretKeys: string[] = Object.values(JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}'));

const db = createClient(Deno.env.get('SUPABASE_URL')!, secretKeys[0], {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Read per request, not at startup: secrets set or changed in the dashboard
// apply without a redeploy, but a warm isolate would keep a startup copy.
function fetcherFromEnv() {
  const baseUrl = Deno.env.get('MANGA_FETCHER_URL');
  const apiKey = Deno.env.get('MANGA_FETCHER_KEY');
  return baseUrl && apiKey ? new MangaFetcherClient({ baseUrl, apiKey }) : null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  // The publishable key is public, so this only keeps out callers that
  // aren't the app at all; it is not access control.
  const apikey = req.headers.get('apikey') ?? '';
  if (![...publishableKeys, ...secretKeys].some((key) => timingSafeEqual(key, apikey))) {
    return json({ error: 'unauthorized' }, 401);
  }

  // Signed-in users may trigger an ingest on a miss; everyone else only reads
  // what is already mirrored. A bearer that isn't a JWT (supabase-js sends
  // the publishable key there when nobody is signed in) means anonymous.
  let signedIn = false;
  const bearer = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  if (bearer && !bearer.startsWith('sb_')) {
    const { data, error } = await db.auth.getClaims(bearer);
    if (error || !data) return json({ error: 'invalid session' }, 401);
    // Anonymous sign-ins carry role "authenticated" too; they don't count.
    signedIn = data.claims.role === 'authenticated' && data.claims.is_anonymous !== true;
  }

  let seriesId: unknown;
  let chapter: unknown;
  try {
    ({ seriesId, chapter } = await req.json());
  } catch {
    return json({ error: 'body must be JSON: { seriesId, chapter }' }, 400);
  }
  if (!Number.isSafeInteger(seriesId) || (seriesId as number) <= 0) return json({ error: 'seriesId must be a positive integer' }, 400);
  if (typeof chapter !== 'number' || !Number.isFinite(chapter) || chapter < 0) return json({ error: 'chapter must be a non-negative number' }, 400);

  const fetcher = fetcherFromEnv();
  if (!fetcher) return json({ error: 'MANGA_FETCHER_URL / MANGA_FETCHER_KEY are not set' }, 500);

  try {
    const result = await getChapterPages({ fetcher, db, seriesId: seriesId as number, chapter, ingest: signedIn });
    return json(result);
  } catch (err) {
    console.error('chapter-pages failed:', err);
    return json({ error: 'content service unavailable' }, 502);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    // Page URLs are signed and expire; nothing in between should cache them.
    headers: { ...corsHeaders, 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
