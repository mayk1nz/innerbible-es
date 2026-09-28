// Writes content-src/mapas/indice.json: 6 panorama maps + one map per book (66), in the
// Bible's order (the Estudio links each map to the lesson where the book is told).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { NAMES } from '../biblia-util.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const books = Object.keys(NAMES)
const at = books.slice(0, 39)
const nt = books.slice(39)
const indice = {
  secciones: [
    {
      id: 'panorama',
      titulo: 'Panorama de la Biblia',
      mapas: [
        { id: 'mapa-de-la-biblia', titulo: 'La Biblia en un mapa' },
        { id: 'linea-del-tiempo', titulo: 'La línea del tiempo' },
        { id: 'tipos-de-libros', titulo: 'Los tipos de libros' },
        { id: 'pactos-de-dios', titulo: 'Los pactos de Dios' },
        { id: 'historia-de-la-salvacion', titulo: 'La historia de la salvación' },
        { id: 'jesus-en-toda-la-biblia', titulo: 'Jesús en toda la Biblia' },
      ],
    },
    { id: 'antiguo-testamento', titulo: 'Antiguo Testamento', mapas: at.map((n) => ({ id: slug(n), titulo: n })) },
    { id: 'nuevo-testamento', titulo: 'Nuevo Testamento', mapas: nt.map((n) => ({ id: slug(n), titulo: n })) },
  ],
}
fs.writeFileSync(path.join(HERE, 'indice.json'), JSON.stringify(indice, null, 2) + '\n')
console.log(`indice.json: ${indice.secciones.reduce((a, s) => a + s.mapas.length, 0)} mapas`)
