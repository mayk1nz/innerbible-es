// Mapas Mentales: validate and publish.
//   node content-src/mapas/build-mapas.mjs            → validate every map, publish if all pass
//   node content-src/mapas/build-mapas.mjs --check x  → only validate content-src/mapas/mapas/x.json
// Publishes content-private/mapas/<id>.json (served by /api/content to members) +
// lib/content/mapas/index.ts (sections + the ids of the published maps).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { NAMES, parseRef, textOf, words, sentences, sameText } from '../biblia-util.mjs'
import { dropLegacyJson, privateDir } from '../private-out.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(HERE, '..', '..')
const OUT = path.join(ROOT, 'lib', 'content', 'mapas')
const emit = process.emitWarning
process.emitWarning = (w, ...r) => (/MODULE_TYPELESS|Module type of file/.test(String(w)) || r.some((x) => String(x?.code ?? x).includes('MODULE_TYPELESS')) ? undefined : emit.call(process, w, ...r))
const { LIMITES_MAPA: L, COLORES_RAMA, TIPOS_HOJA } = await import('../../lib/content/mapas/types.ts')
process.emitWarning = emit

const indice = JSON.parse(fs.readFileSync(path.join(HERE, 'indice.json'), 'utf8'))
const mapIds = new Set(indice.secciones.flatMap((s) => s.mapas.map((m) => m.id)))
const maestra = JSON.parse(fs.readFileSync(path.join(ROOT, 'content-src', 'estudio', 'maestra.json'), 'utf8'))
const estudioIds = new Set(maestra.lecciones.map((l) => l.id))
const osis = new Set(Object.values(NAMES))

function validate(file) {
  const e = []
  const m = JSON.parse(fs.readFileSync(file, 'utf8'))
  const txt = (w, s, max) => {
    if (typeof s !== 'string' || !s.trim()) return e.push(`${w}: vazio`)
    if (max && words(s) > max) e.push(`${w}: ${words(s)} palavras (máx. ${max})`)
    for (const f of sentences(s)) if (words(f) > L.fraseMax) e.push(`${w}: frase longa (${words(f)} palavras)`)
    if (/[êãõç]/i.test(s)) e.push(`${w}: caractere de português`)
  }
  const ref = (w, r) => !parseRef(r) && e.push(`${w}: referência inválida «${r}»`)
  if (m.id !== path.basename(file, '.json')) e.push('id ≠ nome do arquivo')
  if (!mapIds.has(m.id)) e.push('id não está no indice.json')
  if (!['libro', 'tema'].includes(m.tipo)) e.push('tipo: libro | tema')
  if (m.tipo === 'libro' && !osis.has(m.libro)) e.push(`libro: OSIS inválido «${m.libro}»`)
  txt('titulo', m.titulo, L.titulo)
  txt('subtitulo', m.subtitulo, L.subtitulo)
  txt('centro.texto', m.centro?.texto, L.centro)
  txt('centro.textoNino', m.centro?.textoNino, L.centroNino)
  ref('versiculo.referencia', m.versiculo?.referencia ?? '')
  const official = textOf(m.versiculo?.referencia ?? '')
  if (official && !sameText(official, m.versiculo.texto)) e.push(`versiculo: não é o texto exato da RV1909\n     RV1909: ${official}`)
  if (!official) e.push('versiculo: use capítulo:versículo')
  if (!Array.isArray(m.ramas) || m.ramas.length < L.ramas.min || m.ramas.length > L.ramas.max) e.push(`ramas: ${L.ramas.min}–${L.ramas.max}`)
  ;(m.ramas ?? []).forEach((r, i) => {
    const w = `ramas[${i}]`
    txt(`${w}.titulo`, r.titulo, L.ramas.titulo)
    txt(`${w}.resumen`, r.resumen, L.ramas.resumen)
    txt(`${w}.resumenNino`, r.resumenNino, L.ramas.resumenNino)
    if (!COLORES_RAMA.includes(r.color)) e.push(`${w}.color inválida`)
    if (!Array.isArray(r.hojas) || r.hojas.length < L.hojas.min || r.hojas.length > L.hojas.max) e.push(`${w}.hojas: ${L.hojas.min}–${L.hojas.max}`)
    ;(r.hojas ?? []).forEach((h, j) => {
      txt(`${w}.hojas[${j}].titulo`, h.titulo, L.hojas.titulo)
      txt(`${w}.hojas[${j}].texto`, h.texto, L.hojas.texto)
      if (h.textoNino) txt(`${w}.hojas[${j}].textoNino`, h.textoNino, L.hojas.textoNino)
      ref(`${w}.hojas[${j}].referencia`, h.referencia)
      if (!TIPOS_HOJA.includes(h.tipo)) e.push(`${w}.hojas[${j}].tipo inválido`)
    })
  })
  txt('cristo.texto', m.cristo?.texto, L.cristo)
  ;(m.cristo?.referencias ?? []).forEach((r, i) => ref(`cristo.referencias[${i}]`, r))
  if (!Array.isArray(m.paraTuVida) || m.paraTuVida.length < L.paraTuVida.min || m.paraTuVida.length > L.paraTuVida.max) e.push('paraTuVida: 1–3')
  ;(m.paraTuVida ?? []).forEach((p, i) => txt(`paraTuVida[${i}]`, p, L.paraTuVida.paso))
  if (m.preguntas?.length !== L.preguntas) e.push('preguntas: 3')
  ;(m.preguntas ?? []).forEach((q, i) => {
    txt(`preguntas[${i}].pregunta`, q.pregunta, 18)
    if (q.opciones?.length !== 3 || ![0, 1, 2].includes(q.correcta)) e.push(`preguntas[${i}]: 3 opções e correcta 0–2`)
    txt(`preguntas[${i}].explicacion`, q.explicacion, 25)
  })
  ;(m.estudio ?? []).forEach((id) => !estudioIds.has(id) && e.push(`estudio: «${id}» não existe na maestra`))
  if (!m.estudio?.length) e.push('estudio: ao menos 1 lição do Estudio')
  ;(m.conexiones ?? []).forEach((c) => !mapIds.has(c.id) && e.push(`conexiones: mapa «${c.id}» não existe`))
  return e
}

