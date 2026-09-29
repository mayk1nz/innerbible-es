import { LIMITS, SID_RE, UUID_RE, VID_RE, cleanAttribution, cleanProps, cleanValue, isClientEvent } from '@/lib/analytics/events'
import { db, t } from '@/lib/server/db'
import { countryOf, deviceOf, ipKey, linkVisitor, rateLimited, touchVisitor } from '@/lib/server/funnel'
import { sessionEmail } from '@/lib/server/session'

// First-party funnel events (lib/analytics/track.ts → navigator.sendBeacon), in batches.
// Closed list of names, size and rate limits, no raw IP kept. Always answers 204:
// telemetry never surfaces an error (or a database message) to the page.

export const dynamic = 'force-dynamic'

/** How far back a queued event may be dated (a tab that slept, a slow beacon). */
const MAX_AGE_MS = 30 * 60 * 1000

function noContent(): Response {
  return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } })
}

export async function POST(request: Request) {
  try {
    const declared = Number(request.headers.get('content-length') ?? '0')
    if (declared > LIMITS.bodyBytes) return noContent()
    const raw = await request.text()
    if (!raw || raw.length > LIMITS.bodyBytes) return noContent()

    let body: Record<string, unknown>
    try {
      const parsed: unknown = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return noContent()
      body = parsed as Record<string, unknown>
    } catch {
      return noContent()
    }

    const vid = typeof body.vid === 'string' && VID_RE.test(body.vid) ? body.vid : null
    if (!vid || !Array.isArray(body.e) || body.e.length === 0) return noContent()
    const list = body.e.slice(0, LIMITS.events)
    if (rateLimited(ipKey(request.headers), list.length)) return noContent()

    const sid = typeof body.sid === 'string' && SID_RE.test(body.sid) ? body.sid : null
    const attr = cleanAttribution(body.a)
    const country = countryOf(request.headers)
    const device = deviceOf(request.headers.get('user-agent'))
    const sentAt = typeof body.s === 'number' && Number.isFinite(body.s) ? body.s : null
    const now = Date.now()

    let email: string | null = null
    try {
      email = await sessionEmail()
    } catch {
      email = null
    }

    const rows = []
    for (const item of list) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) continue
      const e = item as Record<string, unknown>
      if (!isClientEvent(e.n)) continue
      const props = cleanProps(e.p)
      if (props === null) continue
      // Dated by the server clock, minus how long the event waited in the queue.
      const waited = sentAt !== null && typeof e.t === 'number' && Number.isFinite(e.t) ? Math.min(Math.max(sentAt - e.t, 0), MAX_AGE_MS) : 0
      const path = cleanValue(e.path, 200)
      rows.push({
        event_id: typeof e.id === 'string' && UUID_RE.test(e.id) ? e.id.toLowerCase() : crypto.randomUUID(),
        vid,
        sid,
        name: e.n,
        props,
        path: path && path.startsWith('/') ? path : null,
        email,
        country,
        device,
        utm_source: attr.utm_source ?? null,
        utm_campaign: attr.utm_campaign ?? null,
        created_at: new Date(now - waited).toISOString(),
      })
    }
    if (!rows.length) return noContent()

    await touchVisitor(vid, attr, country, device)
    if (email) await linkVisitor(vid, email, 'session')

    const { error } = await db().from(t('funnel_events')).upsert(rows, { onConflict: 'event_id', ignoreDuplicates: true })
    if (error) console.error('[events] insert failed', error.code ?? '')
  } catch (err) {
    console.error('[events] failed', err instanceof Error ? err.name : 'unknown')
  }
  return noContent()
}
