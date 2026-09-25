// KashPay webhook — CAPTURE PHASE. KashPay has no public docs for the payload or the
// signature, so for now this endpoint only acknowledges every event and writes it to
// the Vercel runtime logs (search "kashpay-webhook"), so the real format can be read
// before access is granted from it. Nothing is unlocked yet.
// Next step: store events in the database, verify the signature with
// KASHPAY_WEBHOOK_SECRET and grant/revoke access by e-mail + product.

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const raw = await request.text()
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    // Everything except cookies/auth, which KashPay has no reason to send.
    if (key !== 'cookie' && key !== 'authorization') headers[key] = value
  })
  let body: unknown = raw
  try {
    body = JSON.parse(raw)
  } catch {
    // not JSON: keep the text as it came
  }
  console.log('kashpay-webhook', JSON.stringify({ receivedAt: new Date().toISOString(), headers, body }))
  return Response.json({ ok: true })
}

/** Lets a browser (or KashPay's URL check) see the endpoint is alive. */
export async function GET() {
  return Response.json({ ok: true, endpoint: 'kashpay-webhook' })
}
