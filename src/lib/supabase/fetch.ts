/**
 * A `fetch` wrapper that aborts a request after `timeoutMs`. Injected into the
 * Supabase clients as `global.fetch` so no Supabase request can hang
 * indefinitely.
 */
export function createTimeoutFetch(timeoutMs: number): typeof fetch {
  return async (input, init) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(input, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  };
}
