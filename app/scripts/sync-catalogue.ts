// Runs the catalogue sync from this machine, using the same code as the
// sync-catalogue Edge Function. Until the fetcher is hosted somewhere a
// deployed function can reach (INTEGRATION_PLAN.md step 9), this is how the
// website catalogue gets filled.
//
//   npm run sync:catalogue            # incremental, from the stored cursor
//   npm run sync:catalogue -- --full  # also re-sync every linked series
//
// Reads scripts/.env.sync.local (gitignored):
//   SUPABASE_URL=https://<MangaX ref>.supabase.co
//   SUPABASE_SECRET_KEY=sb_secret_...        MangaX secret key, server-side only
//   MANGA_FETCHER_URL=http://localhost:8080
//   MANGA_FETCHER_KEY=mf_live_...            read-scope fetcher key

import { createClient } from '@supabase/supabase-js';
import { MangaFetcherClient } from '../supabase/functions/_shared/manga-fetcher-client.ts';
import { syncCatalogue } from '../supabase/functions/_shared/syncCatalogue.ts';

const missing = ['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'MANGA_FETCHER_URL', 'MANGA_FETCHER_KEY'].filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Missing ${missing.join(', ')}. Fill in scripts/.env.sync.local (see the header of this file).`);
  process.exit(1);
}

const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const fetcher = new MangaFetcherClient({ baseUrl: process.env.MANGA_FETCHER_URL!, apiKey: process.env.MANGA_FETCHER_KEY! });

// The app package is CommonJS, so no top-level await.
syncCatalogue({ fetcher, db, full: process.argv.includes('--full'), log: console.log }).then(
  (report) => console.log(`done: cursor ${report.since ?? '(none)'} -> ${report.newSince ?? '(none)'}`),
  (err) => {
    console.error('sync failed:', err instanceof Error ? err.message : err);
    process.exit(1);
  },
);
