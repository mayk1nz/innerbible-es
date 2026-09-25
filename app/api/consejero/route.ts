import { hasFullAccess } from '@/lib/config'
import { searchLibrary } from '@/lib/consejero/knowledge'
import { APP_MAP } from '@/lib/consejero/map'
import { CRISIS_NOTE, SYSTEM_PROMPT, contextMessage, looksLikeCrisis } from '@/lib/consejero/prompt'

// Tu Consejero Bíblico: one answer, streamed as it is written.
//
// ACCESS — TEMPORARY: until the backend exists (Supabase + KashPay webhook), only the
// owner's account can use it, so nobody else can spend the DeepSeek key. With the
// backend this checks the member's upsell-2 subscription, the 30-per-day limit and
// the free daily question for everyone else.

export const dynamic = 'force-dynamic'

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions'
const MAX_HISTORY = 8
const MAX_CHARS = 1500

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

function badRequest(error: string, status = 400) {
  return Response.json({ error }, { status })
}

function parseMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 40) return null
  const out: ChatMessage[] = []
  for (const m of raw) {
    if (typeof m !== 'object' || m === null) return null
    const { role, content } = m as Record<string, unknown>
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string' || !content.trim()) return null
    out.push({ role, content: content.trim().slice(0, MAX_CHARS) })
  }
  return out.at(-1)?.role === 'user' ? out : null
}

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return badRequest('invalid-json')
  }
  const email = typeof body.email === 'string' ? body.email : ''
  const messages = parseMessages(body.messages)
  if (!messages) return badRequest('invalid-messages')
  if (!hasFullAccess(email)) return badRequest('locked', 403)

  const last = messages[messages.length - 1]
  const crisis = looksLikeCrisis(last.content)
  // Search with the last two things the member said, so a short follow-up ("¿y qué hago?")
  // still finds the right passages.
  const previousUser = messages.slice(0, -1).reverse().find((m) => m.role === 'user')?.content ?? ''
  const passages = searchLibrary(`${last.content} ${previousUser}`, 3)

  const history = messages.slice(-MAX_HISTORY - 1, -1)
  const payload = [
    // Instructions + the map of the app first and always identical (cached by DeepSeek).
    { role: 'system', content: `${SYSTEM_PROMPT}\n\nMAPA DE LA APP (todo lo que la persona puede hacer en los planes de Palabras del Señor):\n${APP_MAP}` },
    ...history,
    {
      role: 'user',
      content: `${contextMessage(passages)}\n\n${crisis ? `${CRISIS_NOTE}\n\n` : ''}---\nMensaje de la persona:\n${last.content}`,
    },
  ]

  const headers = new Headers({ 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' })
  if (crisis) headers.set('x-crisis', '1')

  // Local development without a key: a fixed answer, to try the screen.
  const key = process.env.DEEPSEEK_API_KEY
  if (!key) {
    if (process.env.NODE_ENV !== 'production' && process.env.CONSEJERO_MOCK === '1') {
      return new Response(mockStream(passages.map((p) => p.source)), { headers })
    }
    return badRequest('not-configured', 503)
  }

  const upstream = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: 'deepseek-chat', messages: payload, stream: true, temperature: 0.7, max_tokens: 700 }),
  }).catch(() => null)
  if (!upstream || !upstream.ok || !upstream.body) return badRequest('upstream', 502)

  return new Response(sseToText(upstream.body), { headers })
}

/** DeepSeek's server-sent events → just the text of the answer. */
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
            // a partial or keep-alive line
          }
        }
      },
    }),
  )
}

function mockStream(sources: string[]): ReadableStream<Uint8Array> {
  const text = `Gracias por abrir tu corazón. Lo que sientes importa, y no tienes que cargarlo en soledad.\n\n«Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros» — 1 Pedro 5:7.\n\nHoy puedes dar un paso pequeño: escribe en una hoja lo que más te pesa y entrégaselo a Dios en una oración corta.${
    sources[0] ? `\n\nTe puede ayudar: **${sources[0]}**.` : ''
  }\n\nSeñor, pongo en tus manos lo que hoy me quita la paz. Amén.`
  const encoder = new TextEncoder()
  const words = text.split(/(?<=\s)/)
  let i = 0
  return new ReadableStream({
    async pull(controller) {
      if (i >= words.length) return controller.close()
      await new Promise((r) => setTimeout(r, 25))
      controller.enqueue(encoder.encode(words[i++]))
    },
  })
}
