/**
 * Supabase project URL. Read here (NEXT_PUBLIC_ so it's available at build),
 * but the secret service-role key is read only in `server.ts`, which is
 * guarded by `server-only`. The estimate form is the only Supabase consumer;
 * the gallery is served from local assets.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * Network timeout for every Supabase request, in milliseconds. Kept low enough
 * that timeout + one retry stays under typical serverless limits (4s × 2
 * attempts + backoff ≈ 8.4s < Vercel's 10s default), so the Server Action can
 * still return its friendly error instead of being killed by the platform.
 */
export const SUPABASE_TIMEOUT_MS = 4_000;
