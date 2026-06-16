/**
 * Canonical pricing constants — the single source of truth from
 * docs/custom-project-inquiry-spec.md Part A §A2/§A4. Changing a number here is
 * the intended way to retune the engine; production loads the same shape from
 * the `pricing_rules` table (see supabase/migrations/0005_pricing.sql) so these
 * defaults can be overridden without a code change.
 */

import type {
  Access,
  Complexity,
  Confidence,
  Finish,
  Priority,
  ProjectType,
  Tier,
} from "./types";

export const ENGINE_VERSION = "1.0.0";
export const RULES_VERSION = "2025.06-baseline";

/** Tier net profit margin (applied as cost / (1 − margin)). */
export const TIER_MARGIN: Record<Tier, number> = {
  essential: 0.13,
  premium: 0.2,
  signature: 0.25,
};
export const RUSH_MARGIN_EXTRA = 0.05;

/** Premium-anchored tier multiplier used by the engine roll-up. */
export const TIER_ENGINE_MULTIPLIER: Record<Tier, number> = {
  essential: 0.667,
  premium: 1.0,
  signature: 1.6,
};

/** Tier billable labor rates ($/hr) by activity (Part A §A4). */
export const LABOR_RATE: Record<"shop" | "install" | "finish" | "design", Record<Tier, number>> = {
  shop: { essential: 85, premium: 100, signature: 120 },
  install: { essential: 95, premium: 115, signature: 140 },
  finish: { essential: 90, premium: 110, signature: 135 },
  design: { essential: 95, premium: 125, signature: 160 },
};

/** Minimum project fee by tier; repair/trip floor is separate. */
export const MIN_PROJECT_FEE: Record<Tier, number> = {
  essential: 550,
  premium: 850,
  signature: 1500,
};
export const REPAIR_TRIP_MIN = 275;

/** Project-type labor multiplier (relative effort vs. a baseline built-in = 1.0). */
export const PROJECT_TYPE_MULTIPLIER: Record<ProjectType, number> = {
  built_in_shelving: 1.0,
  entertainment_center: 1.05,
  custom_cabinets: 1.15,
  vanity: 1.0,
  closet_system: 0.95,
  mudroom_bench_lockers: 1.05,
  fireplace_surround: 1.1,
  wainscoting: 0.9,
  accent_wall: 0.85,
  trim_baseboards_crown: 0.8,
  floating_shelves: 0.7,
  custom_furniture: 1.2,
  casing: 0.8,
  repairs: 0.9,
  full_room: 1.15,
  install_only: 0.8,
  other: 1.0,
  not_sure: 1.0,
};

export const COMPLEXITY_MULTIPLIER: Record<Complexity, number> = {
  simple: 0.9,
  moderate: 1.0,
  complex: 1.25,
  very_complex: 1.5,
};

export const ACCESS_MULTIPLIER: Record<Access, number> = {
  easy: 1.0,
  moderate: 1.1,
  hard: 1.25,
};

/**
 * Finish multiplier scales the finishing bucket (labor + material). `raw` = 0
 * (no finish), `primed` partial, painted = 1.0 baseline, luxury furniture-grade
 * the richest. color/stain-matched carry the +20% match premium (Part A §A4).
 */
export const FINISH_MULTIPLIER: Record<Finish, number> = {
  raw_unfinished: 0,
  primed: 0.4,
  painted: 1.0,
  stained: 1.1,
  clear_coated: 0.9,
  color_matched: 1.2,
  stain_matched: 1.2,
  distressed_rustic: 1.15,
  high_gloss: 1.25,
  matte: 1.0,
  satin: 1.0,
  luxury_furniture_grade: 1.5,
};

export const DEMOLITION_MULTIPLIER = 1.08;

/** Timeline → priority/rush economics (engine defaults within the customer band). */
export const RUSH_MULTIPLIER = 1.3; // band 1.20–1.40
export const BATCHED_FACTOR = 0.92; // "Best price + quality" — band 0.90–0.95
export const PRICE_FAST_FACTOR = 0.85; // "Best price + fast" — band 0.80–0.90

export const PRIORITY_FACTOR: Record<Priority, number> = {
  balanced: 1.0,
  price_quality: BATCHED_FACTOR,
  fast_quality: RUSH_MULTIPLIER,
  price_fast: PRICE_FAST_FACTOR,
};

/** Risk-buffer contributions (fraction of subtotal), summed. */
export const RISK_BUFFER = {
  oldHome: 0.05,
  unknownWallCondition: 0.05,
  lowPhotoQuality: 0.05,
  unverifiedMeasurements: 0.05,
  complexInstall: 0.05,
  matchExisting: 0.1,
  tightTimeline: 0.05,
} as const;

/** Confidence → customer-facing range spread around the point estimate. */
export const CONFIDENCE_RANGE: Record<Confidence, { low: number; high: number }> = {
  high: { low: 0.92, high: 1.12 },
  medium: { low: 0.85, high: 1.25 },
  low: { low: 0.7, high: 1.5 },
};

/** Design / PM fee as a fraction of subtotal when drawings are needed. */
export const DESIGN_FEE_FRACTION = 0.06;

/** A 4×8 sheet is 32 sq ft (used in the sheet-count formula). */
export const SHEET_SQFT = 32;
