import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-5">
      <div className="max-w-sm text-center">
        <p className="font-serif text-[28px] font-semibold text-ink">No encontramos esta página</p>
        <p className="mt-2 text-[16px] text-muted">Puede que el enlace haya cambiado.</p>
        <Link href="/inicio" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-primary px-6 font-semibold text-white">
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
