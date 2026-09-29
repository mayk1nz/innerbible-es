import { hasOffensiveWords } from '@/lib/profanity'
import { COMMUNITY_LIMITS } from '@/lib/config'
import { db, t } from '@/lib/server/db'
import {
  authorOf,
  canWrite,
  cleanText,
  isUuid,
  json,
  toComment,
  unavailable,
  viewer,
  writtenToday,
  type CommentRow,
} from '@/lib/server/community'

// The comments of a post.
//   GET            → { comments } (oldest first, up to 200)
//   POST { text }  → { comment }  (30 a day, 800 characters)

export const dynamic = 'force-dynamic'

type Ctx = { params: Promise<{ id: string }> }
const COLUMNS = 'id, email, author, text, created_at'

export async function GET(_request: Request, { params }: Ctx) {
  const email = await viewer()
  if (!email) return json({ error: 'no-session' }, 401)
  const { id } = await params
  if (!isUuid(id)) return json({ error: 'not-found' }, 404)
  try {
    const { data, error } = await db()
      .from(t('community_comments'))
      .select(COLUMNS)
      .eq('post_id', id)
      .eq('hidden', false)
      .order('created_at', { ascending: true })
      .limit(200)
    if (error) throw error
    return json({ comments: ((data ?? []) as CommentRow[]).map((r) => toComment(r, email)) })
  } catch (e) {
    return unavailable('comments', e)
  }
}

export async function POST(request: Request, { params }: Ctx) {
  const email = await viewer()
  if (!email) return json({ error: 'no-session' }, 401)
  const { id } = await params
  if (!isUuid(id)) return json({ error: 'not-found' }, 404)
  const body = (await request.json().catch(() => ({}))) as { text?: unknown }
  const text = cleanText(body.text)
  if (!text) return json({ error: 'empty' }, 400)
  if (text.length > COMMUNITY_LIMITS.commentChars) return json({ error: 'too-long' }, 400)
  if (hasOffensiveWords(text)) return json({ error: 'offensive' }, 400)
  try {
    if (!(await canWrite(email))) return json({ error: 'no-purchase' }, 403)
    const { data: post, error: postError } = await db().from(t('community_posts')).select('id').eq('id', id).eq('hidden', false).maybeSingle()
    if (postError) throw postError
    if (!post) return json({ error: 'not-found' }, 404)
    if ((await writtenToday('community_comments', email)) >= COMMUNITY_LIMITS.commentsPerDay) return json({ error: 'limit' }, 429)
    const author = await authorOf(email)
    const { data, error } = await db().from(t('community_comments')).insert({ post_id: id, email, author, text }).select(COLUMNS).single()
    if (error) throw error
    return json({ comment: toComment(data as CommentRow, email) }, 201)
  } catch (e) {
    return unavailable('create comment', e)
  }
}
