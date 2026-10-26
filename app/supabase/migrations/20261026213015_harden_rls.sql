-- Closes the gaps the Supabase advisors and security checklist found in the
-- initial schema. No user rows exist yet, so nothing has been exposed.
--
-- 1. Users could edit columns they must never control. The profiles update
--    policy limited *which row*, not *which columns*, so a signed-in user could
--    set their own premium/premium_since/xp. Those are server-authoritative
--    (see src/monetization/useEntitlement.ts). Column-level grants now limit
--    what clients can write; RLS still limits which rows.
--    Comments had the same problem: chapter_id was editable, so a comment
--    could be moved to another chapter.
-- 2. Update policies had no WITH CHECK. Postgres falls back to USING for the
--    new row, so reassigning user_id was already blocked; the explicit
--    WITH CHECK states the rule instead of relying on the fallback.
-- 3. auth.uid() was re-evaluated per row; (select auth.uid()) runs once.
-- 4. Six foreign keys had no covering index (slow joins and cascades).
--
-- Policies are scoped `to authenticated`: anon has no auth.uid(), so they
-- never matched anon anyway; this just stops evaluating them for it.

-- ── column privileges ─────────────────────────────────────────────
-- Supabase grants anon/authenticated ALL on public tables by default. Take
-- writes back, then grant only the columns a client legitimately edits.

-- profiles: the row is created by the on_auth_user_created trigger (security
-- definer), so clients never insert. They may edit display settings only.
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (username, avatar_file, theme) on public.profiles to authenticated;

-- ratings: a user may change the value of their own rating, nothing else.
revoke update on public.ratings from anon, authenticated;
grant update (value) on public.ratings to authenticated;

-- comments: a user may edit the body of their own comment, not move it to
-- another chapter or backdate it.
revoke update on public.comments from anon, authenticated;
grant update (body) on public.comments to authenticated;

-- ── policies ──────────────────────────────────────────────────────
-- profiles
drop policy if exists "profiles are self-readable" on public.profiles;
drop policy if exists "profiles are self-writable" on public.profiles;
drop policy if exists "profiles insert own row" on public.profiles;

create policy "profiles are self-readable" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);
create policy "profiles are self-writable" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- library_entries / reading_progress: full control over own rows
drop policy if exists "users manage own library" on public.library_entries;
create policy "users manage own library" on public.library_entries
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "users manage own progress" on public.reading_progress;
create policy "users manage own progress" on public.reading_progress
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ratings (public read policy is unchanged)
drop policy if exists "users manage own ratings" on public.ratings;
drop policy if exists "users update own ratings" on public.ratings;
create policy "users manage own ratings" on public.ratings
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "users update own ratings" on public.ratings
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- comments (public read policy is unchanged)
drop policy if exists "users write own comments" on public.comments;
drop policy if exists "users edit own comments" on public.comments;
drop policy if exists "users delete own comments" on public.comments;
create policy "users write own comments" on public.comments
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "users edit own comments" on public.comments
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "users delete own comments" on public.comments
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ── foreign-key indexes ───────────────────────────────────────────
-- Tables are empty, so a plain (non-concurrent) build is instant.
create index if not exists comments_chapter_id_idx on public.comments (chapter_id);
create index if not exists comments_user_id_idx on public.comments (user_id);
create index if not exists library_entries_series_id_idx on public.library_entries (series_id);
create index if not exists ratings_series_id_idx on public.ratings (series_id);
create index if not exists reading_progress_series_id_idx on public.reading_progress (series_id);
create index if not exists reading_progress_chapter_id_idx on public.reading_progress (chapter_id);
