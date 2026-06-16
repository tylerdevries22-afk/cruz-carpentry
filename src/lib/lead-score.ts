/**
 * Lead scoring (0–100) + category, per docs/custom-project-inquiry-spec.md
 * Part 11 (weights) and Part A §A3 (deterministic category table). Pure — no
 * I/O — so it's unit-testable and runs inside the submit Server Action.
 *
 * Photo quality (max 7) is always 0 for now: the current wizard doesn't capture
 * photos, so the effective ceiling is ~93 until photo upload ships. Weights
 * still sum to 100 so the model is forward-compatible.
 */

import type { EstimateResult } from "./pricing/types";

export type LeadCategory = "hot" | "warm" | "luxury" | "budget" | "low_fit";

export interface LeadSignals {
  tier: "essential" | "premium" | "signature";
  projectType: string;
  budgetBand?: string;
  timeline?: string;
  areas?: unknown[];
  contactRole?: string;
  email?: string;
  zip?: string;
}

export interface LeadScore {
  score: number;
  category: LeadCategory;
  factors: Record<string, number>;
}

const BUDGET_MAX: Record<string, number | null> = {
  under_1k: 1000,
  "1k_2_5k": 2500,
  "2_5k_5k": 5000,
  "5k_10k": 10000,
  "10k_25k": 25000,
  "25k_plus": null,
  unsure: null,
};

const READY_TIMELINES = new Set([
  "asap",
  "rush_priority",
  "emergency_repair",
  "fixed_deadline",
  "event_move_in",
]);

const BUDGET_LOW_BANDS = new Set(["under_1k", "1k_2_5k", "2_5k_5k"]);

export function scoreLead(signals: LeadSignals, estimate: EstimateResult): LeadScore {
  const point = estimate.point;
  const budgetMax = signals.budgetBand ? BUDGET_MAX[signals.budgetBand] : undefined;

  // 1. Budget fit (18): does their budget cover the estimate?
  let budgetFit: number;
  if (!signals.budgetBand || signals.budgetBand === "unsure") budgetFit = 9;
  else if (budgetMax === null || budgetMax === undefined) budgetFit = 18; // $25k+ / open covers anything
  else if (budgetMax >= estimate.low) budgetFit = 18;
  else if (budgetMax >= point * 0.6) budgetFit = 10;
  else budgetFit = 4;

  // 2. Project size (15) from the estimate point.
  const projectSize =
    point >= 20000 ? 15 : point >= 10000 ? 13 : point >= 5000 ? 10 : point >= 2500 ? 6 : point >= 1000 ? 3 : 1;

  // 3. Luxury potential (12) by tier.
  const luxury = signals.tier === "signature" ? 12 : signals.tier === "premium" ? 7 : 3;

  // 4. Timeline fit (11).
  const t = signals.timeline;
  const timelineFit = !t ? 4 : READY_TIMELINES.has(t) ? 11 : t === "standard" ? 8 : 5; // flexible → 5

  // 5. Decision readiness (10): contactable now (phone always present) + email bonus.
  const readiness = 6 + (signals.email ? 4 : 0);

  // 6. Scope clarity (8).
  const scopeClarity = signals.projectType === "not_sure" || signals.projectType === "other" ? 3 : 8;

  // 7. Photo quality (7) — not captured yet.
  const photoQuality = 0;

  // 8. Measurement completeness (5).
  const measurement = (signals.areas?.length ?? 0) > 0 ? 5 : 0;

  // 9. Location / logistics (5): ZIP given (assumed in-area pending validation).
  const location = signals.zip ? 5 : 3;

  // 10. Homeowner status (5).
  const role = signals.contactRole;
  const homeowner =
    role === "homeowner" ? 5
    : role === "designer" || role === "contractor" || role === "realtor" || role === "investor" ? 4
    : role === "property_manager" ? 3
    : role === "renter" ? 2
    : 3;

  // 11. Material preference (4) by tier intent.
  const material = signals.tier === "signature" ? 4 : signals.tier === "premium" ? 3 : 2;

  const factors = {
    budgetFit,
    projectSize,
    luxury,
    timelineFit,
    readiness,
    scopeClarity,
    photoQuality,
    measurement,
    location,
    homeowner,
    material,
  };
  const score = Object.values(factors).reduce((a, b) => a + b, 0);

  const category = categorize(score, signals, estimate, budgetMax);
  return { score, category, factors };
}

function categorize(
  score: number,
  signals: LeadSignals,
  estimate: EstimateResult,
  budgetMax: number | null | undefined,
): LeadCategory {
  const timelineReady = signals.timeline ? READY_TIMELINES.has(signals.timeline) || signals.timeline === "standard" : false;
  const homeowner = signals.contactRole === "homeowner";

  // Ordered, first match wins (Part A §A3).
  if (score < 45) return "low_fit";
  if (signals.tier === "essential" && signals.budgetBand && BUDGET_LOW_BANDS.has(signals.budgetBand)) return "budget";
  if (score >= 72 && timelineReady && (homeowner || !signals.contactRole) && (signals.budgetBand !== undefined || estimate.point >= 7500)) return "hot";
  if (signals.tier === "signature" || (score >= 60 && estimate.point >= 10000)) return "luxury";
  if (typeof budgetMax === "number" && budgetMax < estimate.low) return "low_fit"; // can't afford the floor
  if (score >= 45) return "warm";
  return "low_fit";
}
