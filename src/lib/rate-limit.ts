import type { SupabaseClient } from "@supabase/supabase-js";
import { withRetry } from "@/lib/retry";

/** 5 submissions per 10 minutes per client IP. */
export const RATE_LIMIT = { max: 5, windowMs: 10 * 60_000 } as const;
const WINDOW_SECONDS = RATE_LIMIT.windowMs / 1000;
const MAX_TRACKED_IPS = 10_000;

// Per-instance counter. Resets on cold start and is NOT shared across serverless
// instances, so it's only a cheap first gate in front of the Supabase limiter.
const recentHits = new Map<string, number[]>();

/**
 * In-memory L1 limiter: records the hit and returns true if `ip` is now over the
 * limit. The name makes the mutation explicit (it is not a pure predicate).
 */
export function recordHitAndCheckLimit(ip: string): boolean {
  const now = Date.now();
  const recent = (recentHits.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT.windowMs,
  );
  recent.push(now);
  recentHits.set(ip, recent);

  // Bound memory: drop entries whose timestamps have all aged out of the window.
  if (recentHits.size > MAX_TRACKED_IPS) {
    for (const [key, hits] of recentHits) {
      if (hits.every((t) => now - t >= RATE_LIMIT.windowMs)) {
        recentHits.delete(key);
      }
    }
  }

  return recent.length > RATE_LIMIT.max;
}

/**
 * Shared L2 limiter backed by Supabase (the `check_rate_limit` RPC), so the cap
 * holds across all serverless instances. Records the hit and returns true if the
 * key is now over the limit. **Fails open** (returns false) if the check errors,
 * so a limiter outage never blocks a real lead — the honeypot + L1 remain.
 */
export async function isOverSupabaseRateLimit(
  supabase: SupabaseClient,
  key: string,
): Promise<boolean> {
  try {
    return await withRetry(
      async () => {
        const { data, error } = await supabase.rpc("check_rate_limit", {
          p_key: key,
          p_max: RATE_LIMIT.max,
          p_window_seconds: WINDOW_SECONDS,
        });
        if (error) throw error;
        return data === true;
      },
      { retries: 1, delayMs: 200 },
    );
  } catch (error) {
    const code = (error as { code?: string } | null)?.code;
    console.error(
      `[rate-limit] shared check failed (code=${code ?? "?"}) — failing open`,
    );
    return false;
  }
}
