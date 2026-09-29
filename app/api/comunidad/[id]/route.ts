import { db, t } from '@/lib/server/db'
import { isUuid, json, unavailable, viewer } from '@/lib/server/community'

// DELETE → removes one of the member's own posts or reflections (with its likes and
// comments). Nobody can remove someone else's post or the team's Palabra del día.

export const dynamic = 'force-dynamic'

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const email = await viewer()
  if (!email) return json({ error: 'no-session' }, 401)
  const { id } = await params
  if (!isUuid(id)) return json({ error: 'not-found' }, 404)
  try {
    const { data, error } = await db().from(t('community_posts')).delete().eq('id', id).eq('email', email).select('id')
    if (error) throw error
    return data?.length ? json({ ok: true }) : json({ error: 'not-found' }, 404)
  } catch (e) {
    return unavailable('delete post', e)
  }
}
