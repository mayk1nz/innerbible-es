-- The member's progress (lessons done, points, reflections, where they left off), so it
-- follows them to another phone or browser. One JSON document per member, written by
-- /api/progress after the app merges it with what is on the device.

create table if not exists public.member_progress (
  email text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.member_progress enable row level security;
grant all on public.member_progress to service_role;

-- The Polish site shares this database (tables with the pl_ prefix).
create table if not exists public.pl_member_progress (
  email text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.pl_member_progress enable row level security;
grant all on public.pl_member_progress to service_role;

notify pgrst, 'reload schema';
