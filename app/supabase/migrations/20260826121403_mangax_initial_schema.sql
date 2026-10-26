-- MangaX schema — covers: profiles/theme+premium state, catalog
-- (series/chapters/pages), per-user library/progress, and social
-- (ratings/comments). Everything is keyed to auth.uid() and locked down
-- with row-level security so each user only ever reads/writes their own
-- rows; series/chapters/pages are public read, writes reserved for a
-- service role (content pipeline), not users.

-- ── profiles ──────────────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_file text,
  theme jsonb not null default '{"accent":"crimson","font":"mono","density":"comfy"}',
  premium boolean not null default false,
  premium_since timestamptz,
  xp integer not null default 0,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
create policy "profiles are self-readable" on profiles for select using (auth.uid() = id);
create policy "profiles are self-writable" on profiles for update using (auth.uid() = id);
create policy "profiles insert own row" on profiles for insert with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── catalog ───────────────────────────────────────────────────────
create table if not exists series (
  id bigint generated always as identity primary key,
  title text not null,
  author text,
  tags text[] not null default '{}',
  demographic text check (demographic in ('Shounen','Seinen','Shoujo','Josei')),
  status text check (status in ('Ongoing','Completed','Hiatus','Cancelled')) default 'Ongoing',
  year int,
  cover_file text,
  rating numeric(2,1) default 0,
  rating_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists chapters (
  id bigint generated always as identity primary key,
  series_id bigint not null references series(id) on delete cascade,
  number numeric not null,
  title text,
  published_at timestamptz not null default now(),
  page_count int not null default 0,
  unique (series_id, number)
);

create table if not exists chapter_pages (
  id bigint generated always as identity primary key,
  chapter_id bigint not null references chapters(id) on delete cascade,
  page_index int not null,
  image_url text not null,
  unique (chapter_id, page_index)
);

alter table series enable row level security;
alter table chapters enable row level security;
alter table chapter_pages enable row level security;
create policy "series are publicly readable" on series for select using (true);
create policy "chapters are publicly readable" on chapters for select using (true);
create policy "pages are publicly readable" on chapter_pages for select using (true);

-- ── per-user library & progress ──────────────────────────────────
create table if not exists library_entries (
  user_id uuid not null references auth.users(id) on delete cascade,
  series_id bigint not null references series(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (user_id, series_id)
);

create table if not exists reading_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  series_id bigint not null references series(id) on delete cascade,
  chapter_id bigint not null references chapters(id) on delete cascade,
  page_index int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, series_id)
);

alter table library_entries enable row level security;
alter table reading_progress enable row level security;
create policy "users manage own library" on library_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own progress" on reading_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── social: ratings & comments ────────────────────────────────────
create table if not exists ratings (
  user_id uuid not null references auth.users(id) on delete cascade,
  series_id bigint not null references series(id) on delete cascade,
  value smallint not null check (value between 1 and 5),
  created_at timestamptz not null default now(),
  primary key (user_id, series_id)
);

create table if not exists comments (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id bigint not null references chapters(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table ratings enable row level security;
alter table comments enable row level security;
create policy "ratings are publicly readable" on ratings for select using (true);
create policy "users manage own ratings" on ratings for insert with check (auth.uid() = user_id);
create policy "users update own ratings" on ratings for update using (auth.uid() = user_id);
create policy "comments are publicly readable" on comments for select using (true);
create policy "users write own comments" on comments for insert with check (auth.uid() = user_id);
create policy "users edit own comments" on comments for update using (auth.uid() = user_id);
create policy "users delete own comments" on comments for delete using (auth.uid() = user_id);
