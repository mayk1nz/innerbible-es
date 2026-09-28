// Brings the writers' suggestions (lotes/*-sugerencias.json) into glosario.json and
// personajes.json, and links every character to the lessons that name it. Idempotent:
// run it again after each batch.
//   node content-src/estudio/merge-sugerencias.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const read = (f) => JSON.parse(fs.readFileSync(path.join(HERE, f), 'utf8'))
const write = (f, v) => fs.writeFileSync(path.join(HERE, f), JSON.stringify(v, null, 2) + '\n')

const glosario = read('glosario.json')
const personajes = read('personajes.json')
const maestra = read('maestra.json')
const order = new Map(maestra.lecciones.map((l, i) => [l.id, i]))
const gIds = new Set(glosario.map((g) => g.id))
const pById = new Map(personajes.map((p) => [p.id, p]))

let addedG = 0
let addedP = 0
const pending = []
const LOTES = path.join(HERE, 'lotes')
for (const f of fs.existsSync(LOTES) ? fs.readdirSync(LOTES).filter((x) => x.endsWith('-sugerencias.json')) : []) {
  let s
  try {
    s = JSON.parse(fs.readFileSync(path.join(LOTES, f), 'utf8'))
  } catch {
    console.log(`ignorado (JSON inválido): ${f}`)
    continue
  }
  for (const g of s.glosario ?? []) {
    if (!g?.id || !g.termino || !g.definicion || gIds.has(g.id)) continue
    glosario.push({ id: g.id, termino: g.termino, definicion: g.definicion })
    gIds.add(g.id)
    addedG++
  }
  for (const p of s.personajes ?? []) {
    if (!p?.id || !p.nombre || !p.linea || pById.has(p.id)) continue
    // A character enters only with a short line (≤ 12 words) and at least one real lesson.
    if ((p.linea.match(/[\p{L}\p{N}]+/gu) ?? []).length > 12) continue
    const lecciones = (p.lecciones ?? []).filter((id) => order.has(id))
    pending.push({ id: p.id, nombre: p.nombre, ...(p.rv1909 ? { rv1909: p.rv1909 } : {}), linea: p.linea, lecciones })
  }
}
// Lessons that already name a suggested character (by id) count as its lessons too.
const namedIn = new Map()
for (const f of fs.readdirSync(path.join(HERE, 'lecciones')).filter((x) => x.endsWith('.json'))) {
  const l = JSON.parse(fs.readFileSync(path.join(HERE, 'lecciones', f), 'utf8'))
  for (const p of l.personajes ?? []) namedIn.set(p.id, [...(namedIn.get(p.id) ?? []), l.id])
}
for (const p of pending) {
  const lecciones = [...new Set([...p.lecciones, ...(namedIn.get(p.id) ?? [])])]
  if (!lecciones.length || pById.has(p.id)) continue
  const np = { ...p, lecciones }
  personajes.push(np)
  pById.set(p.id, np)
  addedP++
}

// Every character named in a lesson lists that lesson (in story order).
let links = 0
const LDIR = path.join(HERE, 'lecciones')
for (const f of fs.readdirSync(LDIR).filter((x) => x.endsWith('.json'))) {
  const l = JSON.parse(fs.readFileSync(path.join(LDIR, f), 'utf8'))
  for (const p of l.personajes ?? []) {
    const gp = pById.get(p.id)
    if (gp && !gp.lecciones.includes(l.id)) {
      gp.lecciones.push(l.id)
      links++
    }
  }
}
for (const p of personajes) p.lecciones.sort((a, b) => (order.get(a) ?? 999) - (order.get(b) ?? 999))

write('glosario.json', glosario)
write('personajes.json', personajes)
console.log(`glosario +${addedG} (total ${glosario.length}) · personajes +${addedP} (total ${personajes.length}) · ${links} ligações personagem→lição`)
