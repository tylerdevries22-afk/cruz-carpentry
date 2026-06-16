import { afterEach, describe, expect, it, vi } from "vitest";
import {
  BASELINE_LUMBER_INDEX,
  MARKET_CLAMP,
  __clearMarketCache,
  computeMarketFactor,
  fetchLumberIndex,
  getMarketFactor,
} from "./market";

afterEach(() => {
  __clearMarketCache();
  vi.unstubAllGlobals();
});

describe("computeMarketFactor", () => {
  it("is 1.0 at the baseline", () => {
    expect(computeMarketFactor(BASELINE_LUMBER_INDEX)).toBe(1);
  });
  it("damps moves (half of the futures swing)", () => {
    // +20% futures → +10% factor (damping 0.5)
    expect(computeMarketFactor(BASELINE_LUMBER_INDEX * 1.2)).toBeCloseTo(1.1, 5);
    expect(computeMarketFactor(BASELINE_LUMBER_INDEX * 0.8)).toBeCloseTo(0.9, 5);
  });
  it("clamps extreme swings", () => {
    expect(computeMarketFactor(BASELINE_LUMBER_INDEX * 5)).toBe(MARKET_CLAMP.max);
    expect(computeMarketFactor(1)).toBe(MARKET_CLAMP.min);
  });
});

describe("getMarketFactor", () => {
  it("uses the live quote when the fetch succeeds", async () => {
    const info = await getMarketFactor({
      force: true,
      fetcher: async () => ({ price: BASELINE_LUMBER_INDEX * 1.2, asOf: "2026-06-16T00:00:00Z" }),
    });
    expect(info.stale).toBe(false);
    expect(info.source).toContain("CME Lumber Futures");
    expect(info.indexValue).toBe(BASELINE_LUMBER_INDEX * 1.2);
    expect(info.factor).toBeCloseTo(1.1, 4);
  });

  it("fails open to a neutral, stale factor when the fetch throws", async () => {
    const info = await getMarketFactor({
      force: true,
      fetcher: async () => {
        throw new Error("network down");
      },
    });
    expect(info.factor).toBe(1);
    expect(info.stale).toBe(true);
    expect(info.source).toContain("fallback");
    expect(info.asOf).toBeNull();
  });

  it("serves from cache within the TTL", async () => {
    const fetcher = vi.fn(async () => ({ price: BASELINE_LUMBER_INDEX, asOf: "2026-06-16T00:00:00Z" }));
    await getMarketFactor({ force: true, fetcher, now: 1000 });
    await getMarketFactor({ fetcher, now: 1000 + 60_000 }); // within 6h TTL
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});

describe("fetchLumberIndex", () => {
  it("parses the Yahoo chart payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          chart: { result: [{ meta: { regularMarketPrice: 642.5, regularMarketTime: 1750000000 } }] },
        }),
      })) as unknown as typeof fetch,
    );
    const q = await fetchLumberIndex();
    expect(q.price).toBe(642.5);
    expect(typeof q.asOf).toBe("string");
  });

  it("throws on a malformed payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => ({ chart: { result: [] } }) })) as unknown as typeof fetch,
    );
    await expect(fetchLumberIndex()).rejects.toThrow();
  });
});
