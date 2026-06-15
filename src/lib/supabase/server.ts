import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_TIMEOUT_MS, SUPABASE_URL } from "./env";
import { createTimeoutFetch } from "./fetch";

// Secret service-role key. Read only in this server-only module so it is never
// bundled for the browser.
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let cached: SupabaseClient | null = null;

/** Whether the privileged service-role client can be constructed. */
export function isServiceConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);
}

/**
 * Privileged Supabase client used by Server Actions to write data (e.g. insert
 * leads) while bypassing RLS. NEVER import this into a Client Component.
 * Returns `null` when env vars are not yet configured.
 */
export function getServiceSupabase(): SupabaseClient | null {
  if (!isServiceConfigured()) return null;
  if (cached) return cached;

  cached = createClient(SUPABASE_URL as string, SERVICE_ROLE_KEY as string, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: createTimeoutFetch(SUPABASE_TIMEOUT_MS) },
  });
  return cached;
}
