-- Funnel telemetry: first-party events of the whole journey (quiz → VSL → KashPay
-- checkout → upsells → bienvenido → login → first lesson), the visitors with their
-- first-touch attribution and the e-mail they turned out to be, and every Stripe
-- webhook (KashPay charges through the owner's Stripe account) with the decline reason.
--
--   funnel_visitors  one row per browser id (vid): first touch, e-mail once known
--   funnel_events    events (POST /api/events + server events: purchase, login_success…)
--   stripe_events    Stripe webhooks, flattened (reason, card country, outcome…)
--   stripe_alerts    one row per failed payment that pushed an alert to the admins
--   funnel_touch()   upsert of a visitor on each batch (first touch wins)
--   funnel_link()    vid ↔ e-mail (KashPay tracking, login, session)
--   funnel_report()  the /admin/funil numbers for a range (sequential funnel)
--   funnel_kpis()    today / 7 d / 30 d
--
-- Identity: an event's actor is its visitor's e-mail once linked ('e:' + e-mail),
-- otherwise the vid ('v:' + vid). Linking happens later (purchase, login), so it is
-- resolved at query time: a whole journey joins up as soon as the e-mail is known,
-- across devices too.
--
-- Only the server (service role) reads and writes: RLS on with no policies.
-- The Polish site shares this database: every object is created twice, the second
-- time with the pl_ prefix (the template below, {P} = '' and 'pl_').

do $do$
declare
  p text;
  tpl text := $tpl$

create table if not exists public.{P}funnel_visitors (
  vid text primary key,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  email text,
  email_source text,                 -- kashpay | login | session | stripe
  email_linked_at timestamptz,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  fbclid text,
  referrer text,                     -- external referrer of the first arrival
  landing_path text,                 -- first page (path + search, trimmed)
  country text,                      -- x-vercel-ip-country of the first request
  device text                        -- mobile·ios, desktop·windows…
);
create index if not exists {P}funnel_visitors_email_idx on public.{P}funnel_visitors (lower(email)) where email is not null;
create index if not exists {P}funnel_visitors_last_seen_idx on public.{P}funnel_visitors (last_seen desc);
create index if not exists {P}funnel_visitors_first_seen_idx on public.{P}funnel_visitors (first_seen);

create table if not exists public.{P}funnel_events (
  id bigserial primary key,
  event_id uuid not null,
  vid text,
  sid text,
  name text not null,
  props jsonb not null default '{}'::jsonb,
  path text,
  email text,
  country text,
  device text,
  utm_source text,
  utm_campaign text,
  created_at timestamptz not null default now()
);
create unique index if not exists {P}funnel_events_event_id_key on public.{P}funnel_events (event_id);
create index if not exists {P}funnel_events_created_idx on public.{P}funnel_events (created_at);
create index if not exists {P}funnel_events_vid_idx on public.{P}funnel_events (vid, created_at);
create index if not exists {P}funnel_events_name_idx on public.{P}funnel_events (name, created_at);
create index if not exists {P}funnel_events_email_idx on public.{P}funnel_events (lower(email), created_at) where email is not null;

create table if not exists public.{P}stripe_events (
  id bigserial primary key,
  stripe_event_id text not null unique,
  type text not null,
  livemode boolean,
  event_created timestamptz,
  received_at timestamptz not null default now(),
  object_id text,
  payment_intent text,
  charge_id text,
  invoice_id text,
  customer_id text,
  subscription_id text,
  email text,
  amount bigint,                     -- minor units of `currency`
  currency text,
  status text,
  decline_code text,
  failure_code text,                 -- `code` of the error / charge failure_code
  failure_message text,
  card_country text,
  card_brand text,
  card_funding text,
  outcome_reason text,
  outcome_risk_level text,
  outcome_network_status text,
  outcome_type text,
  vid text,
  alert_key text,
  payload jsonb
);
create index if not exists {P}stripe_events_received_idx on public.{P}stripe_events (received_at desc);
create index if not exists {P}stripe_events_pi_idx on public.{P}stripe_events (payment_intent) where payment_intent is not null;
create index if not exists {P}stripe_events_customer_idx on public.{P}stripe_events (customer_id) where customer_id is not null;
create index if not exists {P}stripe_events_email_idx on public.{P}stripe_events (lower(email)) where email is not null;

create table if not exists public.{P}stripe_alerts (
  key text primary key,              -- payment intent (else charge / invoice / object id)
  stripe_event_id text,
  created_at timestamptz not null default now(),
  title text,
  body text,
  dry boolean not null default false,
  result text
);

alter table public.{P}funnel_visitors enable row level security;
alter table public.{P}funnel_events enable row level security;
alter table public.{P}stripe_events enable row level security;
alter table public.{P}stripe_alerts enable row level security;
revoke all on public.{P}funnel_visitors, public.{P}funnel_events, public.{P}stripe_events, public.{P}stripe_alerts from anon, authenticated;
grant all on public.{P}funnel_visitors, public.{P}funnel_events, public.{P}stripe_events, public.{P}stripe_alerts to service_role;

-- A visitor seen again (each batch of events). First touch wins: the attribution is
-- only written while the row has none (a row created by a link has none yet).
create or replace function public.{P}funnel_touch(p_vid text, p_attr jsonb, p_country text, p_device text)
returns void language sql security definer set search_path = public as $f$
  insert into public.{P}funnel_visitors as v
    (vid, utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid, referrer, landing_path, country, device)
  values (p_vid, p_attr->>'utm_source', p_attr->>'utm_medium', p_attr->>'utm_campaign', p_attr->>'utm_content',
          p_attr->>'utm_term', p_attr->>'fbclid', p_attr->>'referrer', p_attr->>'landing', p_country, p_device)
  on conflict (vid) do update set
    last_seen = now(),
    country = coalesce(v.country, excluded.country),
    device = coalesce(v.device, excluded.device),
    utm_source = case when v.landing_path is null then excluded.utm_source else v.utm_source end,
    utm_medium = case when v.landing_path is null then excluded.utm_medium else v.utm_medium end,
    utm_campaign = case when v.landing_path is null then excluded.utm_campaign else v.utm_campaign end,
    utm_content = case when v.landing_path is null then excluded.utm_content else v.utm_content end,
    utm_term = case when v.landing_path is null then excluded.utm_term else v.utm_term end,
    fbclid = case when v.landing_path is null then excluded.fbclid else v.fbclid end,
    referrer = case when v.landing_path is null then excluded.referrer else v.referrer end,
    landing_path = coalesce(v.landing_path, excluded.landing_path);
$f$;

-- vid ↔ e-mail. The first e-mail linked to a browser stays (a shared phone keeps its buyer).
create or replace function public.{P}funnel_link(p_vid text, p_email text, p_source text)
returns void language sql security definer set search_path = public as $f$
  insert into public.{P}funnel_visitors as v (vid, email, email_source, email_linked_at)
  values (p_vid, lower(p_email), p_source, now())
  on conflict (vid) do update set
    email = coalesce(v.email, excluded.email),
    email_source = case when v.email is null then excluded.email_source else v.email_source end,
    email_linked_at = case when v.email is null then now() else v.email_linked_at end,
    last_seen = now();
$f$;

-- The /admin/funil numbers for [p_from, p_to). Sequential funnel: each step counts the
-- actors who also cleared every step above it, so every rate is <= 100% by construction
-- (the same definition as innerbible's ib_metrics_source_funnel, 20260918_02).
--   s1 opened the quiz · s2 started · s3 finished · s4 saw the offer page · s5 watched the
--   VSL up to the offer · s6 clicked the checkout · s7 paid the front (KashPay purchase,
--   or arrived at upsell 1 with KashPay's ks) · s8 saw upsell 1 · s9 saw upsell 2 ·
--   s10 bienvenido · s11 logged in · s12 finished a first lesson.
-- Upsell branches (accept / decline / paid, downsells) hang off s8 and s9. Source and
-- campaign are the actor's first touch. Stripe and KashPay counts ignore the filters.
create or replace function public.{P}funnel_report(p_from timestamptz, p_to timestamptz, p_source text default null, p_campaign text default null)
returns jsonb language sql stable security definer set search_path = public as $f$
  with ev as (
    select fe.name, fe.props, fe.created_at,
      nullif(coalesce(fv.utm_source, fe.utm_source), '') as src0,
      nullif(coalesce(fv.utm_campaign, fe.utm_campaign), '') as camp0,
      nullif(coalesce(fv.country, fe.country), '') as ctry0,
      case when coalesce(fe.email, fv.email) is not null then 'e:' || lower(coalesce(fe.email, fv.email)) else 'v:' || fe.vid end as actor
    from public.{P}funnel_events fe
    left join public.{P}funnel_visitors fv on fv.vid = fe.vid
    where fe.created_at >= p_from and fe.created_at < p_to
      and (fe.vid is not null or fe.email is not null)
  ),
  acts as (
    select actor,
      coalesce((array_agg(src0 order by created_at) filter (where src0 is not null))[1], '(direto)') as src,
      coalesce((array_agg(camp0 order by created_at) filter (where camp0 is not null))[1], '(sem campanha)') as camp,
      coalesce((array_agg(ctry0 order by created_at) filter (where ctry0 is not null))[1], '??') as country,
      bool_or(name = 'quiz_view') as e_open,
      bool_or(name = 'quiz_start') as e_start,
      bool_or(name = 'quiz_complete') as e_complete,
      bool_or(name = 'offer_view') as e_offer,
      bool_or(name = 'offer_reveal') as e_reveal,
      bool_or(name = 'checkout_click') as e_checkout,
      bool_or((name = 'purchase' and props->>'offer' = 'front') or (name = 'upsell_view' and props->>'from_purchase' = 'true')) as e_paid,
      bool_or(name = 'purchase' and props->>'offer' = 'front') as e_paid_kashpay,
      bool_or(name = 'upsell_view' and props->>'step' = 'up1') as e_up1,
      bool_or(name = 'upsell_accept_click' and props->>'step' = 'up1') as e_up1_acc,
      bool_or(name = 'upsell_decline_click' and props->>'step' = 'up1') as e_up1_dec,
      bool_or(name = 'purchase' and props->>'offer' = 'up1') as e_up1_paid,
      bool_or(name = 'upsell_view' and props->>'step' = 'down1') as e_down1,
      bool_or(name = 'upsell_accept_click' and props->>'step' = 'down1') as e_down1_acc,
      bool_or(name = 'upsell_decline_click' and props->>'step' = 'down1') as e_down1_dec,
      bool_or(name = 'purchase' and props->>'offer' = 'down1') as e_down1_paid,
      bool_or(name = 'upsell_view' and props->>'step' = 'up2') as e_up2,
      bool_or(name = 'upsell_accept_click' and props->>'step' = 'up2') as e_up2_acc,
      bool_or(name = 'upsell_decline_click' and props->>'step' = 'up2') as e_up2_dec,
      bool_or(name = 'purchase' and props->>'offer' = 'up2') as e_up2_paid,
      bool_or(name = 'upsell_view' and props->>'step' = 'down2') as e_down2,
      bool_or(name = 'upsell_accept_click' and props->>'step' = 'down2') as e_down2_acc,
      bool_or(name = 'upsell_decline_click' and props->>'step' = 'down2') as e_down2_dec,
      bool_or(name = 'purchase' and props->>'offer' = 'down2') as e_down2_paid,
      bool_or(name = 'upsell_no_purchase') as e_no_purchase,
      bool_or(name = 'welcome_view') as e_welcome,
      bool_or(name = 'login_success') as e_login,
      bool_or(name = 'app_first_open') as e_app,
      bool_or(name = 'first_lesson_done') as e_lesson,
      coalesce(sum(case when name = 'purchase' and props->>'amount_cents' ~ '^[0-9]{1,12}$' then (props->>'amount_cents')::bigint end), 0) as revenue
    from ev
    group by actor
  ),
  f as (
    select * from acts
    where (p_source is null or p_source in ('', 'all') or lower(src) = lower(p_source))
      and (p_campaign is null or p_campaign in ('', 'all') or lower(camp) = lower(p_campaign))
  ),
  pr as (
    select f.*,
      (e_open or e_start) as s1,
      e_start as s2,
      (e_start and e_complete) as s3,
      (e_start and e_complete and e_offer) as s4,
      (e_start and e_complete and e_offer and e_reveal) as s5,
      (e_start and e_complete and e_offer and e_reveal and e_checkout) as s6,
      (e_start and e_complete and e_offer and e_reveal and e_checkout and e_paid) as s7
    from f
  ),
  pr2 as (
    select pr.*,
      (s7 and e_up1) as s8,
      (s7 and e_up1 and e_up2) as s9,
      (s7 and e_up1 and e_up2 and e_welcome) as s10,
      (s7 and e_up1 and e_up2 and e_welcome and e_login) as s11,
      (s7 and e_up1 and e_up2 and e_welcome and e_login and e_lesson) as s12
    from pr
  ),
  n as (
    select
      count(*) filter (where s1) as s1, count(*) filter (where s2) as s2, count(*) filter (where s3) as s3,
      count(*) filter (where s4) as s4, count(*) filter (where s5) as s5, count(*) filter (where s6) as s6,
      count(*) filter (where s7) as s7, count(*) filter (where s8) as s8, count(*) filter (where s9) as s9,
      count(*) filter (where s10) as s10, count(*) filter (where s11) as s11, count(*) filter (where s12) as s12,
      count(*) filter (where s8 and e_up1_acc) as up1_acc,
      count(*) filter (where s8 and e_up1_dec) as up1_dec,
      count(*) filter (where s8 and e_up1_paid) as up1_paid,
      count(*) filter (where s8 and e_down1) as down1_view,
      count(*) filter (where s8 and e_down1 and e_down1_acc) as down1_acc,
      count(*) filter (where s8 and e_down1 and e_down1_dec) as down1_dec,
      count(*) filter (where s8 and e_down1 and e_down1_paid) as down1_paid,
      count(*) filter (where s9 and e_up2_acc) as up2_acc,
      count(*) filter (where s9 and e_up2_dec) as up2_dec,
      count(*) filter (where s9 and e_up2_paid) as up2_paid,
      count(*) filter (where s9 and e_down2) as down2_view,
      count(*) filter (where s9 and e_down2 and e_down2_acc) as down2_acc,
      count(*) filter (where s9 and e_down2 and e_down2_dec) as down2_dec,
      count(*) filter (where s9 and e_down2 and e_down2_paid) as down2_paid,
      coalesce(sum(revenue), 0) as revenue,
      count(*) filter (where revenue > 0) as buyers
    from pr2
  ),
  raw as (
    select
      count(*) filter (where e_open) as quiz_view, count(*) filter (where e_start) as quiz_start,
      count(*) filter (where e_complete) as quiz_complete, count(*) filter (where e_offer) as offer_view,
      count(*) filter (where e_reveal) as offer_reveal, count(*) filter (where e_checkout) as checkout_click,
      count(*) filter (where e_paid) as front_paid, count(*) filter (where e_paid_kashpay) as front_paid_kashpay,
      count(*) filter (where e_up1) as up1_view, count(*) filter (where e_up1_acc) as up1_acc,
      count(*) filter (where e_up1_dec) as up1_dec, count(*) filter (where e_up1_paid) as up1_paid,
      count(*) filter (where e_down1) as down1_view, count(*) filter (where e_down1_acc) as down1_acc,
      count(*) filter (where e_down1_paid) as down1_paid,
      count(*) filter (where e_up2) as up2_view, count(*) filter (where e_up2_acc) as up2_acc,
      count(*) filter (where e_up2_dec) as up2_dec, count(*) filter (where e_up2_paid) as up2_paid,
      count(*) filter (where e_down2) as down2_view, count(*) filter (where e_down2_acc) as down2_acc,
      count(*) filter (where e_down2_paid) as down2_paid,
      count(*) filter (where e_no_purchase) as upsell_no_purchase,
      count(*) filter (where e_welcome) as welcome_view, count(*) filter (where e_login) as login_success,
      count(*) filter (where e_app) as app_first_open, count(*) filter (where e_lesson) as first_lesson_done
    from f
  ),
  origin as (
    select src, camp,
      count(*) filter (where s1) as entrances, count(*) filter (where s3) as quiz_complete,
      count(*) filter (where s6) as checkout, count(*) filter (where s7) as paid,
      coalesce(sum(revenue), 0) as revenue
    from pr2 group by src, camp
  ),
  country as (
    select country,
      count(*) filter (where s1) as entrances, count(*) filter (where s3) as quiz_complete,
      count(*) filter (where s6) as checkout, count(*) filter (where s7) as paid,
      coalesce(sum(revenue), 0) as revenue
    from pr2 group by country
  ),
  evf as (
    select ev.* from ev where ev.actor in (select actor from f)
  ),
  vp as (
    select actor, name,
      case when name in ('offer_view', 'offer_reveal') then 'front'
           when name in ('upsell_view', 'upsell_reveal') then props->>'step'
           else props->>'page' end as page,
      case when props->>'pct' ~ '^[0-9]{1,3}$' then (props->>'pct')::int end as pct
    from evf
    where name in ('offer_view', 'offer_reveal', 'upsell_view', 'upsell_reveal', 'vsl_play', 'vsl_progress')
  ),
  vsl as (
    select page,
      count(distinct actor) filter (where name in ('offer_view', 'upsell_view')) as views,
      count(distinct actor) filter (where name = 'vsl_play') as plays,
      count(distinct actor) filter (where name = 'vsl_progress' and pct >= 25) as p25,
      count(distinct actor) filter (where name = 'vsl_progress' and pct >= 50) as p50,
      count(distinct actor) filter (where name = 'vsl_progress' and pct >= 75) as p75,
      count(distinct actor) filter (where name = 'vsl_progress' and pct >= 100) as p100,
      count(distinct actor) filter (where name in ('offer_reveal', 'upsell_reveal')) as reveal
    from vp where page in ('front', 'up1', 'up2')
    group by page
  ),
  qs as (
    select (props->>'step')::int as step, min(props->>'name') as step_name, count(distinct actor) as actors
    from evf
    where name = 'quiz_view' and props->>'step' ~ '^[0-9]{1,3}$'
    group by 1
  ),
  st as (
    select s.*, coalesce(s.payment_intent, s.charge_id, s.invoice_id, s.object_id) as k
    from public.{P}stripe_events s
    where coalesce(s.event_created, s.received_at) >= p_from and coalesce(s.event_created, s.received_at) < p_to
  ),
  sk as (
    select k,
      bool_or(type in ('payment_intent.succeeded', 'charge.succeeded')) as ok,
      bool_or(type in ('payment_intent.payment_failed', 'charge.failed')) as failed,
      coalesce(
        (array_agg(decline_code order by received_at) filter (where decline_code is not null))[1],
        (array_agg(outcome_reason order by received_at) filter (where outcome_reason is not null))[1],
        (array_agg(failure_code order by received_at) filter (where failure_code is not null))[1],
        'desconhecido') as reason,
      coalesce((array_agg(card_country order by received_at) filter (where card_country is not null))[1], '??') as card_country
    from st
    where type in ('payment_intent.succeeded', 'payment_intent.payment_failed', 'charge.succeeded', 'charge.failed')
    group by k
  ),
  kp as (
    select event, payload->'data'->>'id' as order_id
    from public.{P}kashpay_events
    where received_at >= p_from and received_at < p_to
  )
  select jsonb_build_object(
    'chain', (select to_jsonb(n) - array['up1_acc','up1_dec','up1_paid','down1_view','down1_acc','down1_dec','down1_paid','up2_acc','up2_dec','up2_paid','down2_view','down2_acc','down2_dec','down2_paid','revenue','buyers'] from n),
    'branches', (select jsonb_build_object(
        'up1_acc', up1_acc, 'up1_dec', up1_dec, 'up1_paid', up1_paid,
        'down1_view', down1_view, 'down1_acc', down1_acc, 'down1_dec', down1_dec, 'down1_paid', down1_paid,
        'up2_acc', up2_acc, 'up2_dec', up2_dec, 'up2_paid', up2_paid,
        'down2_view', down2_view, 'down2_acc', down2_acc, 'down2_dec', down2_dec, 'down2_paid', down2_paid) from n),
    'revenue_cents', (select revenue from n),
    'buyers', (select buyers from n),
    'raw', (select to_jsonb(raw) from raw),
    'by_origin', coalesce((select jsonb_agg(to_jsonb(o) order by o.entrances desc, o.revenue desc) from (select * from origin order by entrances desc, revenue desc limit 30) o), '[]'::jsonb),
    'by_country', coalesce((select jsonb_agg(to_jsonb(c) order by c.entrances desc, c.revenue desc) from (select * from country order by entrances desc, revenue desc limit 30) c), '[]'::jsonb),
    'vsl', coalesce((select jsonb_agg(to_jsonb(v) order by v.page = 'front' desc, v.page) from vsl v), '[]'::jsonb),
    'quiz_steps', coalesce((select jsonb_agg(to_jsonb(q) order by q.step) from qs q), '[]'::jsonb),
    'stripe', jsonb_build_object(
      'payments', (select count(*) from sk),
      'approved', (select count(*) filter (where ok) from sk),
      'failed', (select count(*) filter (where failed and not ok) from sk),
      'recovered', (select count(*) filter (where failed and ok) from sk),
      'by_reason', coalesce((select jsonb_agg(jsonb_build_object('reason', reason, 'n', cnt) order by cnt desc) from (select reason, count(*) as cnt from sk where failed group by reason) r), '[]'::jsonb),
      'by_card_country', coalesce((select jsonb_agg(jsonb_build_object('country', card_country, 'n', cnt) order by cnt desc) from (select card_country, count(*) as cnt from sk where failed group by card_country) r), '[]'::jsonb),
      'by_reason_country', coalesce((select jsonb_agg(jsonb_build_object('reason', reason, 'country', card_country, 'n', cnt) order by cnt desc) from (select reason, card_country, count(*) as cnt from sk where failed group by reason, card_country) r), '[]'::jsonb),
      'invoices_paid', (select count(distinct invoice_id) from st where type = 'invoice.paid'),
      'invoices_failed', (select count(distinct invoice_id) from st where type = 'invoice.payment_failed'),
      'subs_created', (select count(distinct subscription_id) from st where type = 'customer.subscription.created'),
      'subs_deleted', (select count(distinct subscription_id) from st where type = 'customer.subscription.deleted')
    ),
    'kashpay', jsonb_build_object(
      'paid', (select count(distinct order_id) from kp where event = 'order.paid'),
      'failed', (select count(distinct order_id) from kp where event = 'order.failed'),
      'refunded', (select count(distinct order_id) from kp where event in ('order.refunded', 'order.chargeback')),
      'renewed', (select count(*) from kp where event = 'subscription.renewed'),
      'canceled', (select count(*) from kp where event = 'subscription.canceled')
    )
  );
$f$;

-- The KPI strip: today (from p_today, the start of the day in the owner's time zone),
-- the last 7 days and the last 30 days, all up to now.
create or replace function public.{P}funnel_kpis(p_today timestamptz)
returns jsonb language sql stable security definer set search_path = public as $f$
  with w(k, since) as (
    values ('today', p_today), ('d7', p_today - interval '6 days'), ('d30', p_today - interval '29 days')
  ),
  ev as (
    select fe.name, fe.props, fe.created_at,
      case when coalesce(fe.email, fv.email) is not null then 'e:' || lower(coalesce(fe.email, fv.email)) else 'v:' || fe.vid end as actor
    from public.{P}funnel_events fe
    left join public.{P}funnel_visitors fv on fv.vid = fe.vid
    where fe.created_at >= p_today - interval '29 days'
      and (fe.vid is not null or fe.email is not null)
      and fe.name in ('quiz_view', 'quiz_start', 'quiz_complete', 'checkout_click', 'purchase')
  ),
  st as (
    select type, coalesce(payment_intent, charge_id, invoice_id, object_id) as k, coalesce(event_created, received_at) as at
    from public.{P}stripe_events
    where coalesce(event_created, received_at) >= p_today - interval '29 days'
  )
  select jsonb_object_agg(w.k, jsonb_build_object(
    'entrances', (select count(distinct actor) from ev where created_at >= w.since and name in ('quiz_view', 'quiz_start')),
    'quiz_complete', (select count(distinct actor) from ev where created_at >= w.since and name = 'quiz_complete'),
    'checkout', (select count(distinct actor) from ev where created_at >= w.since and name = 'checkout_click'),
    'sales', (select count(*) from ev where created_at >= w.since and name = 'purchase'),
    'front_sales', (select count(*) from ev where created_at >= w.since and name = 'purchase' and props->>'offer' = 'front'),
    'revenue_cents', (select coalesce(sum(case when props->>'amount_cents' ~ '^[0-9]{1,12}$' then (props->>'amount_cents')::bigint end), 0)
                      from ev where created_at >= w.since and name = 'purchase'),
    'stripe_ok', (select count(distinct k) from st where at >= w.since and type in ('payment_intent.succeeded', 'charge.succeeded')),
    'stripe_failed', (select count(distinct k) from st where at >= w.since and type in ('payment_intent.payment_failed', 'charge.failed'))
  ))
  from w;
$f$;

revoke all on function public.{P}funnel_touch(text, jsonb, text, text) from public, anon, authenticated;
revoke all on function public.{P}funnel_link(text, text, text) from public, anon, authenticated;
revoke all on function public.{P}funnel_report(timestamptz, timestamptz, text, text) from public, anon, authenticated;
revoke all on function public.{P}funnel_kpis(timestamptz) from public, anon, authenticated;
grant execute on function public.{P}funnel_touch(text, jsonb, text, text) to service_role;
grant execute on function public.{P}funnel_link(text, text, text) to service_role;
grant execute on function public.{P}funnel_report(timestamptz, timestamptz, text, text) to service_role;
grant execute on function public.{P}funnel_kpis(timestamptz) to service_role;

$tpl$;
begin
  foreach p in array array['', 'pl_'] loop
    execute replace(tpl, '{P}', p);
  end loop;
end
$do$;

grant usage, select on all sequences in schema public to service_role;

notify pgrst, 'reload schema';
