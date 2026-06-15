import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_TIMEOUT_MS,
  SUPABASE_URL,
  isPublicConfigured,
} from "./env";
import { createTimeoutFetch } from "./fetch";

let cached: SupabaseClient | null = null;

/**
 * Public (anon) Supabase client for reading RLS-protected public data such as
 * the published gallery. Returns `null` when env vars are not yet configured,
 * letting callers fall back to seed data instead of crashing.
 */
export function getPublicSupabase(): SupabaseClient | null {
  if (!isPublicConfigured()) return null;
  if (cached) return cached;

  cached = createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string, {
    auth: { persistSession: false },
    global: { fetch: createTimeoutFetch(SUPABASE_TIMEOUT_MS) },
  });
  return cached;
}