const only = process.argv[2] === '--check' ? process.argv.slice(3) : []
const MDIR = path.join(HERE, 'mapas')
const files = fs.existsSync(MDIR) ? fs.readdirSync(MDIR).filter((f) => f.endsWith('.json') && (!only.length || only.includes(f.replace(/\.json$/, '')))) : []
let failed = 0
for (const f of files) {
  const e = validate(path.join(MDIR, f))
  if (e.length) {
    failed++
    console.log(`✗ ${f}`)
    e.forEach((x) => console.log(`   - ${x}`))
  } else console.log(`OK ${f}`)
}
console.log(`${files.length} mapas verificados, ${failed} com erro.`)
if (only.length) process.exit(failed ? 1 : 0)
if (failed) {
  console.log('Nada publicado.')
  process.exit(1)
}
fs.mkdirSync(OUT, { recursive: true })
const PRIV = privateDir('mapas')
const published = []
for (const f of files) {
  fs.copyFileSync(path.join(MDIR, f), path.join(PRIV, f))
  published.push(f.replace(/\.json$/, ''))
}
dropLegacyJson(OUT)
fs.writeFileSync(
  path.join(OUT, 'index.ts'),
  `// Generated by content-src/mapas/build-mapas.mjs — do not edit by hand.\n` +
    `// The maps live in content-private/mapas and come from /api/content (members only).\n` +
    `import { fetchContent } from '../fetch-content'\n` +
    `import type { MapaMental, MapasIndice } from './types'\n\n` +
    `export const MAPAS_SECCIONES: MapasIndice['secciones'] = ${JSON.stringify(indice.secciones, null, 2)}\n\n` +
    `/** Ids of the published maps. */\n` +
    `export const MAPAS: ReadonlySet<string> = new Set(${JSON.stringify(published, null, 2)})\n\n` +
    `/** A published map; null when it is not drawn yet. */\n` +
    `export function loadMapa(id: string): Promise<MapaMental | null> {\n` +
    `  return MAPAS.has(id) ? fetchContent<MapaMental>(\`mapas/\${id}\`) : Promise.resolve(null)\n` +
    `}\n`,
)
console.log(`Publicado: ${published.length} mapas.`)
