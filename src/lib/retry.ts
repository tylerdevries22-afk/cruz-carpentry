/**
 * Run an async operation with a bounded number of retries and a fixed backoff.
 * Used to harden external (Supabase) calls per the project resilience standard:
 * every network call gets a timeout (see `supabase/fetch.ts`) and at least one
 * retry.
 *
 * `shouldRetry` lets callers skip retries for permanent failures (e.g. a
 * constraint violation) where a second attempt is pointless. Defaults to
 * retrying every error.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  {
    retries = 1,
    delayMs = 300,
    shouldRetry = () => true,
  }: {
    retries?: number;
    delayMs?: number;
    shouldRetry?: (error: unknown) => boolean;
  } = {},
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < retries && shouldRetry(error)) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        break;
      }
    }
  }

  throw lastError;
}

/**
 * True when a Postgres/PostgREST error is permanent (retrying won't help):
 * data exceptions (22xxx), integrity-constraint violations (23xxx), and
 * syntax/access errors (42xxx). Everything else (timeouts, network blips,
 * 5xx) is treated as transient and worth retrying.
 */
export function isPermanentDbError(error: unknown): boolean {
  const code = (error as { code?: unknown } | null)?.code;
  return typeof code === "string" && /^(22|23|42)/.test(code);
}
