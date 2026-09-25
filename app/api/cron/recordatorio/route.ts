import { sendDailyReminders, type Reminder } from '@/lib/server/push'

// The daily reminder, run by Vercel Cron (vercel.json) once a day. Each device gets at
// most one reminder per day (last_sent_day), so calling this again does nothing more.
// With CRON_SECRET set on Vercel, only Vercel's own call is accepted.

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const MESSAGES: Omit<Reminder, 'url'>[] = [
  { title: 'Tu paso de hoy te espera 📖', body: 'Unos minutos con la Palabra para empezar el día en paz.' },
  { title: 'Un momento con Dios', body: 'Tu lectura de hoy está lista. ¿La hacemos juntos?' },
  { title: 'Sigue tu camino 🙏', body: 'Un paso cada día: hoy también cuenta para tu racha.' },
  { title: 'La Palabra para hoy', body: '«Lámpara es a mis pies tu palabra». Tu lectura te espera.' },
]

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }
  // Same message for everyone on a given day, changing through the week.
  const message = MESSAGES[Math.floor(Date.now() / 86_400_000) % MESSAGES.length]
  const result = await sendDailyReminders(() => ({ ...message, url: '/inicio' }))
  return Response.json({ ok: true, ...result })
}
