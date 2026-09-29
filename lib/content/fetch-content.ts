// The paid texts (Estudio lessons, guides, mind maps, children's stories, listening
// guides, plan days) are not part of the app's JavaScript: they live in content-private/
// on the server and come from /api/content/<kind>/<id>, which checks the session and the
// purchase. Here, each text is fetched once per visit and kept in memory; a failed fetch
// is tried again the next time the lesson opens.

const memo = new Map<string, Promise<unknown>>()

/** The text at /api/content/<path>; null when it does not exist (not written yet). */
export function fetchContent<T>(path: string): Promise<T | null> {
  let p = memo.get(path) as Promise<T | null> | undefined
  if (!p) {
    p = fetch(`/api/content/${path}`, { credentials: 'same-origin' }).then(async (res) => {
      if (res.status === 404) return null
      if (!res.ok) throw new Error(`content ${res.status}`)
      return (await res.json()) as T
    })
    memo.set(path, p)
    p.catch(() => memo.delete(path))
  }
  return p
}

/** Forgets the texts kept in memory (on sign-out: the next account fetches its own). */
export function clearContentCache(): void {
  memo.clear()
}
