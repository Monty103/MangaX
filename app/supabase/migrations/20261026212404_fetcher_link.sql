-- Links the website catalog to manga_fetcher (see INTEGRATION_PLAN.md).
--
-- series/chapters keep their bigint ids, since library, progress, ratings,
-- comments and the /reader/<seriesId>-<chapter> routes all reference them.
-- These columns record which fetcher row each one mirrors, so the
-- sync-catalogue function can upsert on them. A null fetcher id means the
-- row did not come from the fetcher (the 12 demo titles).

alter table public.series
  add column if not exists fetcher_series_id uuid,
  add column if not exists fetcher_slug text,
  add column if not exists description text;

alter table public.chapters
  add column if not exists fetcher_chapter_id uuid,
  add column if not exists fetcher_status text;

-- Unique constraints double as the upsert targets for the sync. Nulls don't
-- collide, so unlinked demo rows are unaffected.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'series_fetcher_series_id_key') then
    alter table public.series add constraint series_fetcher_series_id_key unique (fetcher_series_id);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'chapters_fetcher_chapter_id_key') then
    alter table public.chapters add constraint chapters_fetcher_chapter_id_key unique (fetcher_chapter_id);
  end if;
  -- Mirrors the fetcher's ChapterStatus enum (src/contract/v1.ts). Only
  -- 'available' chapters have pages to read; the rest are listed but greyed out.
  if not exists (select 1 from pg_constraint where conname = 'chapters_fetcher_status_check') then
    alter table public.chapters add constraint chapters_fetcher_status_check
      check (fetcher_status in ('announced','pending','mirroring','available','failed','unavailable'));
  end if;
end $$;

-- Cursor for the fetcher's /v1/updates feed: the newest mirroredAt the sync
-- has seen. One row, written only by the sync function (service role).
create table if not exists public.sync_state (
  id boolean primary key default true check (id),
  updates_since timestamptz,
  last_run_at timestamptz,
  last_error text
);

-- RLS on with no policies = deny-all for anon/authenticated; the service
-- role bypasses RLS. Clients have no reason to read sync bookkeeping.
alter table public.sync_state enable row level security;
revoke all on public.sync_state from anon, authenticated;

insert into public.sync_state (id) values (true) on conflict (id) do nothing;
