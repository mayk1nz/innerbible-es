// Recent KashPay events and access, straight from the database.
//   node scripts/db-inspect.mjs              events + entitlements
//   node scripts/db-inspect.mjs --payload    also the raw payload/headers of the last 3 events
//   node scripts/db-inspect.mjs --clean-test removes rows of @example.com test e-mails
//                                            (and the funnel/Stripe test rows, see below)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
// Table prefix of this site (Spanish '' / Polish 'pl_'), as in lib/config.ts.
const P = fs.readFileSync(path.join(ROOT, 'lib', 'config.ts'), 'utf8').match(/dbPrefix:\s*'([^']*)'/)[1]
const env = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8')
const client = new pg.Client({ connectionString: env.match(/^SUPABASE_DB_URL=(.*)$/m)[1].trim(), ssl: { rejectUnauthorized: false } })
await client.connect()
const ev = await client.query(`select id, received_at, event, email, product, signature_ok, note from public.${P}kashpay_events order by id desc limit 15`)
console.log('EVENTOS')
for (const r of ev.rows) console.log(`  #${r.id} ${r.received_at.toISOString().slice(5, 16)} ${r.event} ${r.email} | ${r.product} | sig=${r.signature_ok} | ${r.note}`)
const en = await client.query(`select email, offer, status, current_period_end, source from public.${P}entitlements order by updated_at desc limit 15`)
console.log('ACESSOS')
for (const r of en.rows) console.log(`  ${r.email} ${r.offer} ${r.status} até ${r.current_period_end?.toISOString().slice(0, 10) ?? 'sem fim'} (${r.source})`)
if (process.argv.includes('--payload')) {
  const r = await client.query(`select id, headers, payload from public.${P}kashpay_events order by id desc limit 3`)
  for (const row of r.rows) console.log(JSON.stringify(row, null, 2))
}
if (process.argv.includes('--clean-test')) {
  const tables = ['kashpay_events', 'entitlements', 'members', 'consejero_messages', 'consejero_usage', 'member_progress', 'estudio_usage',
    'community_likes', 'community_comments', 'community_posts', 'ranking_snapshots', 'push_subscriptions']
  for (const t of tables) {
    const r = await client.query(`delete from public.${P}${t} where email like '%@example.com'`)
    console.log(`limpo ${t}: ${r.rowCount}`)
  }
  // Funnel telemetry: test visitors are the @example.com e-mails, the ids starting with
  // "vtest" (E2E) and the visits with utm_source e2e-test*; plus their events and the
  // Stripe events/alerts of those e-mails or with test ids (evt_test_* / pi_test_*).
  const testVids = `select vid from public.${P}funnel_visitors where vid like 'vtest%' or email like '%@example.com' or utm_source like 'e2e-test%'`
  const fe = await client.query(`delete from public.${P}funnel_events where vid like 'vtest%' or email like '%@example.com' or utm_source like 'e2e-test%' or vid in (${testVids})`)
  console.log(`limpo funnel_events: ${fe.rowCount}`)
  const fv = await client.query(`delete from public.${P}funnel_visitors where vid in (${testVids})`)
  console.log(`limpo funnel_visitors: ${fv.rowCount}`)
  const sa = await client.query(`delete from public.${P}stripe_alerts where key like 'pi_test_%' or key like 'ch_test_%' or stripe_event_id like 'evt_test_%' or stripe_event_id in (select stripe_event_id from public.${P}stripe_events where email like '%@example.com')`)
  console.log(`limpo stripe_alerts: ${sa.rowCount}`)
  const se = await client.query(`delete from public.${P}stripe_events where email like '%@example.com' or stripe_event_id like 'evt_test_%' or payment_intent like 'pi_test_%'`)
  console.log(`limpo stripe_events: ${se.rowCount}`)
}
await client.end()
