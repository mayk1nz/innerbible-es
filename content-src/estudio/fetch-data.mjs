// Downloads the open datasets behind the Estudio Cronológico's cross-study search into
// content-src/estudio/raw (not versioned). All free for commercial use:
//   - OpenBible.info cross references (CC-BY, based on the Treasury of Scripture Knowledge)
//   - Reina-Valera 1909 (public domain) — scrollmapper/bible_databases
//   - Theographic Bible Metadata (CC BY-SA 4.0) — years/events/people per verse
// Usage: node content-src/estudio/fetch-data.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RAW = path.join(path.dirname(fileURLToPath(import.meta.url)), 'raw')
fs.mkdirSync(RAW, { recursive: true })

const FILES = [
  ['cross-references.zip', 'https://a.openbible.info/data/cross-references.zip'],
  ['SpaRV.json', 'https://raw.githubusercontent.com/scrollmapper/bible_databases/master/formats/json/SpaRV.json'],
  ['theographic-verses.json', 'https://raw.githubusercontent.com/robertrouse/theographic-bible-metadata/master/json/verses.json'],
  ['theographic-events.json', 'https://raw.githubusercontent.com/robertrouse/theographic-bible-metadata/master/json/events.json'],
  ['theographic-people.json', 'https://raw.githubusercontent.com/robertrouse/theographic-bible-metadata/master/json/people.json'],
  ['theographic-places.json', 'https://raw.githubusercontent.com/robertrouse/theographic-bible-metadata/master/json/places.json'],
  ['theographic-books.json', 'https://raw.githubusercontent.com/robertrouse/theographic-bible-metadata/master/json/books.json'],
]

for (const [name, url] of FILES) {
  const out = path.join(RAW, name)
  if (fs.existsSync(out) && fs.statSync(out).size > 1000) {
    console.log(`já existe ${name}`)
    continue
  }
  const res = await fetch(url)
  if (!res.ok) {
    console.log(`FALHOU ${name}: ${res.status}`)
    continue
  }
  fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()))
  console.log(`${name}: ${(fs.statSync(out).size / 1e6).toFixed(1)} MB`)
}
