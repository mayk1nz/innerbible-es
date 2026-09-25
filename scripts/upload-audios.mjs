// Uploads the audio files of a product to Supabase Storage (private bucket "audios").
//   node scripts/upload-audios.mjs <folder> [product]        product: cronologico-audio (default) | plan-escucha
//   node scripts/upload-audios.mjs <folder> [product] --dry  only shows how the files match
//
// Files are matched to lessons by name, accents and case ignored, with or without a
// number in front: "Génesis.mp3", "03 - Génesis.mp3", "1 Samuel.mp3", "Día 1.mp3".
// Each one is stored as "<product>/<lesson-id>.mp3" and plays at once in the app.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const BUCKET = 'audios'
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const dry = process.argv.includes('--dry')
const [folder, product = 'cronologico-audio'] = args
if (!folder) {
  console.error('Uso: node scripts/upload-audios.mjs <carpeta> [cronologico-audio|plan-escucha] [--dry]')
  process.exit(1)
}

const slugify = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

/** The lesson ids of the product, read from lib/catalog.ts (the single source). */
function expectedIds() {
  if (product === 'plan-escucha') return Array.from({ length: 30 }, (_, i) => `dia-${i + 1}`)
  const src = fs.readFileSync(path.join(ROOT, 'lib', 'catalog.ts'), 'utf8')
  const list = (name) => {
    const block = src.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\]`))
    if (!block) throw new Error(`${name} not found in catalog.ts`)
    return [...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1])
  }
  return ['Comienza aquí', '¿Por qué la Biblia se divide en Antiguo y Nuevo Testamento?', ...list('OLD_TESTAMENT'), ...list('NEW_TESTAMENT')].map(slugify)
}

const ALIASES = { 'comienza-por-aqui': 'comienza-aqui', 'cantares': 'cantares-de-salomon', 'cantar-de-los-cantares': 'cantares-de-salomon', 'hechos': 'hechos-de-los-apostoles' }

const ids = new Set(expectedIds())
function match(file) {
  const base = path.parse(file).name
  const tries = [base, base.replace(/^\s*\d+\s*[-._)]+\s*/, ''), base.replace(/^\s*\d+\s+/, '')]
  for (const t of tries) {
    const id = ALIASES[slugify(t)] ?? slugify(t)
    if (ids.has(id)) return id
  }
  return null
}

const files = fs.readdirSync(folder).filter((f) => /\.(mp3|m4a)$/i.test(f))
const plan = files.map((f) => ({ file: f, id: match(f) }))
for (const p of plan) console.log(`${p.id ? 'OK ' : '?? '} ${p.file}${p.id ? `  →  ${product}/${p.id}.mp3` : '  (sin lección: renómbralo)'}`)
const matched = new Set(plan.filter((p) => p.id).map((p) => p.id))
const missing = [...ids].filter((id) => !matched.has(id))
console.log(`\n${matched.size} de ${ids.size} lecciones con audio.${missing.length ? ` Faltan: ${missing.join(', ')}` : ''}`)
if (dry) process.exit(0)

const env = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8')
const read = (k) => env.match(new RegExp(`^${k}=(.*)$`, 'm'))?.[1].trim().split(/\s+/)[0]
const supabase = createClient(read('NEXT_PUBLIC_SUPABASE_URL'), read('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } })

const { data: buckets } = await supabase.storage.listBuckets()
if (!buckets?.some((b) => b.name === BUCKET)) {
  const { error } = await supabase.storage.createBucket(BUCKET, { public: false })
  if (error) throw new Error(`No se pudo crear el bucket: ${error.message}`)
  console.log(`Bucket "${BUCKET}" creado (privado).`)
}

for (const p of plan.filter((x) => x.id)) {
  const body = fs.readFileSync(path.join(folder, p.file))
  const { error } = await supabase.storage.from(BUCKET).upload(`${product}/${p.id}.mp3`, body, {
    contentType: /\.m4a$/i.test(p.file) ? 'audio/mp4' : 'audio/mpeg',
    upsert: true,
  })
  console.log(error ? `ERRO ${p.file}: ${error.message}` : `subido ${p.file}`)
}
