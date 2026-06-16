import { describe, expect, it } from "vitest";
import { scoreLead, type LeadSignals } from "./lead-score";
import type { EstimateResult } from "./pricing/types";

function est(point: number, low = point * 0.85, high = point * 1.25): EstimateResult {
  return {
    low,
    point,
    high,
    confidence: "medium",
    currency: "USD",
    breakdown: {
      material: 0, labor: 0, hardware: 0, finishing: 0, travel: 0, design: 0,
      subtotal: 0, marginApplied: 0, rushFee: 0, riskBuffer: 0,
    },
    market: { factor: 1, source: "test", asOf: null, stale: false },
    assumptions: [],
    engineVersion: "1.0.0",
    rulesVersion: "test",
  };
}

describe("scoreLead", () => {
  it("scores within 0–100 and sums its factors", () => {
    const r = scoreLead({ tier: "premium", projectType: "custom_cabinetry" }, est(8000));
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
    expect(Object.values(r.factors).reduce((a, b) => a + b, 0)).toBe(r.score);
  });

  it("flags a hot lead", () => {
    const s: LeadSignals = {
      tier: "premium",
      projectType: "custom_cabinetry",
      budgetBand: "25k_plus",
      timeline: "standard",
      email: "a@b.com",
      areas: [{}],
      zip: "80202",
      contactRole: "homeowner",
    };
    const r = scoreLead(s, est(15000));
    expect(r.score).toBeGreaterThanOrEqual(72);
    expect(r.category).toBe("hot");
  });

  it("flags a budget lead (essential + low band)", () => {
    const r = scoreLead(
      { tier: "essential", projectType: "trim_wainscoting", budgetBand: "2_5k_5k", email: "a@b.com", areas: [{}], zip: "80020", contactRole: "homeowner", timeline: "flexible" },
      est(4000),
    );
    expect(r.category).toBe("budget");
  });

  it("flags a luxury lead (signature, not time-ready)", () => {
    const r = scoreLead(
      { tier: "signature", projectType: "custom_cabinetry", budgetBand: "10k_25k", timeline: "flexible", email: "a@b.com", areas: [{}], zip: "80206", contactRole: "homeowner" },
      est(12000),
    );
    expect(r.category).toBe("luxury");
  });

  it("flags a low-fit lead", () => {
    const r = scoreLead({ tier: "essential", projectType: "not_sure" }, est(400));
    expect(r.score).toBeLessThan(45);
    expect(r.category).toBe("low_fit");
  });

  it("flags a warm lead", () => {
    const r = scoreLead(
      { tier: "premium", projectType: "custom_cabinetry", timeline: "flexible", email: "a@b.com", areas: [{}], zip: "80123", contactRole: "renter" },
      est(6000),
    );
    expect(r.category).toBe("warm");
  });
});
