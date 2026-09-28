import { parseRef, type Ref } from '@/lib/estudio-ref'
import type { Estudio } from '@/lib/estudio-types'
import { anchorsPrompt, explainPrompt, guidePrompt } from '@/lib/estudio/prompt'
import { normalize } from '@/lib/text'
import { ownedOffers } from '@/lib/server/access'
import { db, t } from '@/lib/server/db'
import { chainForRef, chainForRefs, validRef, type ChainLink } from '@/lib/server/estudio'
import { sessionEmail } from '@/lib/server/session'

// Tu Guía de Estudio (regalo 8 of the Estudio Cronológico).
//   GET  ?q=Génesis 22 | la fe | Abraham → the chain of connected passages, in the order
//        of the story, each with a short explanation. Cached for everyone.
//   POST { pregunta, estudio? } → the guide answers a question, streamed.

export const dynamic = 'force-dynamic'

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions'
const DAILY_LIMIT = 40
const CACHE_VERSION = 'v1'

const json = (body: unknown, status = 200) => Response.json(body, { status })

const today = () => new Date().toISOString().slice(0, 10)

async function member(): Promise<string | Response> {
  const email = await sessionEmail()
  if (!email) return json({ error: 'no-session' }, 401)
  const owned = await ownedOffers(email).catch((): string[] => [])
  if (!owned.includes('front')) return json({ error: 'no-access' }, 403)
  return email
}

async function underLimit(email: string): Promise<boolean> {
  const { data } = await db().from(t('estudio_usage')).select('count').eq('email', email).eq('day', today()).maybeSingle()
  return (data?.count ?? 0) < DAILY_LIMIT
}

async function deepseekJson<T>(prompt: string, maxTokens: number): Promise<T | null> {
  const key = process.env.DEEPSEEK_API_KEY
  if (!key) return null
  const res = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: maxTokens,
    }),
  }).catch(() => null)
  if (!res?.ok) return null
  const body = (await res.json().catch(() => null)) as { choices?: { message?: { content?: string } }[] } | null
  try {
    return JSON.parse(body?.choices?.[0]?.message?.content ?? '') as T
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  const who = await member()
  if (who instanceof Response) return who
  const q = (new URL(request.url).searchParams.get('q') ?? '').trim().slice(0, 120)
  if (q.length < 2) return json({ error: 'empty' }, 400)

  const ref = parseRef(q)
  const key = `${CACHE_VERSION}:${ref ? `ref:${ref.book.id}.${ref.chapter}.${ref.from ?? ''}-${ref.to ?? ''}` : `tema:${normalize(q).replace(/[^a-z0-9ñ ]/g, '').replace(/\s+/g, ' ')}`}`
  const cached = await db().from(t('estudio_cache')).select('payload').eq('key', key).maybeSingle()
  if (cached.data?.payload) return json(cached.data.payload)

  if (!(await underLimit(who))) return json({ error: 'limit', limit: DAILY_LIMIT }, 429)

  let titulo = ''
  let links: ChainLink[]
  if (ref) {
    links = chainForRef(ref)
  } else {
    const anchors = await deepseekJson<{ titulo?: string; pasajes?: string[] }>(anchorsPrompt(q), 400)
    const refs = (anchors?.pasajes ?? []).map((p) => parseRef(p)).filter((r): r is Ref => Boolean(r) && validRef(r as Ref))
    if (!refs.length) return json({ error: anchors ? 'no-results' : 'upstream' }, anchors ? 404 : 502)
    titulo = anchors?.titulo ?? ''
    links = chainForRefs(refs)
  }
  if (!links.length) return json({ error: 'no-results' }, 404)

  await db().rpc(t('estudio_count'), { p_email: who, p_day: today() })

  const explained = await deepseekJson<{ titulo?: string; intro?: string; links?: { i: number; porque?: string }[] }>(
    explainPrompt(q, links.map((l, i) => ({ i, ref: l.ref, text: l.text.slice(0, 400), origin: l.origin }))),
    2200,
  )
  const porque = new Map((explained?.links ?? []).map((l) => [l.i, l.porque]))
  const estudio: Estudio = {
    q,
    titulo: explained?.titulo || titulo || q,
    intro: explained?.intro ?? '',
    kind: ref ? 'ref' : 'tema',
    links: links.map((l, i) => ({ ...l, porque: porque.get(i) })),
  }
  // Only complete studies are kept, so a failed explanation is retried next time.
  if (explained) await db().from(t('estudio_cache')).upsert({ key, payload: estudio }, { onConflict: 'key' })
  return json(estudio)
}

export async function POST(request: Request) {
  const who = await member()
  if (who instanceof Response) return who
  const body = (await request.json().catch(() => ({}))) as { pregunta?: unknown; estudio?: unknown }
  const pregunta = typeof body.pregunta === 'string' ? body.pregunta.trim().slice(0, 800) : ''
  if (!pregunta) return json({ error: 'empty' }, 400)
  const context = typeof body.estudio === 'string' ? body.estudio.slice(0, 1500) : ''
  if (!(await underLimit(who))) return json({ error: 'limit', limit: DAILY_LIMIT }, 429)
  const key = process.env.DEEPSEEK_API_KEY
  if (!key) return json({ error: 'not-configured' }, 503)

  const upstream = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: guidePrompt() },
        { role: 'user', content: `${context ? `Estoy estudiando esta cadena:\n${context}\n\n` : ''}Mi pregunta: ${pregunta}` },
      ],
      stream: true,
      temperature: 0.6,
      max_tokens: 700,
    }),
  }).catch(() => null)
  if (!upstream?.ok || !upstream.body) return json({ error: 'upstream' }, 502)
  await db().rpc(t('estudio_count'), { p_email: who, p_day: today() })
  return new Response(sseToText(upstream.body), { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } })
}

function sseToText(body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let buffer = ''
  return body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          const data = line.startsWith('data:') ? line.slice(5).trim() : ''
          if (!data || data === '[DONE]') continue
          try {
            const delta = (JSON.parse(data) as { choices?: { delta?: { content?: string } }[] }).choices?.[0]?.delta?.content
            if (delta) controller.enqueue(encoder.encode(delta))
          } catch {
            // partial or keep-alive line
          }
        }
      },
    }),
  )
}
