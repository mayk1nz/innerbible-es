// Validator of the gift guides (content-src/guias/<guia>/lecciones/*.json).
//   node content-src/guias/validar-guia.mjs <guia>              → índice + every written lesson
//   node content-src/guias/validar-guia.mjs <guia> <id> [<id>…] → only these lessons
//   node content-src/guias/validar-guia.mjs --texto "Juan 2:1-11" → exact RV1909 text (modernized accents)
// A lesson fails when a required field is missing, a limit is exceeded, a sentence is
// longer than the limit, a reference does not exist, the key verse is not the exact RV1909
// text, or an Estudio lesson id does not exist. Exit code 1 when anything fails.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(HERE, '..', '..')
const emit = process.emitWarning
process.emitWarning = (w, ...r) => (/MODULE_TYPELESS|Module type of file/.test(String(w)) || r.some((x) => String(x?.code ?? x).includes('MODULE_TYPELESS')) ? undefined : emit.call(process, w, ...r))
const { LIMITES_GUIA: L, GUIAS } = await import('../../lib/content/guias/types.ts')
process.emitWarning = emit

import { parseRef, textOf, words, sentences, sameText as same } from '../biblia-util.mjs'

if (process.argv[2] === '--texto') {
  for (const r of process.argv.slice(3)) console.log(`${r} → ${textOf(r) ?? 'NÃO ENCONTRADO (livro, capítulo e versículo; ex.: "Juan 2:1-11")'}`)
  process.exit(0)
}

// ─── Checks ────────────────────────────────────────────────────────
const guia = process.argv[2]
if (!GUIAS.includes(guia)) {
  console.error(`Uso: node content-src/guias/validar-guia.mjs <${GUIAS.join('|')}> [ids…]`)
  process.exit(1)
}
const DIR = path.join(HERE, guia)
const maestra = JSON.parse(fs.readFileSync(path.join(ROOT, 'content-src', 'estudio', 'maestra.json'), 'utf8'))
const estudioIds = new Set(maestra.lecciones.map((l) => l.id))

