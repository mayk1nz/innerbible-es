import { hasOffensiveWords } from '@/lib/profanity'
import { COMMUNITY_LIMITS } from '@/lib/config'
import { db, t } from '@/lib/server/db'
import {
  POST_COLUMNS,
  authorOf,
  canWrite,
  cleanText,
  isLessonKey,
  json,
  unavailable,
  viewer,
  withCounts,
  type PostRow,
} from '@/lib/server/community'
import { realBoard } from '@/lib/server/ranking'

// "Lo que entendieron los hermanos" under each lesson.
//   GET ?lesson=<product>/<lesson>        → { items, seeds }: shared reflections + wall posts about it
//   PUT { lesson, text, shared }          → shared with text: the member's reflection is published
//                                           (one per lesson, updated in place); otherwise removed.

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const email = await viewer()
  if (!email) return json({ error: 'no-session' }, 401)
  const lesson = new URL(request.url).searchParams.get('lesson')
  if (!isLessonKey(lesson)) return json({ error: 'bad-lesson' }, 400)
  try {
    const [{ data, error }, board] = await Promise.all([
      db()
        .from(t('community_posts'))
        .select(POST_COLUMNS)
        .eq('lesson_key', lesson)
        .in('kind', ['reflection', 'post'])
        .eq('hidden', false)
        .order('created_at', { ascending: false })
        .limit(50),
      realBoard(),
    ])
    if (error) throw error
    return json({ items: await withCounts((data ?? []) as PostRow[], email), seeds: board.seeds })
  } catch (e) {
    return unavailable('lesson reflections', e)
  }
}

export async function PUT(request: Request) {
  const email = await viewer()
  if (!email) return json({ error: 'no-session' }, 401)
  const body = (await request.json().catch(() => ({}))) as { lesson?: unknown; text?: unknown; shared?: unknown }
  if (!isLessonKey(body.lesson)) return json({ error: 'bad-lesson' }, 400)
  const lesson = body.lesson
  const text = cleanText(body.text).slice(0, COMMUNITY_LIMITS.reflectionChars)
  const table = db().from(t('community_posts'))
  try {
    if (!text || body.shared !== true) {
      const { error } = await table.delete().eq('email', email).eq('kind', 'reflection').eq('lesson_key', lesson)
      if (error) throw error
      return json({ shared: false })
    }
    if (!(await canWrite(email))) return json({ error: 'no-purchase' }, 403)
    if (hasOffensiveWords(text)) return json({ error: 'offensive' }, 400)
    const author = await authorOf(email)
    const existing = await db().from(t('community_posts')).select('id').eq('email', email).eq('kind', 'reflection').eq('lesson_key', lesson).maybeSingle()
    if (existing.error) throw existing.error
    if (existing.data) {
      const { error } = await db().from(t('community_posts')).update({ text, author }).eq('id', existing.data.id)
      if (error) throw error
    } else {
      const { error } = await db().from(t('community_posts')).insert({ email, author, kind: 'reflection', text, lesson_key: lesson })
      // Saved at the same moment from another device: update that one instead.
      if (error?.code === '23505') {
        const retry = await db().from(t('community_posts')).update({ text, author }).eq('email', email).eq('kind', 'reflection').eq('lesson_key', lesson)
        if (retry.error) throw retry.error
      } else if (error) throw error
    }
    return json({ shared: true })
  } catch (e) {
    return unavailable('save reflection', e)
  }
}
