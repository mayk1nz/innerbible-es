import { NextResponse, type NextRequest } from 'next/server'

// Page addresses are all lowercase, but people (and settings pasted into KashPay) may
// type capitals, e.g. /palabras-del-Senor. Send any such address to its lowercase
// page, keeping the query string intact — KashPay's `ks` parameter must survive.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  // The bare domain innerbible.app: our company page at "/", and the English app (which
  // lives at www.innerbible.app) for /en and for any old link to it.
  const host = (request.headers.get('host') ?? '').split(':')[0].toLowerCase()
  if (host === 'innerbible.app') {
    if (pathname === '/') return NextResponse.rewrite(new URL('/institucional', request.url))
    const path = pathname === '/en' || pathname.startsWith('/en/') ? pathname.slice(3) || '/' : pathname
    return NextResponse.redirect(`https://www.innerbible.app${path}${search}`, 308)
  }
  const lower = pathname.toLowerCase()
  if (lower === pathname) return NextResponse.next()
  const url = request.nextUrl.clone()
  url.pathname = lower
  return NextResponse.redirect(url, 308)
}

export const config = {
  // Pages only: not assets, images, API routes or files with an extension.
  matcher: ['/((?!_next/|api/|funil/|icons/|.*\\..*).*)'],
}
