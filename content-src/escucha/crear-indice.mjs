// Writes content-src/escucha/indice.json: the audios of the Resumen en Audio (ids and
// titles, read from lib/catalog.ts) with the Estudio lessons that tell the same part (the
// reverse of the map in components/EstudioAudio.tsx). The writers of the Guía de escucha
// use it as their list and their sources.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(HERE, '..', '..')
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const catalog = fs.readFileSync(path.join(ROOT, 'lib', 'catalog.ts'), 'utf8')
const list = (name) => [...catalog.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\]`))[1].matchAll(/'([^']+)'/g)].map((m) => m[1])
const titles = [
  'Comienza aquí',
  '¿Por qué la Biblia se divide en Antiguo y Nuevo Testamento?',
  ...list('OLD_TESTAMENT'),
  ...list('NEW_TESTAMENT'),
  'Conclusión: del Génesis al Apocalipsis',
]

// "estudio-id": ['Audio title', …] in EstudioAudio.tsx → audio title → estudio ids.
const map = fs.readFileSync(path.join(ROOT, 'components', 'EstudioAudio.tsx'), 'utf8')
const byTitle = {}
for (const m of map.matchAll(/^\s+'?([a-z0-9-]+)'?: \[([^\]]+)\],?$/gm)) {
  for (const t of [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1])) (byTitle[t] ??= []).push(m[1])
}

const audios = titles.map((titulo) => ({ id: slug(titulo), titulo, estudio: byTitle[titulo] ?? [] }))
if (audios.length !== 67) throw new Error(`${audios.length} audios (esperava 67)`)
fs.writeFileSync(path.join(HERE, 'indice.json'), JSON.stringify({ audios }, null, 2) + '\n')
console.log(`indice.json: ${audios.length} audios; sem lição do Estudio: ${audios.filter((a) => !a.estudio.length).map((a) => a.id).join(', ') || 'nenhum'}`)
