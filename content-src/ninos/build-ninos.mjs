// Rincón de los niños: validate and publish the stories.
//   node content-src/ninos/build-ninos.mjs              → validate all, publish if all pass
//   node content-src/ninos/build-ninos.mjs --check <id> → only validate content-src/ninos/historias/<id>.json
// Publishes content-private/ninos/<id>.json (served by /api/content to members) +
// lib/content/ninos/index.ts (sections + the ids of the published stories).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseRef, textOf, words, sentences, sameText } from '../biblia-util.mjs'
import { dropLegacyJson, privateDir } from '../private-out.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(HERE, '..', '..')
const OUT = path.join(ROOT, 'lib', 'content', 'ninos')
const emit = process.emitWarning
process.emitWarning = (w, ...r) => (/MODULE_TYPELESS|Module type of file/.test(String(w)) || r.some((x) => String(x?.code ?? x).includes('MODULE_TYPELESS')) ? undefined : emit.call(process, w, ...r))
const { LIMITES_NINOS: L, BANDAS } = await import('../../lib/content/ninos/types.ts')
process.emitWarning = emit

const indice = JSON.parse(fs.readFileSync(path.join(HERE, 'indice.json'), 'utf8'))
const ids = new Set(indice.secciones.flatMap((s) => s.historias.map((h) => h.id)))
const maestra = JSON.parse(fs.readFileSync(path.join(ROOT, 'content-src', 'estudio', 'maestra.json'), 'utf8'))
const estudioIds = new Set(maestra.lecciones.map((l) => l.id))
const TIPOS = ['ordenar', 'quiz', 'memoria', 'verdadero-falso', 'sopa']

function validate(file) {
  const e = []
  const h = JSON.parse(fs.readFileSync(file, 'utf8'))
  const txt = (w, s, max, frase = 22) => {
    if (typeof s !== 'string' || !s.trim()) return e.push(`${w}: vazio`)
    if (max && words(s) > max) e.push(`${w}: ${words(s)} palavras (máx. ${max})`)
    for (const f of sentences(s)) if (words(f) > frase) e.push(`${w}: frase com ${words(f)} palavras (máx. ${frase})`)
  }
  if (h.id !== path.basename(file, '.json')) e.push('id ≠ nome do arquivo')
  if (!ids.has(h.id)) e.push('id não está no indice.json')
  txt('titulo', h.titulo, L.titulo)
  if (!parseRef(h.referencia)) e.push(`referencia inválida «${h.referencia}»`)
  if (!estudioIds.has(h.estudio)) e.push(`estudio: «${h.estudio}» não existe na maestra`)
  if (!Array.isArray(h.escenas) || h.escenas.length < L.escenas.min || h.escenas.length > L.escenas.max) e.push(`escenas: ${L.escenas.min}–${L.escenas.max}`)
  ;(h.escenas ?? []).forEach((s, i) => BANDAS.forEach((b) => txt(`escenas[${i}].texto.${b}`, s.texto?.[b], L.escena[b], L.frase[b])))
  BANDAS.forEach((b) => {
    const v = h.versiculo?.[b]
    if (!v) return e.push(`versiculo.${b}: falta`)
    txt(`versiculo.${b}.texto`, v.texto, L.versiculo)
    if (!parseRef(v.referencia)) e.push(`versiculo.${b}.referencia inválida`)
    if (v.fuente === 'RV1909') {
      const t = textOf(v.referencia)
      if (t && !sameText(t, v.texto)) e.push(`versiculo.${b}: não é o texto exato da RV1909 (${t})`)
    }
  })
  if (h.versiculo?.['9-12']?.fuente !== 'RV1909') e.push('versiculo.9-12: use o texto exato da RV1909')
  if (!Array.isArray(h.juegos) || h.juegos.length < 1 || h.juegos.length > 2) e.push('juegos: 1 ou 2')
  ;(h.juegos ?? []).forEach((j, i) => {
    if (!TIPOS.includes(j.tipo)) return e.push(`juegos[${i}]: tipo inválido`)
    txt(`juegos[${i}].enunciado`, j.enunciado, 20)
    BANDAS.forEach((b) => {
      const n = j.niveles?.[b]
      if (!n) return e.push(`juegos[${i}].niveles.${b}: falta`)
      if (j.tipo === 'ordenar' && !(n.items?.length >= 3)) e.push(`juegos[${i}].${b}: ordenar precisa de 3+ itens`)
      if (j.tipo === 'quiz') n.preguntas?.forEach((q, k) => (q.correcta < 0 || q.correcta >= q.opciones.length) && e.push(`juegos[${i}].${b}.preguntas[${k}]: correcta fora das opções`))
      if (j.tipo === 'memoria' && !(n.pares?.length >= 3)) e.push(`juegos[${i}].${b}: memoria precisa de 3+ pares`)
      if (j.tipo === 'sopa') {
        if (!(n.tamano >= 5 && n.tamano <= 12)) e.push(`juegos[${i}].${b}: tamano 5–12`)
        n.palabras?.forEach((p) => p.length > n.tamano && e.push(`juegos[${i}].${b}: «${p}» maior que a grade`))
      }
    })
  })
  const p = h.padres ?? {}
  txt('padres.objetivo', p.objetivo, L.padres.objetivo)
  ;['recordar', 'sentir', 'vivir'].forEach((k) => txt(`padres.preguntas.${k}`, p.preguntas?.[k], L.padres.pregunta))
  txt('padres.oracion', p.oracion, L.padres.oracion)
  txt('padres.gesto', p.gesto, L.padres.gesto)
  ;(p.siPregunta ?? []).forEach((s, i) => txt(`padres.siPregunta[${i}].respuesta`, s.respuesta, L.padres.respuesta))
  txt('estampa', h.estampa, 8)
  return e
}

