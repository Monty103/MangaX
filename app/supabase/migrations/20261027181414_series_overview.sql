-- One row per series with what the Home screen needs about its chapters:
-- the highest chapter number, and the newest readable ('available') chapter
-- with its date. Saves the app from downloading every chapter row to work
-- those out.
--
-- security_invoker: the view runs with the caller's rights, so the RLS on
-- series and chapters (both publicly readable) still applies.

create view public.series_overview
with (security_invoker = true)
as
select
  s.id,
  s.title,
  s.author,
  s.tags,
  s.demographic,
  s.status,
  s.year,
  s.cover_file,
  s.rating,
  s.rating_count,
  s.description,
  totals.last_chapter,
  latest.number as latest_chapter,
  latest.published_at as latest_chapter_at
from public.series s
left join lateral (
  select max(c.number) as last_chapter
  from public.chapters c
  where c.series_id = s.id
) totals on true
left join lateral (
  select c.number, c.published_at
  from public.chapters c
  where c.series_id = s.id and c.fetcher_status = 'available'
  order by c.published_at desc, c.number desc
  limit 1
) latest on true;

grant select on public.series_overview to anon, authenticated;

-- Serves the "newest readable chapter" lookup above.
create index chapters_available_latest_idx
  on public.chapters (series_id, published_at desc)
  where fetcher_status = 'available';
