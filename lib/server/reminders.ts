import 'server-only'
import type { OfferId } from '../catalog'
import { computeStats } from '../gamification'
import { continueTarget, lessonHref } from '../progress'
import type { AppState } from '../store'
import { db, t } from './db'
import type { Reminder } from './push'

// What each member receives, in their own time: a morning reminder (their step of the
// day), a night one (keep the streak, or share/rest once the step is done), streak
// milestones and, on Sunday night, the week in numbers. Built from the progress the app
// keeps on the server (member_progress) and the member's purchases.

export type Slot = 'morning' | 'night'

const MORNING = { from: 8, to: 10 }
const NIGHT = { from: 20, to: 21 }
const MILESTONES = [3, 7, 14, 21, 30, 50, 100, 200, 365]
const FALLBACK_TZ = 'America/Mexico_City'

/** The device's local day, hour and weekday. */
export function localNow(tz: string | null, now = new Date()): { day: string; hour: number; sunday: boolean } {
  let zone = tz || FALLBACK_TZ
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zone })
  } catch {
    zone = FALLBACK_TZ
  }
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23', weekday: 'short' })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  )
  return { day: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour), sunday: parts.weekday === 'Sun' }
}

/** Which reminder this hour is for, there (null: neither). */
export function slotAt(hour: number): Slot | null {
  if (hour >= MORNING.from && hour < MORNING.to) return 'morning'
  if (hour >= NIGHT.from && hour < NIGHT.to) return 'night'
  return null
}

export interface MemberContext {
  name: string
  owned: OfferId[]
  streak: number
  doneToday: boolean
  weekLessons: number
  weekPoints: number
  next: { title: string; href: string } | null
}

/** Everything the messages need about each member (one query per table for all of them). */
export async function memberContexts(emails: string[], todayOf: (email: string) => string): Promise<Map<string, MemberContext>> {
  const out = new Map<string, MemberContext>()
  if (!emails.length) return out
  const [progress, rights, members] = await Promise.all([
    db().from(t('member_progress')).select('email, data').in('email', emails),
    db().from(t('entitlements')).select('email, offer, status, current_period_end').in('email', emails),
    db().from(t('members')).select('email, name').in('email', emails),
  ])
  const now = Date.now()
  for (const email of emails) {
    const data = (progress.data?.find((r) => r.email === email)?.data ?? {}) as Partial<AppState>
    const owned = (rights.data ?? [])
      .filter((r) => r.email === email && ['active', 'past_due', 'canceled'].includes(r.status) && (!r.current_period_end || Date.parse(r.current_period_end) > now))
      .map((r) => r.offer as OfferId)
    const state = { completed: data.completed ?? {}, points: data.points ?? [], lastLesson: data.lastLesson ?? null, owned } as unknown as AppState
    const today = todayOf(email)
    const stats = computeStats(state, today)
    const target = continueTarget(state, today)
    const monday = weekStartOf(today)
    const weekLessons = Object.values(state.completed).filter((c) => c.day >= monday).length
    const full = (members.data?.find((m) => m.email === email)?.name ?? '').trim()
    out.set(email, {
      name: full.split(/\s+/)[0] ?? '',
      owned,
      streak: stats.streak,
      doneToday: stats.doneToday,
      weekLessons,
      weekPoints: stats.weekPoints,
      next: target ? { title: target.lesson.subtitle ? `${target.lesson.title}: ${target.lesson.subtitle}` : target.lesson.title, href: lessonHref(target.product.id, target.lesson.id) } : null,
    })
  }
  return out
}

function weekStartOf(day: string): string {
  const d = new Date(`${day}T12:00:00Z`)
  const back = (d.getUTCDay() + 6) % 7
  d.setUTCDate(d.getUTCDate() - back)
  return d.toISOString().slice(0, 10)
}

/** A different message each day, the same for the whole day. */
function pick<T>(list: T[], day: string, salt = 0): T {
  const n = Number(day.replaceAll('-', '')) + salt
  return list[n % list.length]
}

const hi = (c: MemberContext) => (c.name ? `, ${c.name}` : '')

