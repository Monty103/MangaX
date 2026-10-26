-- Seeds the same 12-title catalog used by the app's mock data
-- (src/data/mockSeries.ts) so identity ids line up 1:1 once Browse/Series
-- detail (tasks 7-8) switch from mock arrays to real Supabase queries.
insert into series (title, author, tags, demographic, status, year, rating, rating_count) values
  ('Iron Lantern', 'K. Mori', array['Action','Supernatural'], 'Shounen', 'Ongoing', 2021, 4.7, 12840),
  ('Saltwater Atlas', 'R. Aoyama', array['Adventure','Drama'], 'Seinen', 'Ongoing', 2022, 4.5, 6521),
  ('Paper Daughters', 'M. Tanaka', array['Slice of Life','Romance'], 'Josei', 'Ongoing', 2020, 4.8, 9203),
  ('Veil of the Hollow', 'S. Kuroda', array['Horror','Mystery'], 'Seinen', 'Hiatus', 2023, 4.6, 4112),
  ('Boys at Eight Sigma', 'Y. Hibiki', array['Sci-Fi','Action'], 'Shounen', 'Ongoing', 2018, 4.4, 18921),
  ('Dewline', 'A. Saeki', array['Romance','School'], 'Shoujo', 'Completed', 2019, 4.9, 22100),
  ('Old Gods of the Ginza', 'T. Hayami', array['Fantasy','Action'], 'Seinen', 'Ongoing', 2022, 4.3, 5610),
  ('Threadbare', 'H. Imai', array['Drama','Psychological'], 'Seinen', 'Ongoing', 2024, 4.7, 2304),
  ('Mockingbird Protocol', 'L. Ozaki', array['Sci-Fi','Thriller'], 'Seinen', 'Ongoing', 2021, 4.5, 7820),
  ('Sundial', 'K. Wakatsuki', array['Slice of Life'], 'Seinen', 'Ongoing', 2023, 4.6, 3104),
  ('Cherry Carbide', 'N. Sora', array['Action','Comedy'], 'Shounen', 'Ongoing', 2020, 4.2, 4500),
  ('Pale Horizon', 'I. Fujimaki', array['Drama','Historical'], 'Seinen', 'Ongoing', 2024, 4.8, 1980)
on conflict do nothing;

-- A handful of recent chapters per series (not the full run) — enough for
-- a real "latest chapter" / chapter-list query without generating hundreds
-- of placeholder rows ahead of the real content pipeline.
insert into chapters (series_id, number, published_at, page_count)
select s.id, n, now() - (random() * interval '30 days'), 20 + floor(random() * 15)::int
from series s
cross join lateral (
  select generate_series(
    greatest(1, (case s.title
      when 'Iron Lantern' then 142 when 'Saltwater Atlas' then 87 when 'Paper Daughters' then 64
      when 'Veil of the Hollow' then 38 when 'Boys at Eight Sigma' then 211 when 'Dewline' then 52
      when 'Old Gods of the Ginza' then 96 when 'Threadbare' then 24 when 'Mockingbird Protocol' then 119
      when 'Sundial' then 41 when 'Cherry Carbide' then 78 when 'Pale Horizon' then 33 end) - 4),
    (case s.title
      when 'Iron Lantern' then 142 when 'Saltwater Atlas' then 87 when 'Paper Daughters' then 64
      when 'Veil of the Hollow' then 38 when 'Boys at Eight Sigma' then 211 when 'Dewline' then 52
      when 'Old Gods of the Ginza' then 96 when 'Threadbare' then 24 when 'Mockingbird Protocol' then 119
      when 'Sundial' then 41 when 'Cherry Carbide' then 78 when 'Pale Horizon' then 33 end)
  ) as n
) x
on conflict do nothing;
