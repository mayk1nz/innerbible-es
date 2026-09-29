-- The real Comunidad: wall posts, shared reflections, the team's daily "Palabra del día",
-- likes ("amén") and comments; plus the snapshot of the weekly ranking the hourly cron
-- compares against to tell a member that someone passed them.
-- Only the server (service role) reads and writes: RLS on with no policies.

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  email text,                    -- null only for the team's posts (kind 'daily')
  author text not null,          -- name shown ("Rosa E." / "Equipo La Biblia Interior")
  kind text not null check (kind in ('post', 'reflection', 'daily')),
  text text not null,
  lesson_key text,               -- "cronologico/genesis-1-11"
  day date,                      -- the day of a Palabra del día (one per day)
  created_at timestamptz not null default now(),
  hidden boolean not null default false,
  check (kind = 'daily' or email is not null)
);
-- One shared reflection per member and lesson; one Palabra del día per day.
create unique index if not exists community_posts_reflection_uq on public.community_posts (email, lesson_key) where kind = 'reflection';
create unique index if not exists community_posts_daily_uq on public.community_posts (day) where kind = 'daily';
create index if not exists community_posts_feed_idx on public.community_posts (created_at desc, id desc) where not hidden;
create index if not exists community_posts_email_idx on public.community_posts (email, created_at desc);
create index if not exists community_posts_lesson_idx on public.community_posts (lesson_key, created_at desc) where not hidden;

create table if not exists public.community_likes (
  post_id uuid not null references public.community_posts (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, email)
);
create index if not exists community_likes_email_idx on public.community_likes (email);

create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts (id) on delete cascade,
  email text not null,
  author text not null,
  text text not null,
  created_at timestamptz not null default now(),
  hidden boolean not null default false
);
create index if not exists community_comments_post_idx on public.community_comments (post_id, created_at);
create index if not exists community_comments_email_idx on public.community_comments (email, created_at desc);

-- Where each member stood in the weekly ranking at the last hourly run.
create table if not exists public.ranking_snapshots (
  email text primary key,
  week date not null,
  rank integer not null,
  points integer not null,
  notified_day date,
  updated_at timestamptz not null default now()
);

alter table public.community_posts enable row level security;
alter table public.community_likes enable row level security;
alter table public.community_comments enable row level security;
alter table public.ranking_snapshots enable row level security;
grant all on public.community_posts, public.community_likes, public.community_comments, public.ranking_snapshots to service_role;

-- Likes, comments and "did I like it" for a page of posts, in one call.
create or replace function public.community_counts(p_ids uuid[], p_email text)
returns table (post_id uuid, likes bigint, comments bigint, liked boolean)
language sql stable as $$
  select p.id,
    (select count(*) from public.community_likes l where l.post_id = p.id),
    (select count(*) from public.community_comments c where c.post_id = p.id and not c.hidden),
    exists (select 1 from public.community_likes l where l.post_id = p.id and l.email = p_email)
  from unnest(p_ids) as p(id);
$$;
revoke all on function public.community_counts(uuid[], text) from public, anon, authenticated;
grant execute on function public.community_counts(uuid[], text) to service_role;

-- ─── The Polish site shares this database (tables with the pl_ prefix) ───

create table if not exists public.pl_community_posts (
  id uuid primary key default gen_random_uuid(),
  email text,
  author text not null,
  kind text not null check (kind in ('post', 'reflection', 'daily')),
  text text not null,
  lesson_key text,
  day date,
  created_at timestamptz not null default now(),
  hidden boolean not null default false,
  check (kind = 'daily' or email is not null)
);
create unique index if not exists pl_community_posts_reflection_uq on public.pl_community_posts (email, lesson_key) where kind = 'reflection';
create unique index if not exists pl_community_posts_daily_uq on public.pl_community_posts (day) where kind = 'daily';
create index if not exists pl_community_posts_feed_idx on public.pl_community_posts (created_at desc, id desc) where not hidden;
create index if not exists pl_community_posts_email_idx on public.pl_community_posts (email, created_at desc);
create index if not exists pl_community_posts_lesson_idx on public.pl_community_posts (lesson_key, created_at desc) where not hidden;

create table if not exists public.pl_community_likes (
  post_id uuid not null references public.pl_community_posts (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, email)
);
create index if not exists pl_community_likes_email_idx on public.pl_community_likes (email);

create table if not exists public.pl_community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.pl_community_posts (id) on delete cascade,
  email text not null,
  author text not null,
  text text not null,
  created_at timestamptz not null default now(),
  hidden boolean not null default false
);
create index if not exists pl_community_comments_post_idx on public.pl_community_comments (post_id, created_at);
create index if not exists pl_community_comments_email_idx on public.pl_community_comments (email, created_at desc);

create table if not exists public.pl_ranking_snapshots (
  email text primary key,
  week date not null,
  rank integer not null,
  points integer not null,
  notified_day date,
  updated_at timestamptz not null default now()
);

alter table public.pl_community_posts enable row level security;
alter table public.pl_community_likes enable row level security;
alter table public.pl_community_comments enable row level security;
alter table public.pl_ranking_snapshots enable row level security;
grant all on public.pl_community_posts, public.pl_community_likes, public.pl_community_comments, public.pl_ranking_snapshots to service_role;

create or replace function public.pl_community_counts(p_ids uuid[], p_email text)
returns table (post_id uuid, likes bigint, comments bigint, liked boolean)
language sql stable as $$
  select p.id,
    (select count(*) from public.pl_community_likes l where l.post_id = p.id),
    (select count(*) from public.pl_community_comments c where c.post_id = p.id and not c.hidden),
    exists (select 1 from public.pl_community_likes l where l.post_id = p.id and l.email = p_email)
  from unnest(p_ids) as p(id);
$$;
revoke all on function public.pl_community_counts(uuid[], text) from public, anon, authenticated;
grant execute on function public.pl_community_counts(uuid[], text) to service_role;

notify pgrst, 'reload schema';