let failed = 0
function check(file) {
  const errors = []
  const warn = []
  let l
  try {
    l = JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (e) {
    return report(file, [`JSON inválido: ${e.message}`], [])
  }
  const id = path.basename(file, '.json')
  let total = 0
  const texts = []
  const text = (where, s, max) => {
    if (typeof s !== 'string' || !s.trim()) return errors.push(`${where}: vazio`)
    const w = words(s)
    total += w
    texts.push(s)
    if (max && w > max) errors.push(`${where}: ${w} palavras (máx. ${max})`)
    for (const f of sentences(s)) if (words(f) > L.fraseMax) errors.push(`${where}: frase com ${words(f)} palavras (máx. ${L.fraseMax}): «${f.slice(0, 70)}…»`)
  }
  const ref = (where, r) => {
    if (!parseRef(r)) errors.push(`${where}: referência não existe ou mal escrita: «${r}»`)
  }
  if (l.id !== id) errors.push(`id "${l.id}" diferente do nome do arquivo "${id}"`)
  text('titulo', l.titulo, L.titulo)
  if (l.subtitulo) text('subtitulo', l.subtitulo, L.subtitulo)
  if (l.etiquetas) {
    if (l.etiquetas.length > L.etiquetas.max) errors.push(`etiquetas: máx. ${L.etiquetas.max}`)
    l.etiquetas.forEach((e, i) => words(e) > L.etiquetas.palabras && errors.push(`etiquetas[${i}]: longa demais`))
  }
  if (!Array.isArray(l.enUnMinuto) || l.enUnMinuto.length < L.enUnMinuto.min || l.enUnMinuto.length > L.enUnMinuto.max) errors.push(`enUnMinuto: ${L.enUnMinuto.min}–${L.enUnMinuto.max} frases`)
  else {
    l.enUnMinuto.forEach((s, i) => text(`enUnMinuto[${i}]`, s))
    const w = l.enUnMinuto.reduce((a, s) => a + words(s), 0)
    if (w > L.enUnMinuto.total) errors.push(`enUnMinuto: ${w} palavras (máx. ${L.enUnMinuto.total})`)
  }
  if (l.versiculo) {
    ref('versiculo.referencia', l.versiculo.referencia)
    const official = textOf(l.versiculo.referencia)
    if (official && !same(official, l.versiculo.texto)) errors.push(`versiculo: não é o texto exato da RV1909 do app.\n     escrito: ${l.versiculo.texto}\n     RV1909:  ${official}`)
    if (words(l.versiculo.texto ?? '') > L.versiculo) errors.push(`versiculo: longo demais (máx. ${L.versiculo} palavras)`)
  }
  const TIPOS = ['texto', 'lista', 'pasos', 'referencias', 'destacado', 'oracion', 'ninos', 'biblia-tradicion', 'nota', 'grupo']
  if (!Array.isArray(l.bloques) || l.bloques.length < L.bloques.min || l.bloques.length > L.bloques.max) errors.push(`bloques: ${L.bloques.min}–${L.bloques.max}`)
  ;(l.bloques ?? []).forEach((b, i) => {
    const w = `bloques[${i}] (${b.tipo})`
    if (!TIPOS.includes(b.tipo)) return errors.push(`${w}: tipo desconhecido`)
    if ('titulo' in b) text(`${w}.titulo`, b.titulo, L.titulo)
    if (b.tipo === 'texto') (b.parrafos ?? []).forEach((p, j) => text(`${w}.parrafos[${j}]`, p, L.parrafo))
    if (['lista', 'pasos', 'grupo'].includes(b.tipo)) (b.items ?? []).forEach((p, j) => text(`${w}.items[${j}]`, p, L.item))
    if (b.tipo === 'referencias')
      (b.items ?? []).forEach((it, j) => {
        ref(`${w}.items[${j}]`, it.ref)
        if (it.nota) text(`${w}.items[${j}].nota`, it.nota, L.item)
      })
    if (b.tipo === 'destacado') text(`${w}.texto`, b.texto, L.destacado)
    if (b.tipo === 'oracion') text(`${w}.texto`, b.texto, L.oracion)
    if (b.tipo === 'nota') text(`${w}.texto`, b.texto, L.nota)
    if (b.tipo === 'ninos') {
      text(`${w}.texto`, b.texto, L.item)
      if (b.actividad) text(`${w}.actividad`, b.actividad, L.item)
    }
    if (b.tipo === 'biblia-tradicion') {
      ;(b.biblia ?? []).forEach((p, j) => text(`${w}.biblia[${j}]`, p, L.item))
      ;(b.tradicion ?? []).forEach((p, j) => text(`${w}.tradicion[${j}]`, p, L.item))
    }
  })
  if (l.quiz) {
    if (l.quiz.length !== L.quiz.preguntas) errors.push(`quiz: ${L.quiz.preguntas} perguntas`)
    l.quiz.forEach((q, i) => {
      text(`quiz[${i}].pregunta`, q.pregunta, L.quiz.pregunta)
      if (q.opciones?.length !== 3) errors.push(`quiz[${i}]: 3 opções`)
      ;(q.opciones ?? []).forEach((o, j) => words(o) > L.quiz.opcion && errors.push(`quiz[${i}].opciones[${j}]: longa demais`))
      if (![0, 1, 2].includes(q.correcta)) errors.push(`quiz[${i}].correcta: 0, 1 ou 2`)
      text(`quiz[${i}].explicacion`, q.explicacion, L.quiz.explicacion)
    })
  } else warn.push('sem quiz')
  ;(l.estudio ?? []).forEach((e) => !estudioIds.has(e) && errors.push(`estudio: lição "${e}" não existe na maestra`))
  if (total < L.total.min || total > L.total.max) errors.push(`total: ${total} palavras (entre ${L.total.min} e ${L.total.max})`)
  // Quotes «…» of 4+ words should be real Bible text.
  const all = texts.join(' ')
  for (const q of all.matchAll(/«([^»]{20,})»/g)) warn.push(`citação «${q[1].slice(0, 50)}…» — confira com --texto se é bíblica`)
  return report(file, errors, warn, total)
}

function report(file, errors, warn, total = 0) {
  const name = path.basename(file)
  if (errors.length) {
    failed++
    console.log(`✗ ${name}  (${errors.length} erros)`)
    errors.forEach((e) => console.log(`   - ${e}`))
  } else console.log(`OK ${name}  (${total} palavras${warn.length ? `, ${warn.length} avisos` : ''})`)
  warn.forEach((w) => console.log(`   · ${w}`))
}

const indicePath = path.join(DIR, 'indice.json')
const indice = fs.existsSync(indicePath) ? JSON.parse(fs.readFileSync(indicePath, 'utf8')) : null
if (!indice) {
  console.log(`✗ falta ${path.relative(ROOT, indicePath)}`)
  failed++
} else {
  const ids = indice.secciones.flatMap((s) => s.lecciones.map((x) => x.id))
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i)
  if (dup.length) {
    console.log(`✗ indice.json: ids repetidos ${dup.join(', ')}`)
    failed++
  } else console.log(`OK indice.json  (${indice.secciones.length} seções, ${ids.length} lições)`)
}
const only = process.argv.slice(3)
const LDIR = path.join(DIR, 'lecciones')
const files = fs.existsSync(LDIR) ? fs.readdirSync(LDIR).filter((f) => f.endsWith('.json') && (!only.length || only.includes(f.replace(/\.json$/, '')))) : []
files.forEach((f) => check(path.join(LDIR, f)))
console.log(`\n${files.length} lições verificadas, ${failed} com erro.`)
process.exit(failed ? 1 : 0)