export function morningMessage(c: MemberContext, day: string): Reminder {
  const next = c.next?.title
  const url = c.next?.href ?? '/inicio'
  if (c.streak >= 2) {
    return pick(
      [
        { title: `🔥 ${c.streak} días seguidos`, body: next ? `Hoy te toca: ${next}. Unos minutos y sigues creciendo.` : 'Unos minutos con la Palabra y sigues creciendo.', url },
        { title: `Buenos días${hi(c)} ☀️`, body: `Llevas ${c.streak} días con la Palabra. ${next ? `Hoy: ${next}.` : 'Tu paso de hoy te espera.'}`, url },
      ],
      day,
    )
  }
  return pick(
    [
      { title: `Buenos días${hi(c)} ☀️`, body: next ? `Tu paso de hoy: ${next}. Empieza el día en paz.` : 'Unos minutos con la Palabra para empezar el día en paz.', url },
      { title: 'La Palabra para hoy 📖', body: `«Lámpara es a mis pies tu palabra». ${next ? `Hoy: ${next}.` : 'Tu lectura te espera.'}`, url },
      { title: 'Un momento con Dios', body: next ? `Antes de que empiece el día: ${next}.` : 'Antes de que empiece el día, cinco minutos con la Palabra.', url },
      ...(c.owned.includes('upsell1')
        ? [{ title: '¿Vas en camino? 🎧', body: 'Escucha tu audio de hoy mientras te preparas o vas al trabajo.', url: '/modulo/cronologico-audio' }]
        : []),
    ],
    day,
  )
}

export function nightMessage(c: MemberContext, day: string, sunday: boolean, milestone: number | null): Reminder {
  if (milestone) {
    return {
      title: `🎉 ¡${milestone} días seguidos!`,
      body: milestone >= 30 ? 'Qué constancia tan hermosa. La Palabra ya es parte de tu vida.' : 'Estás creando un hábito que transforma. ¡Sigue así!',
      url: '/perfil',
    }
  }
  if (sunday && c.weekLessons > 0) {
    return {
      title: 'Tu semana con la Palabra ✨',
      body: `Esta semana completaste ${c.weekLessons} ${c.weekLessons === 1 ? 'lección' : 'lecciones'} y sumaste ${c.weekPoints} puntos. ¡Vamos por otra semana!`,
      url: '/comunidad',
    }
  }
  const next = c.next?.title
  const url = c.next?.href ?? '/inicio'
  if (!c.doneToday) {
    if (c.streak >= 1) {
      return { title: `Tu racha de ${c.streak} ${c.streak === 1 ? 'día' : 'días'} te espera 🔥`, body: next ? `Aún estás a tiempo: ${next}. Cinco minutos y la mantienes.` : 'Aún estás a tiempo: cinco minutos y la mantienes.', url }
    }
    return pick(
      [
        { title: 'Antes de dormir 🌙', body: next ? `Cinco minutos con la Palabra: ${next}.` : 'Cinco minutos con la Palabra antes de dormir.', url },
        ...(c.owned.includes('upsell1')
          ? [{ title: 'Escucha antes de dormir 🌙', body: 'Pon un audio con el Modo descanso: se apaga solo cuando te duermas.', url: '/modulo/cronologico-audio' }]
          : []),
        { title: 'Termina el día con Dios', body: next ? `Hoy todavía puedes dar tu paso: ${next}.` : 'Hoy todavía puedes dar tu paso.', url },
      ],
      day,
      1,
    )
  }
  return pick(
    [
      { title: '¿Qué te habló hoy? 💬', body: 'Comparte tu reflexión con los hermanos en la Comunidad.', url: '/comunidad' },
      { title: `Bien hecho hoy${hi(c)} 🙏`, body: 'Completaste tu paso. Descansa en la paz de Dios.', url: '/inicio' },
      ...(c.owned.includes('upsell2')
        ? [{ title: '¿Algo en el corazón? 💛', body: 'Tu Consejero Bíblico te escucha a cualquier hora.', url: '/consejero' }]
        : []),
      { title: 'Mañana sigue la historia 📖', body: next ? `Lo que viene: ${next}. Te espero mañana.` : 'Mañana sigue la historia. Te espero.', url: '/inicio' },
    ],
    day,
    2,
  )
}

/** The milestone reached now, if any and not celebrated yet. */
export function milestoneFor(streak: number, celebrated: number): number | null {
  const reached = MILESTONES.filter((m) => m <= streak && m > celebrated)
  return reached.length ? reached[reached.length - 1] : null
}
