import { db, t } from '@/lib/server/db'
import { canWrite, isUuid, json, unavailable, viewer } from '@/lib/server/community'

// The "amén" (like) of a post.
//   PUT    → the member says amén   → { likes, liked: true }
//   DELETE → takes it back           → { likes, liked: false }

export const dynamic = 'force-dynamic'

type Ctx = { params: Promise<{ id: string }> }

async function setLike(id: string, liked: boolean): Promise<Response> {
  const email = await viewer()
  if (!email) return json({ error: 'no-session' }, 401)
  if (!isUuid(id)) return json({ error: 'not-found' }, 404)
  try {
    if (!(await canWrite(email))) return json({ error: 'no-purchase' }, 403)
    const { data: post, error: postError } = await db().from(t('community_posts')).select('id').eq('id', id).eq('hidden', false).maybeSingle()
    if (postError) throw postError
    if (!post) return json({ error: 'not-found' }, 404)
    const { error } = liked
      ? await db().from(t('community_likes')).upsert({ post_id: id, email }, { onConflict: 'post_id,email', ignoreDuplicates: true })
      : await db().from(t('community_likes')).delete().eq('post_id', id).eq('email', email)
    if (error) throw error
    const { count, error: countError } = await db().from(t('community_likes')).select('post_id', { count: 'exact', head: true }).eq('post_id', id)
    if (countError) throw countError
    return json({ likes: count ?? 0, liked })
  } catch (e) {
    return unavailable('like', e)
  }
}

export async function PUT(_request: Request, { params }: Ctx) {
  return setLike((await params).id, true)
}

export async function DELETE(_request: Request, { params }: Ctx) {
  return setLike((await params).id, false)
}
