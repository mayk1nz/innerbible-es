import { PUSH_PUBLIC_KEY } from './config'

// Reminders on this device (morning and night, in the member's own time): ask permission,
// subscribe the browser, tell the server — with the phone's time zone.

export type PushState = 'on' | 'off' | 'blocked' | 'install-first' | 'unsupported'

function isIos(): boolean {
  const ua = navigator.userAgent
  return /iPhone|iPad|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1)
}

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true
}

function keyBytes(base64url: string): Uint8Array<ArrayBuffer> {
  const pad = '='.repeat((4 - (base64url.length % 4)) % 4)
  const raw = atob((base64url + pad).replace(/-/g, '+').replace(/_/g, '/'))
  const out = new Uint8Array(new ArrayBuffer(raw.length))
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}

async function registration(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null
  return (await navigator.serviceWorker.getRegistration()) ?? null
}

export async function pushState(): Promise<PushState> {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) return isIos() && !isStandalone() ? 'install-first' : 'unsupported'
  // iPhone only allows notifications for the app installed on the home screen.
  if (isIos() && !isStandalone()) return 'install-first'
  if (!('PushManager' in window)) return 'unsupported'
  if (Notification.permission === 'denied') return 'blocked'
  const reg = await registration()
  const sub = await reg?.pushManager.getSubscription()
  return sub ? 'on' : 'off'
}

export async function enablePush(): Promise<PushState> {
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return permission === 'denied' ? 'blocked' : 'off'
  const reg = (await registration()) ?? (await navigator.serviceWorker.register('/sw.js'))
  await navigator.serviceWorker.ready
  const sub = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(PUSH_PUBLIC_KEY) }))
  const res = await saveSubscription(sub)
  if (!res.ok) throw new Error('save-failed')
  return 'on'
}

function timeZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return undefined
  }
}

function saveSubscription(sub: PushSubscription): Promise<Response> {
  return fetch('/api/push', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...sub.toJSON(), tz: timeZone() }) })
}

/**
 * On each visit with reminders on: tell the server this device's current time zone (it
 * may have changed, or been saved before time zones were sent).
 */
export async function refreshPush(): Promise<void> {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || Notification.permission !== 'granted') return
    const sub = await (await registration())?.pushManager.getSubscription()
    if (sub) await saveSubscription(sub)
  } catch {
    // offline: next visit
  }
}

export async function disablePush(): Promise<PushState> {
  const reg = await registration()
  const sub = await reg?.pushManager.getSubscription()
  if (sub) {
    await fetch('/api/push', { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ endpoint: sub.endpoint }) }).catch(() => {})
    await sub.unsubscribe()
  }
  return 'off'
}

/** Looks for a newer version of the app, then reloads the page. */
export async function updateApp(): Promise<void> {
  try {
    const reg = await registration()
    await reg?.update()
  } catch {
    // no service worker (e.g. not installed): a reload is enough
  }
  window.location.reload()
}