const only = process.argv[2] === '--check' ? process.argv.slice(3) : []
const HDIR = path.join(HERE, 'historias')
fs.mkdirSync(HDIR, { recursive: true })
const files = fs.readdirSync(HDIR).filter((f) => f.endsWith('.json') && (!only.length || only.includes(f.replace(/\.json$/, ''))))
let failed = 0
for (const f of files) {
  const e = validate(path.join(HDIR, f))
  if (e.length) {
    failed++
    console.log(`✗ ${f}`)
    e.forEach((x) => console.log(`   - ${x}`))
  } else console.log(`OK ${f}`)
}
console.log(`${files.length} historias verificadas, ${failed} com erro.`)
if (only.length) process.exit(failed ? 1 : 0)
if (failed) {
  console.log('Nada publicado.')
  process.exit(1)
}
fs.mkdirSync(OUT, { recursive: true })
const PRIV = privateDir('ninos')
const published = []
for (const f of files) {
  const id = f.replace(/\.json$/, '')
  // The illustration, when public/ninos/<id>.webp exists (made in Canva, one per story).
  const h = JSON.parse(fs.readFileSync(path.join(HDIR, f), 'utf8'))
  if (fs.existsSync(path.join(ROOT, 'public', 'ninos', `${id}.webp`))) h.imagen = { src: `/ninos/${id}.webp`, alt: h.titulo }
  fs.writeFileSync(path.join(PRIV, f), JSON.stringify(h, null, 2) + '\n')
  published.push(id)
}
dropLegacyJson(OUT)
fs.writeFileSync(
  path.join(OUT, 'index.ts'),
  `// Generated by content-src/ninos/build-ninos.mjs — do not edit by hand.\n` +
    `// The stories live in content-private/ninos and come from /api/content (members only).\n` +
    `import { fetchContent } from '../fetch-content'\n` +
    `import type { HistoriaNinos, NinosIndice } from './types'\n\n` +
    `export const NINOS_SECCIONES: NinosIndice['secciones'] = ${JSON.stringify(indice.secciones, null, 2)}\n\n` +
    `/** Ids of the published stories. */\n` +
    `export const NINOS_HISTORIAS: ReadonlySet<string> = new Set(${JSON.stringify(published, null, 2)})\n\n` +
    `/** A published story; null when it is not ready yet. */\n` +
    `export function loadHistoria(id: string): Promise<HistoriaNinos | null> {\n` +
    `  return NINOS_HISTORIAS.has(id) ? fetchContent<HistoriaNinos>(\`ninos/\${id}\`) : Promise.resolve(null)\n` +
    `}\n`,
)
console.log(`Publicado: ${published.length} historias.`)
