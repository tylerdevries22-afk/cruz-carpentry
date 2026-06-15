/**
 * Public Supabase configuration. These values are safe to expose to the
 * browser and are inlined at build time via the `NEXT_PUBLIC_` prefix.
 *
 * The secret service-role key is intentionally NOT read here — it lives only
 * in `server.ts`, which is guarded by `server-only`.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Network timeout for every Supabase request, in milliseconds. Kept low enough
 * that timeout + one retry stays under typical serverless limits (4s × 2
 * attempts + backoff ≈ 8.4s < Vercel's 10s default), so the Server Action can
 * still return its friendly error instead of being killed by the platform.
 */
export const SUPABASE_TIMEOUT_MS = 4_000;

/**
 * Whether the public (anon) client can be constructed. When false, callers
 * fall back to seed data so the site still renders before keys are set.
 */
export function isPublicConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
