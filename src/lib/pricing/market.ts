/**
 * Live market signal for wood materials. There is no public per-SKU retail API
 * for Denver hardwood/plywood, so the honest "live" input is the CME Lumber
 * Futures price (symbol LBR=F, USD per 1,000 board feet). We pull it live,
 * damp it (retail moves ~half as much as futures), clamp it, and apply the
 * resulting factor only to `marketLinked` (wood) rate rows. The maintained
 * rate table remains the verified baseline; on any fetch failure we fall back
 * to factor 1.0 and flag the estimate `stale`.
 *
 * This module is the impure data layer (network + Date.now + a process cache).
 * The pricing engine itself stays pure and receives the factor as a number.
 */

import "server-only";
import { withRetry } from "@/lib/retry";
import type { MarketInfo } from "./types";

export const LUMBER_SYMBOL = "LBR=F";
/** Lumber-futures level the 2025 baseline rate table assumes (USD/1,000 bf). */
export const BASELINE_LUMBER_INDEX = 630;
/** Retail hardwood/plywood moves roughly half as much as futures. */
export const MARKET_DAMPING = 0.5;
export const MARKET_CLAMP = { min: 0.85, max: 1.25 } as const;

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6h
const FETCH_TIMEOUT_MS = 8000;

export type IndexQuote = { price: number; asOf: string };
export type IndexFetcher = () => Promise<IndexQuote>;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
function round4(n: number): number {
  return Math.round(n * 1e4) / 1e4;
}

/** Fetch the latest CME lumber-futures price (keyless Yahoo chart endpoint). */
export async function fetchLumberIndex(timeoutMs = FETCH_TIMEOUT_MS): Promise<IndexQuote> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${LUMBER_SYMBOL}?interval=1d&range=5d`,
      {
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0 (CruzCarpentry pricing engine)" },
        cache: "no-store",
      },
    );
    if (!res.ok) throw new Error(`lumber index HTTP ${res.status}`);
    const json: unknown = await res.json();
    const meta = (json as { chart?: { result?: Array<{ meta?: { regularMarketPrice?: unknown; regularMarketTime?: unknown } }> } })
      ?.chart?.result?.[0]?.meta;
    const price = meta?.regularMarketPrice;
    if (typeof price !== "number" || !(price > 0)) throw new Error("lumber index: missing price");
    const ts = meta?.regularMarketTime;
    const asOf =
      typeof ts === "number" ? new Date(ts * 1000).toISOString() : new Date().toISOString();
    return { price, asOf };
  } finally {
    clearTimeout(timer);
  }
}

/** Pure: damped, clamped factor from an index value. */
export function computeMarketFactor(indexValue: number, baseline = BASELINE_LUMBER_INDEX): number {
  const raw = 1 + MARKET_DAMPING * (indexValue / baseline - 1);
  return round4(clamp(raw, MARKET_CLAMP.min, MARKET_CLAMP.max));
}

let cache: { info: MarketInfo; at: number } | null = null;

/**
 * Resolve the live wood-material market factor. Cached in-process for 6h;
 * fails open to a neutral (1.0) factor flagged `stale`. `fetcher` is injectable
 * for tests; `force` bypasses the cache.
 */
export async function getMarketFactor(opts?: {
  fetcher?: IndexFetcher;
  ttlMs?: number;
  force?: boolean;
  now?: number;
}): Promise<MarketInfo> {
  const ttl = opts?.ttlMs ?? CACHE_TTL_MS;
  const now = opts?.now ?? Date.now();
  if (!opts?.force && cache && now - cache.at < ttl) return cache.info;

  try {
    const quote = await withRetry(() => (opts?.fetcher ?? fetchLumberIndex)(), {
      retries: 1,
      delayMs: 400,
    });
    const info: MarketInfo = {
      factor: computeMarketFactor(quote.price),
      source: `CME Lumber Futures (${LUMBER_SYMBOL})`,
      asOf: quote.asOf,
      stale: false,
      indexValue: quote.price,
    };
    cache = { info, at: now };
    return info;
  } catch {
    return { factor: 1, source: "fallback (baseline rate table)", asOf: null, stale: true };
  }
}

/** Test helper: reset the process cache. */
export function __clearMarketCache(): void {
  cache = null;
}
