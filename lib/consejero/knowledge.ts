import 'server-only'
import { PRODUCTS, type LessonContent } from '../catalog'
import { DAYS as NUEVA_MENTALIDAD } from '../content/plans/nueva-mentalidad'
import { PLAN_TITLES, type PlanId } from '../content/plans/titles'
import { DAYS as TRANSFORMACION } from '../content/plans/transformacion'
import { DAYS as VIVIR_COMO_JESUS } from '../content/plans/vivir-como-jesus'

// The Consejero's library: everything the app teaches, searched on our own server
// (no outside lookup). For each question only the few most relevant passages are sent
// to the model, so each answer costs a fraction of a cent however large the library
// grows. Search = BM25 over Spanish words (accents and simple plurals folded).

export interface Passage {
  /** Where it comes from, as the member sees it: "Nueva mentalidad · Día 41: …". */
  source: string
  /** Link inside the app. */
  href: string
  text: string
}

const PLAN_NAMES: Record<PlanId, string> = {
  transformacion: 'Transformación Espiritual',
  'vivir-como-jesus': 'Vivir como Jesús',
  'nueva-mentalidad': 'Nueva mentalidad',
}
const PLAN_DAYS: Record<PlanId, LessonContent[]> = {
  transformacion: TRANSFORMACION,
  'vivir-como-jesus': VIVIR_COMO_JESUS,
  'nueva-mentalidad': NUEVA_MENTALIDAD,
}

function contentText(c: LessonContent): string {
  return [
    c.versiculo ? `${c.versiculo.referencia}: «${c.versiculo.texto}»` : '',
    ...(c.resumen ?? []),
    c.tarea ? `Minitarea: ${c.tarea}` : '',
    c.practica?.length ? `Para practicar: ${c.practica.join(' ')}` : '',
    c.meditar ? `Para meditar: ${c.meditar}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

function buildLibrary(): Passage[] {
  const out: Passage[] = []
  for (const plan of Object.keys(PLAN_DAYS) as PlanId[]) {
    PLAN_DAYS[plan].forEach((c, i) => {
      out.push({
        source: `Palabras del Señor · ${PLAN_NAMES[plan]} · Día ${i + 1}: ${PLAN_TITLES[plan][i] ?? ''}`,
        href: `/leccion/hacedores/${plan}-dia-${i + 1}`,
        text: contentText(c),
      })
    })
  }
  // Lessons written inline in the catalog (the chronological summaries as they arrive).
  for (const p of PRODUCTS) {
    for (const s of p.sections) {
      for (const l of s.lessons) {
        if (l.content) out.push({ source: `${p.title} · ${l.title}`, href: `/leccion/${p.id}/${l.id}`, text: contentText(l.content) })
      }
    }
  }
  return out
}

// ─── BM25 ──────────────────────────────────────────────────────────

const STOP = new Set(
  (
    'a al algo alguien algun alguna algunas alguno algunos ante antes aqui asi aun aunque cada casi como con contra cual cuales cuando cuanto de del desde donde dos el ella ellas ello ellos en entre era eran eres es esa esas ese eso esos esta estaba estado estan estar estas este esto estos estoy fue fueron fui ha habia han has hasta hay he hemos la las le les lo los mas me mi mia mis mismo mucho muy nada ni no nos nosotros nuestra nuestro o otra otras otro otros para pero poco por porque que quien quienes se sea ser si sido sin sobre solo son soy su sus tal tambien tan tanto te tenia tengo ti tiene tienen todo todos tu tus un una uno unos usted ya yo cosa cosas hacer hace hago dia dias hoy vez veces asi'
  ).split(' '),
)

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .split(/[^a-zñ]+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
    .map((w) => (w.length > 4 && w.endsWith('es') ? w.slice(0, -2) : w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w))
}

interface Index {
  docs: { passage: Passage; tf: Map<string, number>; len: number }[]
  df: Map<string, number>
  avgLen: number
}

let index: Index | null = null

function getIndex(): Index {
  if (index) return index
  const docs = buildLibrary().map((passage) => {
    const tf = new Map<string, number>()
    const words = tokens(`${passage.source} ${passage.text}`)
    for (const w of words) tf.set(w, (tf.get(w) ?? 0) + 1)
    return { passage, tf, len: words.length }
  })
  const df = new Map<string, number>()
  for (const d of docs) for (const w of d.tf.keys()) df.set(w, (df.get(w) ?? 0) + 1)
  index = { docs, df, avgLen: docs.reduce((s, d) => s + d.len, 0) / Math.max(1, docs.length) }
  return index
}

/** The `limit` passages that best match the question (none when nothing is relevant). */
export function searchLibrary(question: string, limit = 4): Passage[] {
  const { docs, df, avgLen } = getIndex()
  const q = [...new Set(tokens(question))]
  if (!q.length) return []
  const k1 = 1.2
  const b = 0.75
  const n = docs.length
  const scored = docs.map((d) => {
    let score = 0
    for (const w of q) {
      const f = d.tf.get(w)
      if (!f) continue
      const idf = Math.log(1 + (n - (df.get(w) ?? 0) + 0.5) / ((df.get(w) ?? 0) + 0.5))
      score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.len) / avgLen)))
    }
    return { passage: d.passage, score }
  })
  return scored
    .filter((s) => s.score > 2)
    .sort((a, b2) => b2.score - a.score)
    .slice(0, limit)
    .map((s) => s.passage)
}
