// Shared by the content validators: the app's Reina-Valera 1909 (public/biblia) and a
// reader of Spanish references ("Juan 2:1-11", "Génesis 6–9", "Mateo 5:1–7:29").
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

export const NAMES = {}
for (const m of fs.readFileSync(path.join(ROOT, 'lib', 'biblia.ts'), 'utf8').matchAll(/\{ id: '([^']+)', nombre: '([^']+)'/g)) NAMES[m[2]] = m[1]
export const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
const BOOK = new Map(Object.entries(NAMES).map(([n, id]) => [norm(n), id]))
for (const [a, id] of [['salmo', 'Ps'], ['cantar de los cantares', 'Song'], ['hechos de los apostoles', 'Acts']]) BOOK.set(a, id)

const cache = new Map()
export function chapters(id) {
  if (!cache.has(id)) cache.set(id, JSON.parse(fs.readFileSync(path.join(ROOT, 'public', 'biblia', `${id}.json`), 'utf8')).capitulos)
  return cache.get(id)
}

/** "Juan 2:1-11" | "Juan 2" | "Génesis 6–9" | "Mateo 5:1–7:29" → { id, c, v1, c2, v2 } or null. */
export function parseRef(ref) {
  const m = String(ref).trim().match(/^(.+?)\s+(\d+)(?::(\d+))?(?:\s*[-–]\s*(?:(\d+):)?(\d+))?$/)
  if (!m) return null
  const id = BOOK.get(norm(m[1]))
  if (!id) return null
  const c = Number(m[2])
  const ch = chapters(id)
  if (!ch[c - 1]) return null
  const v1 = m[3] ? Number(m[3]) : null
  const c2 = m[4] ? Number(m[4]) : v1 ? c : m[5] ? Number(m[5]) : c
  const v2 = v1 ? (m[5] ? Number(m[5]) : v1) : null
  if (!ch[c2 - 1] || c2 < c) return null
  if (v1 && (v1 > ch[c - 1].length || v2 > ch[c2 - 1].length || (c2 === c && v2 < v1))) return null
  return { id, c, v1, c2, v2 }
}

/** The exact text of a verse reference, or null (chapters without verses → null). */
export function textOf(ref) {
  const r = parseRef(ref)
  if (!r || !r.v1) return null
  const ch = chapters(r.id)
  const out = []
  for (let c = r.c; c <= r.c2; c++) {
    const from = c === r.c ? r.v1 : 1
    const to = c === r.c2 ? r.v2 : ch[c - 1].length
    for (let v = from; v <= to; v++) out.push(ch[c - 1][v - 1])
  }
  return out.join(' ')
}

export const words = (s) => (String(s).match(/[\p{L}\p{N}]+/gu) ?? []).length
export const sentences = (s) => String(s).split(/(?<=[.!?…])\s+|\n+/).map((x) => x.trim()).filter(Boolean)
export const sameText = (a, b) => String(a).replace(/\s+/g, ' ').trim() === String(b).replace(/\s+/g, ' ').trim()
