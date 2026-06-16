import { describe, it, expect } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { recordHitAndCheckLimit, isOverSupabaseRateLimit, RATE_LIMIT } from "./rate-limit";

describe("recordHitAndCheckLimit", () => {
  it("allows up to the max, then blocks", () => {
    const ip = "unit-test-allow";
    let blocked = false;
    for (let i = 0; i < RATE_LIMIT.max; i++) blocked = recordHitAndCheckLimit(ip);
    expect(blocked).toBe(false); // the max-th hit is at the limit, not over it
    expect(recordHitAndCheckLimit(ip)).toBe(true); // one more is over
  });

  it("tracks each IP independently", () => {
    expect(recordHitAndCheckLimit("unit-test-a")).toBe(false);
    expect(recordHitAndCheckLimit("unit-test-b")).toBe(false);
  });
});

describe("isOverSupabaseRateLimit", () => {
  const fakeClient = (impl: () => Promise<{ data: unknown; error: unknown }>) =>
    ({ rpc: impl } as unknown as SupabaseClient);

  it("returns the RPC verdict when over the limit", async () => {
    const client = fakeClient(async () => ({ data: true, error: null }));
    expect(await isOverSupabaseRateLimit(client, "k")).toBe(true);
  });

  it("returns false when under the limit", async () => {
    const client = fakeClient(async () => ({ data: false, error: null }));
    expect(await isOverSupabaseRateLimit(client, "k")).toBe(false);
  });

  it("fails open when the RPC errors", async () => {
    const client = fakeClient(async () => ({ data: null, error: { code: "XX000" } }));
    expect(await isOverSupabaseRateLimit(client, "k")).toBe(false);
  });
});
