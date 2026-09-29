import { ownedOffers } from '@/lib/server/access'
import { contentTarget, readContent } from '@/lib/server/content'
import { sessionEmail } from '@/lib/server/session'

// GET /api/content/<kind>/<id…> → the text of a lesson, only for a member who owns the
// product it belongs to (the offer comes from lib/catalog.ts). Kinds: estudio/<lesson>,
// guias/<guia>/<lesson>, mapas/<id>, ninos/<id>, escucha/<audio>, planes/<plan>/<day>.
// The texts live in content-private/ (see lib/server/content.ts), never in the app's
// JavaScript, so a lesson can't be read without signing in and buying it.

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ kind: string; id: string[] }> }

const NO_STORE = { 'cache-control': 'private, no-store' }

export async function GET(_request: Request, { params }: Params) {
  const { kind, id } = await params
  try {
    const email = await sessionEmail()
    if (!email) return new Response('Unauthorized', { status: 401, headers: NO_STORE })
    const target = contentTarget(kind, id ?? [])
    if (!target) return new Response('Not found', { status: 404, headers: NO_STORE })
    const owned = await ownedOffers(email)
    if (!owned.some((o) => target.offers.has(o))) return new Response('Forbidden', { status: 403, headers: NO_STORE })
    const body = readContent(target)
    // Not written yet: the reader shows "en preparación".
    if (body === null) return new Response('Not found', { status: 404, headers: NO_STORE })
    return Response.json(body, { headers: { 'cache-control': 'private, max-age=3600' } })
  } catch {
    return new Response('Error', { status: 500, headers: NO_STORE })
  }
}
