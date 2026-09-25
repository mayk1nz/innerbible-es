/** "¿Por qué la Biblia…?" → "por-que-la-biblia". Stable ids for lessons. */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Accent- and case-insensitive form for search ("Génesis" matches "genesis"). */
export function normalize(input: string): string {
  return input.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

/** "maria.lopez82@gmail.com" → "Maria". Used until the member sets a name. */
export function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? ''
  const word = local.split(/[._+\-\d]+/).find((w) => w.length > 1) ?? ''
  if (!word) return 'Hermano'
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

export function initial(name: string): string {
  return (name.trim().charAt(0) || '?').toUpperCase()
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`
}

export function timeAgo(minutes: number): string {
  if (minutes < 1) return 'ahora'
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'ayer'
  if (days < 7) return `hace ${days} días`
  const weeks = Math.floor(days / 7)
  return weeks === 1 ? 'hace 1 semana' : `hace ${weeks} semanas`
}
