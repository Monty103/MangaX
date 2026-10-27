-- Removes the 12 demo titles inserted by seed_catalog. They predate the
-- fetcher, have no pages anywhere, and are the only series without a
-- fetcher_series_id. Their chapters, ratings, library entries, reading
-- progress and comments go with them (all foreign keys cascade); when this was
-- written the project had no user accounts, so none of those existed.
--
-- The app keeps its own mock copies (src/data/mockSeries.ts) for working
-- without a backend; the Home screen still draws from them.

delete from public.series
where fetcher_series_id is null;
