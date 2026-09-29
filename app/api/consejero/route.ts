import { searchLibrary } from '@/lib/consejero/knowledge'
import { APP_MAP } from '@/lib/consejero/map'
import { CRISIS_NOTE, SYSTEM_PROMPT, contextMessage, looksLikeCrisis } from '@/lib/consejero/prompt'
import { clearMessages, consejeroStatus, countMessage, listConversations, recentMessages, saveMessage } from '@/lib/server/consejero'
import { sessionEmail } from '@/lib/server/session'

// Tu Consejero Bíblico.
//   GET    ?c=<id> → today's status (member?, limit, used, offer start), the member's
//                    conversations and the messages of one (the given one, else the latest)
//   POST   → { message, conversationId? } — one answer, streamed as it is written; no id
//            starts a new conversation (its id comes back in the x-conversation header)
//   DELETE ?c=<id> → erase that conversation (without ?c: all of them)
// The signed-in member comes from the session cookie; the conversations live in the
// database (consejero_messages), visible only through these routes.

export const dynamic = 'force-dynamic'

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions'
const HISTORY_FOR_MODEL = 8
const HISTORY_FOR_SCREEN = 60
const MAX_CHARS = 1500
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const json = (body: unknown, status = 200) => Response.json(body, { status })
const conversationParam = (request: Request) => {
  const c = new URL(request.url).searchParams.get('c')
  return c && UUID.test(c) ? c : null
}

export async function GET(request: Request) {
  const email = await sessionEmail()
  if (!email) return json({ error: 'no-session' }, 401)
  const [status, conversations] = await Promise.all([consejeroStatus(email), listConversations(email)])
  const asked = conversationParam(request)
  const conversationId = asked && conversations.some((c) => c.id === asked) ? asked : (conversations[0]?.id ?? null)
  const messages = conversationId ? await recentMessages(email, conversationId, HISTORY_FOR_SCREEN) : []
  return json({ ...status, conversations, conversationId, messages })
}

export async function DELETE(request: Request) {
  const email = await sessionEmail()
  if (!email) return json({ error: 'no-session' }, 401)
  await clearMessages(email, conversationParam(request) ?? undefined)
  return json({ ok: true })
}

export async function POST(request: Request) {
  const email = await sessionEmail()
  if (!email) return json({ error: 'no-session' }, 401)
  const body = (await request.json().catch(() => ({}))) as { message?: unknown; conversationId?: unknown }
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, MAX_CHARS) : ''
  if (!message) return json({ error: 'empty' }, 400)
  const conversationId = typeof body.conversationId === 'string' && UUID.test(body.conversationId) ? body.conversationId : crypto.randomUUID()

  const status = await consejeroStatus(email)
  if (status.used >= status.limit) return json({ error: status.member ? 'limit' : 'free-used', ...status }, 429)

  const key = process.env.DEEPSEEK_API_KEY
  if (!key) return json({ error: 'not-configured' }, 503)

  const crisis = looksLikeCrisis(message)
  // The model remembers only this conversation.
  const history = (await recentMessages(email, conversationId, HISTORY_FOR_MODEL)).map(({ role, content }) => ({ role, content }))
  const previousUser = [...history].reverse().find((m) => m.role === 'user')?.content ?? ''
  const passages = searchLibrary(`${message} ${previousUser}`, 3)

  const payload = [
    // Instructions + the map of the app first and always identical (cached by DeepSeek).
    { role: 'system', content: `${SYSTEM_PROMPT}\n\nMAPA DE LA APP (todo lo que la persona puede hacer en los planes de Palabras del Señor):\n${APP_MAP}` },
    ...history,
    {
      role: 'user',
      content: `${contextMessage(passages)}\n\n${crisis ? `${CRISIS_NOTE}\n\n` : ''}---\nMensaje de la persona:\n${message}`,
    },
  ]

  const upstream = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: 'deepseek-chat', messages: payload, stream: true, temperature: 0.7, max_tokens: 900 }),
  }).catch(() => null)
  if (!upstream || !upstream.ok || !upstream.body) return json({ error: 'upstream' }, 502)

  // Counted and saved only once DeepSeek has accepted the question.
  await Promise.all([countMessage(email), saveMessage(email, conversationId, 'user', message, crisis)])

  const headers = new Headers({ 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store', 'x-conversation': conversationId })
  if (crisis) headers.set('x-crisis', '1')
  return new Response(
    sseToText(upstream.body, async (answer) => {
      if (answer.trim()) await saveMessage(email, conversationId, 'assistant', answer, crisis)
    }),
    { headers },
  )
}

/** DeepSeek's server-sent events → just the text of the answer; `done` gets the full text. */
function sseToText(body: ReadableStream<Uint8Array>, done: (answer: string) => Promise<void>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let buffer = ''
  let answer = ''
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
            if (delta) {
              answer += delta
              controller.enqueue(encoder.encode(delta))
            }
          } catch {
            // a partial or keep-alive line
          }
        }
      },
      async flush() {
        await done(answer).catch(() => {})
      },
    }),
  )
}
