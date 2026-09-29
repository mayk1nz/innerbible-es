import { db, t } from '@/lib/server/db'
import { sessionEmail } from '@/lib/server/session'

// The member's progress, kept on the server so it follows them between devices.
//   GET → { data } (null when nothing was saved yet)
//   PUT → { data } — the device's state, already merged with the server's (lib/store.ts)
// Only the signed-in member's own document; the app does the merging.

export const dynamic = 'force-dynamic'

const MAX_BYTES = 400_000
const json = (body: unknown, status = 200) => Response.json(body, { status })

export async function GET() {
  const email = await sessionEmail()
  if (!email) return json({ error: 'no-session' }, 401)
  const { data, error } = await db().from(t('member_progress')).select('data').eq('email', email).maybeSingle()
  if (error) {
    console.error('progress: read failed', error.message)
    return json({ error: 'unavailable' }, 503)
  }
  return json({ data: data?.data ?? null })
}

export async function PUT(request: Request) {
  const email = await sessionEmail()
  if (!email) return json({ error: 'no-session' }, 401)
  const raw = await request.text()
  if (raw.length > MAX_BYTES) return json({ error: 'too-large' }, 413)
  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return json({ error: 'bad-json' }, 400)
  }
  const data = body && typeof body === 'object' && 'data' in body ? (body as { data: unknown }).data : null
  if (!data || typeof data !== 'object' || Array.isArray(data)) return json({ error: 'bad-data' }, 400)
  const { error } = await db()
    .from(t('member_progress'))
    .upsert({ email, data, updated_at: new Date().toISOString() }, { onConflict: 'email' })
  if (error) {
    console.error('progress: write failed', error.message)
    return json({ error: 'unavailable' }, 503)
  }
  return json({ ok: true })
}
