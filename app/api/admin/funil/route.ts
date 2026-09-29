import type { RangeKey } from '@/lib/admin/funnel-types'
import { isAdminEmail } from '@/lib/config'
import { loadFunnel } from '@/lib/server/funnel-admin'
import { sessionEmail } from '@/lib/server/session'

// Data of /admin/funil. Admins only (ADMIN_EMAILS, signed in); anyone else gets a 404,
// as if it did not exist. Errors never carry the database's message.

export const dynamic = 'force-dynamic'

const RANGES: RangeKey[] = ['today', '7d', '30d']

function clean(v: string | null): string | null {
  const x = (v ?? '').trim().slice(0, 150)
  return x && x !== 'all' ? x : null
}

export async function GET(request: Request) {
  let email: string | null = null
  try {
    email = await sessionEmail()
  } catch {
    email = null
  }
  if (!isAdminEmail(email)) return new Response('Not Found', { status: 404 })

  const params = new URL(request.url).searchParams
  const range = RANGES.find((r) => r === params.get('range')) ?? '7d'
  try {
    const data = await loadFunnel(range, clean(params.get('source')), clean(params.get('campaign')))
    return Response.json(data, { headers: { 'cache-control': 'no-store' } })
  } catch (e) {
    console.error('admin/funil: load failed', (e as { code?: string })?.code ?? (e instanceof Error ? e.name : 'unknown'))
    return Response.json({ error: 'unavailable' }, { status: 500 })
  }
}
