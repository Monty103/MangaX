# MangaX

A manga reading app for web, iOS, and Android from a single codebase.

Built with **Expo Router** + **React Native Web**, backed by **Supabase** (Postgres, auth, row-level security).

---

## Running it

```bash
cd app
npm install
npm run web        # browser
npm run ios        # Mac + Xcode, or the Expo Go app
npm run android    # Android Studio, or Expo Go
```

### Environment

Copy `app/.env.example` to `app/.env.local` and fill in your Supabase project values:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
```

Both are safe to ship to clients — access control is enforced by Postgres
row-level security, not by keeping the key secret. `.env.local` is gitignored.

Without it the app still runs, falling back to local mock data.

### Database

The schema lives in `app/supabase/migrations/`, one file per migration,
named with the version Supabase recorded when it was applied to the live
project. To set up a fresh project, apply them in filename order (SQL editor,
or `supabase db push` once the CLI is linked). They create profiles, the
catalog (series / chapters / pages), per-user library and reading progress,
and ratings/comments — all with RLS keyed to `auth.uid()` — seed 12 demo
titles, link the catalog to manga_fetcher (`fetcher_*` columns,
`sync_state`), schedule the catalogue sync, and finally delete the demo
titles again.

Change the schema by adding a new migration, never by editing an applied one.

Downloaded chapter images are intentionally not modeled in Postgres: they
live on-device (expo-file-system) with a local SQLite index and never sync.

### Deploying the website (Cloudflare Pages)

`npm run build:web` (`expo export -p web`) writes a static site to `app/dist`.
Every page in it is the same app shell and the router draws the screen from
the URL, so no rewrite rules are needed: Pages serves `index.html` for paths
without a file (there is deliberately no top-level `404.html`), and unknown
paths show the app's own "not found" screen.

Pages project settings (Git integration):

| Setting | Value |
|---|---|
| Production branch | `main` |
| Root directory | `app` |
| Build command | `npm run build:web` |
| Build output directory | `dist` |
| Variables | `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` (as in `.env.example`), `NODE_VERSION=22` |

After the first deploy, add the site's URL in Supabase → Authentication →
URL Configuration (Site URL and Redirect URLs), so sign-up and password
emails link back to the live site instead of localhost.

---

## Layout

```
app/src/
  app/            screens and routes (Expo Router file-based)
  components/     UI by feature: reader, series, browse, auth, settings, monetization
  theme/          design tokens, theme provider, reader settings
  data/           repositories and mock catalog
  downloads/      offline storage (native) with a web fallback
  monetization/   ad cadence rules, entitlement, swappable services
  auth/           Supabase session provider
  lib/            Supabase client and helpers
app/supabase/     database schema
project/          original Claude Design mockups (reference)
chats/            design conversation transcripts (intent and decisions)
```

One responsive layout per screen rather than separate desktop and mobile
trees: chrome and grid density switch at a breakpoint.

---

## What works

- **Home** — hero, continue reading, top this week, latest updates, recommendations
- **Browse** — genre/demographic/status filters, sort, density; sidebar on desktop, bottom sheet on mobile
- **Series** — banner, chapter list, tabs, details
- **Reader** — vertical webtoon scroll, tap-to-toggle immersive chrome, chapter navigation, settings sheet, and seamless next-chapter continue that rebases scroll so the handoff is invisible
- **Auth** — email and password via Supabase
- **Settings** — Design tab drives the real theme (accent, typeface, density) live
- **Downloads** — on-device files plus a SQLite index (iOS/Android; the web build says so rather than half-working)
- **Monetization** — ad slots, paywall, XP and tier progression

## Not wired up yet

- **Social sign-in** — buttons exist but need providers enabled in Supabase
- **Ads and payments** — everything talks to interfaces in
  `src/monetization/services.ts`; the stubs serve house slots and refuse
  purchases rather than faking success. Real providers (AdMob, RevenueCat,
  App Store, Play, Stripe) plug in by implementing those interfaces.
- **Real content** — `chapter_pages` is empty, so covers and pages render as
  generated placeholders. Downloads have nothing to fetch until real image
  URLs exist.

### Worth deciding early

If you license content, publishers commonly require downloads to be
encrypted at rest. That constrains the image pipeline, so it is cheaper to
settle before the reader hardens.
