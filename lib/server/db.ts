import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// The server's only way into the database: the service role, which bypasses RLS.
// Never imported by client code ('server-only' fails the build if it is).

let client: SupabaseClient | null = null

export function db(): SupabaseClient {
  if (client) return client
  // First token only: a value pasted twice (or with a line break) must not break headers.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().split(/\s+/)[0]
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim().split(/\s+/)[0]
  if (!url || !key) throw new Error('Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)')
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  return client
}
