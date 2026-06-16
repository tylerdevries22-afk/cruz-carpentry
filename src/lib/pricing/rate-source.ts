/**
 * Loads the active rate snapshot from the DB so material/labor rates are
 * editable WITHOUT a deploy. `pricing_config.overrides` is a PARTIAL snapshot
 * (any subset of fields) deep-merged over the in-code SEED_SNAPSHOT, so an
 * admin can tweak one number (e.g. labor.shop.premium) without restating the
 * whole table. Cached in-process; fails open to the seed on any error/empty.
 */

import "server-only";
import { getServiceSupabase, isServiceConfigured } from "@/lib/supabase/server";
import { SEED_SNAPSHOT, type RateSnapshot } from "./rates";

type Source = "db" | "seed";
type Json = Record<string, unknown>;

function isObj(v: unknown): v is Json {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Deep-merge a partial override onto a base; override leaves win. */
function deepMerge<T>(base: T, override: unknown): T {
  if (!isObj(override)) return base;
  const out: Json = { ...(base as unknown as Json) };
  for (const [k, v] of Object.entries(override)) {
    out[k] = isObj(v) && isObj(out[k]) ? deepMerge(out[k], v) : v;
  }
  return out as unknown as T;
}

const TTL_MS = 10 * 60 * 1000;
let cache: { snapshot: RateSnapshot; source: Source; at: number } | null = null;

export async function loadRateSnapshot(opts?: {
  force?: boolean;
  now?: number;
}): Promise<{ snapshot: RateSnapshot; source: Source }> {
  const now = opts?.now ?? Date.now();
  if (!opts?.force && cache && now - cache.at < TTL_MS) {
    return { snapshot: cache.snapshot, source: cache.source };
  }
  const seed = (): { snapshot: RateSnapshot; source: Source } => {
    const r = { snapshot: SEED_SNAPSHOT, source: "seed" as const };
    cache = { ...r, at: now };
    return r;
  };
  if (!isServiceConfigured()) return seed();
  const supabase = getServiceSupabase();
  if (!supabase) return seed();
  try {
    const { data, error } = await supabase
      .from("pricing_config")
      .select("overrides")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    const overrides = (data as { overrides?: unknown } | null)?.overrides;
    if (!isObj(overrides) || Object.keys(overrides).length === 0) return seed();
    const snapshot = deepMerge(SEED_SNAPSHOT, overrides);
    const r = { snapshot, source: "db" as const };
    cache = { ...r, at: now };
    return r;
  } catch {
    return seed();
  }
}

/** Test helper: reset the process cache. */
export function __clearRateCache(): void {
  cache = null;
}
