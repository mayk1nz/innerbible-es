// Words not allowed in the community (posts, comments, shared reflections): insults,
// vulgarities and slurs used across Latin America and Spain, plus a few in English.
// Checked word by word after normalizing (accents, capitals, "p3nd3jo", "puuuta"), so
// innocent words that merely contain one ("computadora", "disputa", "vergüenza") pass.
// Used by the API (which refuses the text) and by the screens (which warn before sending).

/** Whole words. */
const WORDS = [
  // vulgar / insults
  'puta', 'putas', 'puto', 'putos', 'putita', 'putito', 'putazo', 'putear', 'puteada', 'putero', 'putera', 'putiza',
  'hdp', 'hp', 'hpta', 'hijueputa', 'hijueputas', 'hijoputa', 'jueputa', 'ptm', 'ptmr', 'alv', 'ctm', 'csm', 'ctmr', 'conchetumare', 'conchetumadre', 'conchesumadre', 'conchasumadre', 'chucha', 'chuchas', 'chuchatumadre',
  'malparido', 'malparida', 'malparidos', 'malparidas', 'gonorrea', 'gonorreas', 'carechimba', 'chimba', 'culicagado', 'culicagada',
  'pendejo', 'pendeja', 'pendejos', 'pendejas', 'pendejada', 'pendejadas', 'pendejete',
  'cabron', 'cabrona', 'cabrones', 'cabronas', 'cabronazo', 'cabronada',
  'chingar', 'chingada', 'chingado', 'chingados', 'chingadas', 'chingadera', 'chingaderas', 'chingue', 'chinguen', 'chingo', 'chingas', 'chingate', 'chingon', 'chingona', 'chinga', 'chingatumadre',
  'verga', 'vergas', 'vergazo', 'vergota', 'vergudo', 'verguero', 'vergon',
  'pinche', 'pinches', 'culero', 'culera', 'culeros', 'culeras', 'culo', 'culos', 'culiao', 'culiado', 'culiada', 'culia',
  'ojete', 'ojetes', 'mamon', 'mamona', 'mamones', 'mamada', 'mamadas', 'mamaguevo', 'mamaguevos', 'mamahuevo', 'mamahuevos', 'mamabicho',
  'huevon', 'huevona', 'huevones', 'guevon', 'guevona', 'weon', 'weona', 'weones', 'weas', 'wea', 'aweonao', 'ahueonado', 'huevada', 'huevadas', 'boludo', 'boluda', 'boludos', 'pelotudo', 'pelotuda', 'pelotudos',
  'gilipollas', 'gilipollez', 'capullo', 'capulla', 'cojones', 'cojonudo', 'joder', 'jodido', 'jodida', 'jodidos', 'jodete', 'jodanse', 'jodase',
  'carajo', 'carajos', 'mierda', 'mierdas', 'mierdero', 'mierdoso', 'cagada', 'cagadas', 'cagar', 'cagon', 'cagona', 'cago', 'cagarse', 'caguen',
  'zorra', 'zorras', 'perra', 'perras', 'puton', 'putona', 'furcia', 'golfa',
  'pajero', 'pajera', 'pajeros', 'puneta', 'punetas', 'punetero', 'puñeta', 'mamarracho',
  'cojudo', 'cojuda', 'cojudez', 'huevonada', 'baboso', 'babosa', 'imbecil', 'imbeciles', 'idiota', 'idiotas', 'estupido', 'estupida', 'estupidos', 'estupidas',
  'tarado', 'tarada', 'retrasado', 'retrasada', 'mongolico', 'mongolica', 'mogolico', 'mogolica', 'subnormal', 'subnormales',
  // slurs
  'marica', 'maricas', 'maricon', 'maricones', 'maricona', 'marico', 'maricos', 'joto', 'jotos', 'puto', 'bollera', 'tortillera', 'tortilleras', 'travelo', 'sidoso', 'sidosa',
  'sudaca', 'sudacas', 'negrata', 'guiri', 'judiazo',
  // sexual
  'follar', 'follando', 'follame', 'porno', 'porn', 'xxx', 'pornografia', 'nopor', 'tetona', 'tetonas', 'culona', 'culonas', 'vergota', 'panocha', 'panochas',
  // English
  'fuck', 'fucking', 'fucker', 'motherfucker', 'shit', 'bitch', 'bitches', 'asshole', 'dick', 'pussy', 'cunt', 'whore', 'slut', 'nigger', 'nigga', 'faggot',
]

/** Word beginnings: any word starting like this (the family of an insult). */
const STEMS = [
  'hijueput', 'hijoput', 'malparid', 'pendej', 'cabron', 'chingad', 'chingader', 'mamaguev', 'mamahuev', 'maricon', 'culer', 'putit', 'putaz', 'conchetum', 'conchesum', 'conchasum', 'reconchetum', 'gilipoll', 'gonorre', 'mierd', 'cagad', 'jodid', 'fuck', 'motherf',
]

/** Expressions of more than one word. */
const PHRASES = ['hijo de puta', 'hija de puta', 'hijos de puta', 'me cago en', 'tu madre la', 'chinga tu madre', 'la concha de', 'concha de tu', 'conchatumadre', 'hijo de perra', 'hija de perra', 'vete a la mierda', 'come mierda', 'lame culo', 'lambe culo']

const LEET: Record<string, string> = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's', '!': 'i' }

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[013457@$!]/g, (c) => LEET[c] ?? c)
    // "puuuta", "mieeerda": three or more of the same letter count as one
    .replace(/([a-z])\1{2,}/g, '$1')
}

const WORD_SET = new Set(WORDS.map(normalize))
const STEM_LIST = STEMS.map(normalize)
const PHRASE_LIST = PHRASES.map(normalize)

/** True when the text has a word not allowed in the community. */
export function hasOffensiveWords(text: string): boolean {
  // With its ñ only (without it, "cono" is an innocent word).
  if (/(^|[^a-zñ])coño([^a-zñ]|$)/i.test(text)) return true
  const clean = normalize(text)
  // Letters split by dots, dashes or asterisks ("p.u.t.a", "m-i-e-r-d-a") are joined back.
  const joined = clean.replace(/\b([a-z])[.\-*_ ](?=[a-z]\b)/g, '$1')
  for (const t of [clean, joined]) {
    const spaced = ` ${t.replace(/[^a-z]+/g, ' ')} `
    if (PHRASE_LIST.some((p) => spaced.includes(` ${p} `))) return true
    for (const word of t.split(/[^a-z]+/)) {
      if (!word) continue
      if (WORD_SET.has(word)) return true
      if (STEM_LIST.some((s) => word.startsWith(s))) return true
    }
  }
  return false
}

export const OFFENSIVE_MESSAGE = 'Tu mensaje tiene palabras que no están permitidas en la comunidad. Por favor, escríbelo de otra forma: aquí nos cuidamos entre hermanos.'
