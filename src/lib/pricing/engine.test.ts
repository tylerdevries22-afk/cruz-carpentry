import { describe, expect, it } from "vitest";
import {
  boardFeet,
  cubicInches,
  estimate,
  linearFeet,
  sheetCount,
  squareFeet,
  squareInches,
} from "./engine";
import { SEED_SNAPSHOT } from "./rates";
import type { EstimateInput } from "./types";

describe("geometry primitives", () => {
  it("computes square inches and feet", () => {
    expect(squareInches(48, 36)).toBe(1728);
    expect(squareFeet(48, 36)).toBe(12);
  });
  it("computes cubic inches and linear feet", () => {
    expect(cubicInches(24, 24, 12)).toBe(6912);
    expect(linearFeet(144)).toBe(12);
  });
  it("computes board feet", () => {
    // 1in × 12in × 12in = 1 bf
    expect(boardFeet(1, 12, 12)).toBe(1);
    // 8/4 (2in) × 6in × 96in / 144 = 8 bf
    expect(boardFeet(2, 6, 96)).toBe(8);
  });
  it("rounds sheet count up with waste", () => {
    // 60 sf × 1 × 1.12 / 32 = 2.1 → 3 sheets
    expect(sheetCount(60, 1, 1.12)).toBe(3);
    expect(sheetCount(0, 1, 1.12)).toBe(0);
    expect(sheetCount(32, 1, 1)).toBe(1);
  });
});

const premiumBuiltIn: EstimateInput = {
  projectType: "built_in_shelving",
  tier: "premium",
  finish: "stained",
  complexity: "moderate",
  access: "moderate",
  distanceMiles: 15,
  mobilizations: 2,
  areas: [
    { label: "Main wall", widthIn: 144, heightIn: 108, depthIn: 16, linearFeet: 12, numShelves: 6, numDoors: 4, numDrawers: 2 },
  ],
};

describe("estimate()", () => {
  it("produces a sane range for a Premium built-in", () => {
    const r = estimate(premiumBuiltIn, 1);
    expect(r.point).toBeGreaterThan(6000);
    expect(r.point).toBeLessThan(16000);
    expect(r.low).toBeLessThan(r.point);
    expect(r.high).toBeGreaterThan(r.point);
    // breakdown roughly sums to the pre-floor point
    const b = r.breakdown;
    const sum = b.subtotal + b.marginApplied + b.rushFee + b.riskBuffer;
    expect(Math.abs(sum - r.point)).toBeLessThan(30); // rounding tolerance
    expect(b.material).toBeGreaterThan(0);
    expect(b.labor).toBeGreaterThan(0);
  });

  it("is deterministic", () => {
    expect(estimate(premiumBuiltIn, 1.05)).toEqual(estimate(premiumBuiltIn, 1.05));
  });

  it("uses the seed snapshot by default and honors a DB-style override", () => {
    const base = estimate(premiumBuiltIn, 1);
    const baseAgain = estimate(premiumBuiltIn, 1, SEED_SNAPSHOT);
    expect(baseAgain.point).toBe(base.point); // default param === seed snapshot

    const bumped = structuredClone(SEED_SNAPSHOT);
    bumped.labor.shop.premium *= 1.5;
    bumped.labor.install.premium *= 1.5;
    const withOverride = estimate(premiumBuiltIn, 1, bumped);
    expect(withOverride.breakdown.labor).toBeGreaterThan(base.breakdown.labor);
    expect(withOverride.point).toBeGreaterThan(base.point);
  });

  it("raises wood material + point when the market factor rises", () => {
    const base = estimate(premiumBuiltIn, 1.0);
    const hot = estimate(premiumBuiltIn, 1.2);
    expect(hot.breakdown.material).toBeGreaterThan(base.breakdown.material);
    expect(hot.point).toBeGreaterThan(base.point);
    // hardware is not market-linked, so it must not move
    expect(hot.breakdown.hardware).toBe(base.breakdown.hardware);
  });

  it("applies the rush multiplier for fast_quality priority", () => {
    const normal = estimate(premiumBuiltIn, 1);
    const rush = estimate({ ...premiumBuiltIn, priority: "fast_quality" }, 1);
    expect(rush.point).toBeGreaterThan(normal.point);
    expect(rush.breakdown.rushFee).toBeGreaterThan(0);
  });

  it("discounts for the price_quality (flexible) priority", () => {
    const normal = estimate(premiumBuiltIn, 1);
    const flex = estimate({ ...premiumBuiltIn, priority: "price_quality" }, 1);
    expect(flex.point).toBeLessThan(normal.point);
    expect(flex.breakdown.rushFee).toBeLessThan(0);
  });

  it("escalates tier pricing essential < premium < signature", () => {
    const e = estimate({ ...premiumBuiltIn, tier: "essential" }, 1).point;
    const p = estimate({ ...premiumBuiltIn, tier: "premium" }, 1).point;
    const s = estimate({ ...premiumBuiltIn, tier: "signature" }, 1).point;
    expect(e).toBeLessThan(p);
    expect(p).toBeLessThan(s);
  });

  it("charges no finishing for a raw/unfinished build", () => {
    const r = estimate({ ...premiumBuiltIn, finish: "raw_unfinished" }, 1);
    expect(r.breakdown.finishing).toBe(0);
  });

  it("applies the minimum project fee and low confidence with no measurements", () => {
    const r = estimate(
      { projectType: "other", tier: "essential", finish: "painted", areas: [] },
      1,
    );
    expect(r.point).toBeGreaterThanOrEqual(550); // essential minimum project fee floor
    expect(r.confidence).toBe("low");
    expect(r.low).toBeLessThan(r.point); // 0.70 spread
  });

  it("widens the range as confidence drops via risk flags", () => {
    const high = estimate(premiumBuiltIn, 1);
    const low = estimate(
      { ...premiumBuiltIn, risk: { oldHome: true, lowPhotoQuality: true, matchExisting: true } },
      1,
    );
    expect(high.confidence).toBe("high");
    expect(low.confidence).toBe("low");
    const highSpread = (high.high - high.low) / high.point;
    const lowSpread = (low.high - low.low) / low.point;
    expect(lowSpread).toBeGreaterThan(highSpread);
  });
});
