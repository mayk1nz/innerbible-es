import type { Metadata } from 'next'

// innerbible.app: who we are and the way into each of our apps. Shown on the bare domain
// (proxy.ts rewrites innerbible.app/ here); the English app lives at www.innerbible.app
// (innerbible.app/en redirects there).

export const metadata: Metadata = {
  title: { absolute: 'Inner Bible · Garden Technology' },
  description: 'Aplicaciones de estudio bíblico para entender la Biblia con claridad, en tu idioma y desde el teléfono.',
  robots: { index: true, follow: true },
}

const APPS = [
  {
    name: 'La Biblia Interior',
    lang: 'Español',
    href: 'https://es.innerbible.app',
    host: 'es.innerbible.app',
    text: 'El Estudio Cronológico de la Biblia: toda la historia bíblica en el orden en que sucedió, en lecciones de un minuto, con la Biblia completa, guías, mapas, audios y actividades para niños.',
  },
  {
    name: 'Biblia Wewnętrzna',
    lang: 'Polski',
    href: 'https://pl.innerbible.app',
    host: 'pl.innerbible.app',
    text: 'Chronologiczne studium Biblii: cała historia biblijna w kolejności wydarzeń, w krótkich lekcjach na telefonie.',
  },
  {
    name: 'Inner Bible',
    lang: 'English',
    href: 'https://www.innerbible.app',
    host: 'innerbible.app/en',
    text: 'The deeper reading of Scripture: guided study that reveals the layers of each passage.',
  },
]

const COMPANY: [string, string][] = [
  ['Marca', 'Inner Bible'],
  ['Razón social', 'Garden Technology'],
  ['CNPJ', '35.180.772/0001-37'],
  ['País', 'Brasil'],
  ['Sitio web', 'innerbible.app'],
]

export default function Institucional() {
  return (
    <div className="min-h-dvh bg-bg text-ink">
      <main className="mx-auto max-w-2xl px-5 pb-16 pt-12 sm:pt-20">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold">Garden Technology</p>
        <h1 className="mt-2 font-serif text-[40px] font-semibold leading-tight sm:text-[48px]">Inner Bible</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-text">
          Inner Bible es la línea de aplicaciones cristianas de Garden Technology. Creamos materiales de estudio bíblico para personas que quieren entender la
          Biblia con claridad, en un lenguaje sencillo, en su propio idioma y en un formato que se puede seguir desde el teléfono.
        </p>

        <h2 className="mt-12 font-serif text-[24px] font-semibold">Nuestras aplicaciones</h2>
        <ul className="mt-4 space-y-3">
          {APPS.map((a) => (
            <li key={a.name}>
              <a
                href={a.href}
                className="flex items-start gap-4 rounded-3xl border border-line bg-surface p-5 shadow-card transition hover:bg-surface-hover"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-serif text-[20px] font-semibold">{a.name}</span>
                    <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gold">{a.lang}</span>
                  </span>
                  <span className="mt-1.5 block text-[15.5px] leading-relaxed text-text">{a.text}</span>
                  <span className="mt-2 block text-[14px] font-semibold text-primary">{a.host} →</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 font-serif text-[24px] font-semibold">Qué hacemos</h2>
        <p className="mt-3 text-[16.5px] leading-relaxed text-text">
          Desarrollamos cursos, guías y aplicaciones de estudio bíblico. Nuestro producto principal en español es el Estudio Cronológico de la Biblia: la historia
          bíblica completa presentada en el orden en que los hechos ocurrieron, con líneas de tiempo, mapas y lecciones de cada libro.
        </p>
        <p className="mt-3 text-[16.5px] leading-relaxed text-text">
          Todo el contenido se produce y se distribuye en formato digital. Los materiales se entregan a través de nuestras aplicaciones y el soporte al cliente se
          realiza por los canales indicados en cada compra.
        </p>

        <h2 className="mt-12 font-serif text-[24px] font-semibold">Quiénes somos</h2>
        <p className="mt-3 text-[16.5px] leading-relaxed text-text">
          Garden Technology es una empresa brasileña de tecnología que desarrolla productos digitales. Inner Bible es su línea dedicada al público cristiano, en
          varios idiomas, y responde por la creación, la venta y el soporte de todos los productos publicados bajo esta marca.
        </p>

        <h2 className="mt-12 font-serif text-[24px] font-semibold">Datos de la empresa</h2>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-[16px]">
          {COMPANY.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="font-semibold">{k}</dt>
              <dd className="text-text">{v}</dd>
            </div>
          ))}
        </dl>
      </main>
      <footer className="border-t border-line bg-surface-2 px-5 py-5 text-center text-[13.5px] text-muted">
        © {new Date().getFullYear()} Inner Bible · Garden Technology · CNPJ 35.180.772/0001-37
      </footer>
    </div>
  )
}
