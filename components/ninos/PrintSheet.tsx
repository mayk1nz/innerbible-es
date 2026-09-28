'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Icon } from '../icons'
import { useHistoria } from './NinosStory'
import { APP } from '@/lib/config'
import type { Banda } from '@/lib/content/ninos/types'
import { crearSopa, limpiar } from '@/lib/ninos-sopa'
import { lessonHref } from '@/lib/progress'

// The page to print at home (black and white, clean lines, no solid backgrounds):
// the activity, the verse card for the fridge, "my prayer", and the answers with the
// three questions for the grown-up. "Imprimir" opens the phone's own print dialog, which
// also saves it as a PDF.

export function PrintSheet({ id }: { id: string }) {
  const h = useHistoria(id)
  const [banda] = useState<Banda>(() => {
    const e = new URLSearchParams(window.location.search).get('edad')
    return e === '3-5' || e === '9-12' ? e : '6-8'
  })
  if (h === undefined) return <div aria-busy className="h-72 animate-pulse rounded-3xl bg-surface-2" />
  if (h === null) return <p className="text-muted">Esta historia todavía no está lista.</p>

  const sopaJuego = h.juegos.find((j) => j.tipo === 'sopa')
  const sopa = sopaJuego && sopaJuego.tipo === 'sopa' ? crearSopa(sopaJuego.niveles[banda].tamano, sopaJuego.niveles[banda].palabras, sopaJuego.niveles[banda].diagonales, sopaJuego.niveles[banda].seed) : null
  const ordenar = h.juegos.find((j) => j.tipo === 'ordenar')
  const verso = h.versiculo[banda]

  return (
    <div className="print-sheet text-black">
      <div className="no-print mb-5 flex items-center gap-2">
        <Link href={lessonHref('actividades-ninos', h.id)} className="grid size-11 place-items-center rounded-full text-ink hover:bg-surface" aria-label="Volver">
          <Icon name="arrowLeft" className="size-6" />
        </Link>
        <button type="button" onClick={() => window.print()} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-white">
          <Icon name="download" className="size-5 text-gold-bright" />
          Imprimir o guardar como PDF
        </button>
      </div>

      <div className="rounded-2xl border-2 border-black bg-white p-5">
        <div className="flex justify-between gap-4 border-b-2 border-black pb-2 text-[15px]">
          <span>Nombre: ______________________</span>
          <span>Fecha: ___________</span>
        </div>
        <h1 className="mt-4 font-serif text-[26px] font-bold">{h.titulo}</h1>
        <p className="text-[14px]">{h.referencia}</p>

        {sopa ? (
          <section className="mt-5">
            <h2 className="font-serif text-[19px] font-bold">Sopa de letras</h2>
            <p className="text-[14px]">Encuentra estas palabras: {sopa.colocadas.map((w) => limpiar(w.palabra)).join(' · ')}</p>
            <table className="mx-auto mt-3 border-collapse">
              <tbody>
                {sopa.grid.map((row, r) => (
                  <tr key={r}>
                    {row.map((l, c) => (
                      <td key={c} className="size-8 border border-black text-center font-sans text-[17px] font-bold">
                        {l}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : ordenar && ordenar.tipo === 'ordenar' ? (
          <section className="mt-5">
            <h2 className="font-serif text-[19px] font-bold">Recorta y ordena la historia</h2>
            <div className="mt-3 grid gap-2">
              {[...ordenar.niveles[banda].items].sort((a, b) => a.localeCompare(b)).map((t) => (
                <div key={t} className="border-2 border-dashed border-black p-3 text-[16px]">
                  ✂ {t}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="border-2 border-black p-4 text-center">
            <p className="text-[12px] font-bold uppercase tracking-wide">Guarda en tu corazón</p>
            <p className="mt-2 font-serif text-[19px] font-bold leading-snug">«{verso.texto}»</p>
            <p className="mt-1 text-[13px]">{verso.referencia}</p>
          </div>
          <div className="border-2 border-black p-4">
            <p className="text-[12px] font-bold uppercase tracking-wide">Mi oración (dibuja o escribe)</p>
            <div className="mt-2 h-28" />
          </div>
        </section>

        <section className="mt-6 border-t-2 border-black pt-3 text-[14px]">
          <p className="font-bold">Para el adulto</p>
          <ol className="mt-1 list-decimal pl-5">
            <li>{h.padres.preguntas.recordar}</li>
            <li>{h.padres.preguntas.sentir}</li>
            <li>{h.padres.preguntas.vivir}</li>
          </ol>
          {ordenar && ordenar.tipo === 'ordenar' && (
            <p className="mt-2">
              <span className="font-bold">Orden correcto: </span>
              {ordenar.niveles[banda].items.map((t, i) => `${i + 1}. ${t}`).join('  ')}
            </p>
          )}
        </section>
        <p className="mt-4 text-center text-[11px]">{APP.name}</p>
      </div>
    </div>
  )
}
