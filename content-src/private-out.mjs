// Where the content builds publish the paid texts: content-private/<kind>/, read only by
// the server (lib/server/content.ts → /api/content, which checks the purchase). Never
// lib/content: whatever the app imports from there ends up in its public JavaScript.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const PRIVATE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'content-private')

/** content-private/<...parts>, created and emptied of old .json files (a full publish rewrites it). */
export function privateDir(...parts) {
  const dir = path.join(PRIVATE, ...parts)
  fs.mkdirSync(dir, { recursive: true })
  for (const f of fs.readdirSync(dir)) if (f.endsWith('.json')) fs.rmSync(path.join(dir, f))
  return dir
}

/** Removes texts an older build left in lib/content (they must not be bundled). */
export function dropLegacyJson(dir, keep = []) {
  if (!fs.existsSync(dir)) return
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f)
    if (fs.statSync(full).isDirectory()) dropLegacyJson(full, keep)
    else if (f.endsWith('.json') && !keep.includes(f)) fs.rmSync(full)
  }
}
