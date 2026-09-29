-- Reminders twice a day in each member's own time (morning and night), streak milestones
-- and a weekly summary. Supabase calls /api/cron/recordatorio every hour (pg_cron +
-- pg_net); the route decides, device by device, whether it is morning or night there.

alter table public.push_subscriptions
  add column if not exists tz text,
  add column if not exists morning_day date,
  add column if not exists night_day date,
  add column if not exists week_day date,
  add column if not exists milestone integer not null default 0;

-- The Polish site shares this database (tables with the pl_ prefix).
do $$
begin
  if to_regclass('public.pl_push_subscriptions') is not null then
    alter table public.pl_push_subscriptions
      add column if not exists tz text,
      add column if not exists morning_day date,
      add column if not exists night_day date,
      add column if not exists week_day date,
      add column if not exists milestone integer not null default 0;
  end if;
end $$;

-- The key the hourly call carries (x-cron-key), so nobody else can trigger it.
insert into public.app_config (key, value)
values ('cron_key', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''))
on conflict (key) do nothing;

create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;

do $$
begin
  perform cron.unschedule('ib-es-recordatorio') where exists (select 1 from cron.job where jobname = 'ib-es-recordatorio');
  perform cron.schedule(
    'ib-es-recordatorio',
    '2 * * * *',
    $job$
      select net.http_get(
        url := 'https://es.innerbible.app/api/cron/recordatorio',
        headers := jsonb_build_object('x-cron-key', (select value from public.app_config where key = 'cron_key')),
        timeout_milliseconds := 55000
      )
    $job$
  );
end $$;

notify pgrst, 'reload schema';
