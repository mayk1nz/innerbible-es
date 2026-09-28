// Writes content-src/ninos/indice.json: the 52 stories (one a week), in the order of the
// Bible's story, grouped by stage (docs/entregaveis/05-actividades-ninos.md §4.3).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const H = (id, titulo, referencia) => ({ id, titulo, referencia })
const secciones = [
  ['los-comienzos', 'Los comienzos', [H('dios-crea-el-mundo', 'Dios crea el mundo', 'Génesis 1–2'), H('el-jardin', 'El jardín y la primera desobediencia', 'Génesis 3'), H('noe-y-el-arca', 'Noé y el arca', 'Génesis 6–9'), H('la-torre-de-babel', 'La torre de Babel', 'Génesis 11')]],
  ['los-patriarcas', 'Los patriarcas', [H('abraham-y-las-estrellas', 'Abraham cuenta las estrellas', 'Génesis 15'), H('nace-isaac', 'Sara ríe: nace Isaac', 'Génesis 21'), H('la-escalera-de-jacob', 'La escalera de Jacob', 'Génesis 28'), H('la-tunica-de-jose', 'José y su túnica de colores', 'Génesis 37'), H('jose-perdona', 'José perdona a sus hermanos', 'Génesis 45'), H('job-confia', 'Job confía en Dios', 'Job 1–2')]],
  ['moises-y-el-desierto', 'Moisés y el desierto', [H('moises-en-la-canasta', 'Moisés en la canasta', 'Éxodo 2'), H('la-zarza', 'La zarza que ardía', 'Éxodo 3'), H('el-mar-rojo', 'El paso del mar Rojo', 'Éxodo 14'), H('el-mana', 'Pan del cielo: el maná', 'Éxodo 16'), H('los-diez-mandamientos', 'Los Diez Mandamientos', 'Éxodo 20')]],
  ['la-tierra-prometida', 'La tierra prometida', [H('jerico', 'Las murallas de Jericó', 'Josué 6'), H('gedeon', 'Gedeón y los 300', 'Jueces 7'), H('rut-la-amiga-fiel', 'Rut, la amiga fiel', 'Rut 1')]],
  ['jueces-y-reyes', 'Jueces y reyes', [H('ana-ora', 'Ana ora y Dios escucha', '1 Samuel 1'), H('dios-llama-a-samuel', '«Habla, Señor»: Dios llama a Samuel', '1 Samuel 3'), H('david-el-pastorcito', 'David, el pastorcito', '1 Samuel 16'), H('david-y-goliat', 'David y Goliat', '1 Samuel 17'), H('salomon-pide-sabiduria', 'Salomón pide sabiduría', '1 Reyes 3')]],
  ['los-profetas', 'Los profetas', [H('elias-y-la-viuda', 'Elías y la viuda de Sarepta', '1 Reyes 17'), H('jonas-y-el-gran-pez', 'Jonás y el gran pez', 'Jonás 1–4'), H('naaman-y-la-nina', 'Naamán y la niña valiente', '2 Reyes 5')]],
  ['exilio-y-regreso', 'Exilio y regreso', [H('daniel-y-los-leones', 'Daniel y los leones', 'Daniel 6'), H('la-reina-ester', 'La reina Ester', 'Ester 4'), H('nehemias-reconstruye', 'Nehemías reconstruye la muralla', 'Nehemías 2')]],
  ['jesus-nace', 'Jesús nace', [H('el-angel-visita-a-maria', 'El ángel visita a María', 'Lucas 1:26-38'), H('jesus-nace-en-belen', 'Jesús nace en Belén', 'Lucas 2:1-7'), H('los-pastores', 'Los pastores y los ángeles', 'Lucas 2:8-20'), H('los-magos', 'Los magos siguen la estrella', 'Mateo 2:1-12'), H('jesus-en-el-templo', 'Jesús, a los 12 años, en el templo', 'Lucas 2:41-52')]],
  ['jesus-ensena-y-sana', 'Jesús enseña y sana', [H('el-bautismo-de-jesus', 'El bautismo de Jesús', 'Marcos 1:9-11'), H('pescadores-de-personas', 'Pescadores de personas', 'Lucas 5:1-11'), H('agua-en-vino', 'Agua hecha vino en Caná', 'Juan 2:1-11'), H('jesus-calma-la-tormenta', 'Jesús calma la tormenta', 'Marcos 4:35-41'), H('la-casa-sobre-la-roca', 'La casa sobre la roca', 'Mateo 7:24-27'), H('panes-y-peces', 'El niño de los panes y los peces', 'Juan 6:1-14'), H('el-buen-samaritano', 'El buen samaritano', 'Lucas 10:25-37'), H('la-oveja-perdida', 'La oveja perdida', 'Lucas 15:3-7'), H('el-padre-que-abraza', 'El padre que corre a abrazar', 'Lucas 15:11-32'), H('jesus-bendice-a-los-ninos', 'Jesús bendice a los niños', 'Marcos 10:13-16'), H('bartimeo', 'Bartimeo vuelve a ver', 'Marcos 10:46-52'), H('zaqueo', 'Zaqueo baja del árbol', 'Lucas 19:1-10')]],
  ['pascua', 'Pascua', [H('jesus-entra-en-jerusalen', 'Jesús entra en Jerusalén', 'Mateo 21:1-11'), H('jesus-lava-los-pies', 'La última cena: Jesús lava los pies', 'Juan 13:1-17'), H('la-cruz-y-la-tumba-vacia', 'La cruz y la tumba vacía', 'Lucas 24:1-12')]],
  ['la-iglesia-nace', 'La Iglesia nace', [H('pentecostes', 'Pentecostés: llega el Espíritu Santo', 'Hechos 2:1-13'), H('pablo-y-silas', 'Pablo y Silas cantan en la cárcel', 'Hechos 16:16-34'), H('cielo-nuevo', 'Un cielo nuevo y una tierra nueva', 'Apocalipsis 21:1-5')]],
].map(([id, titulo, historias]) => ({ id, titulo, historias }))

const n = secciones.reduce((a, s) => a + s.historias.length, 0)
if (n !== 52) throw new Error(`${n} historias (esperava 52)`)
fs.writeFileSync(path.join(HERE, 'indice.json'), JSON.stringify({ secciones }, null, 2) + '\n')
console.log(`indice.json: ${n} historias em ${secciones.length} etapas`)
