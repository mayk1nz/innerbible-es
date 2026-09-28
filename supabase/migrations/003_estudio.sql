-- Tu Guía de Estudio (regalo 8): cache of the chains already explained (shared by all
-- members: the same search never pays the AI twice) and the daily count per member.

create table if not exists public.estudio_cache (
  key text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.estudio_usage (
  email text not null,
  day date not null,
  count integer not null default 0,
  primary key (email, day)
);

alter table public.estudio_cache enable row level security;
alter table public.estudio_usage enable row level security;
grant all on public.estudio_cache, public.estudio_usage to service_role;

create or replace function public.estudio_count(p_email text, p_day date)
returns integer language sql as $$
  insert into public.estudio_usage (email, day, count) values (p_email, p_day, 1)
  on conflict (email, day) do update set count = public.estudio_usage.count + 1
  returning count;
$$;
grant execute on function public.estudio_count(text, date) to service_role;

notify pgrst, 'reload schema';
