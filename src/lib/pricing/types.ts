/**
 * Pricing-engine types. Mirrors the canonical conventions in
 * docs/custom-project-inquiry-spec.md (Part A). Tiers are essential/premium/
 * signature; all money is handled in dollars (numbers) and rounded to cents at
 * the engine boundary.
 */

export type Tier = "essential" | "premium" | "signature";

export type ProjectType =
  | "built_in_shelving"
  | "entertainment_center"
  | "custom_cabinets"
  | "vanity"
  | "closet_system"
  | "mudroom_bench_lockers"
  | "fireplace_surround"
  | "wainscoting"
  | "accent_wall"
  | "trim_baseboards_crown"
  | "floating_shelves"
  | "custom_furniture"
  | "casing"
  | "repairs"
  | "full_room"
  | "install_only"
  | "other"
  | "not_sure";

export type Finish =
  | "raw_unfinished"
  | "primed"
  | "painted"
  | "stained"
  | "clear_coated"
  | "color_matched"
  | "stain_matched"
  | "distressed_rustic"
  | "high_gloss"
  | "matte"
  | "satin"
  | "luxury_furniture_grade";

export type Complexity = "simple" | "moderate" | "complex" | "very_complex";
export type Access = "easy" | "moderate" | "hard";
export type Confidence = "high" | "medium" | "low";
export type Priority = "balanced" | "price_quality" | "fast_quality" | "price_fast";

export type Timeline =
  | "flexible"
  | "standard"
  | "asap"
  | "rush_priority"
  | "fixed_deadline"
  | "event_move_in"
  | "emergency_repair";

/** One measurement block ("Wall A", "Left built-in", "Upper section", …). */
export interface AreaBlock {
  label?: string;
  widthIn?: number;
  heightIn?: number;
  depthIn?: number;
  linearFeet?: number;
  numShelves?: number;
  numDrawers?: number;
  numDoors?: number;
  numCabinets?: number;
  numTrimRuns?: number;
}

/** Existing-condition flags that drive the risk buffer (subset that affects price). */
export interface RiskFlags {
  oldHome?: boolean;
  unknownWallCondition?: boolean;
  lowPhotoQuality?: boolean;
  unverifiedMeasurements?: boolean;
  complexInstall?: boolean;
  matchExisting?: boolean;
  tightTimeline?: boolean;
}

export interface EstimateInput {
  projectType: ProjectType;
  tier: Tier;
  areas: AreaBlock[];
  finish: Finish;
  complexity?: Complexity;
  access?: Access;
  demolition?: boolean;
  timeline?: Timeline;
  priority?: Priority;
  /** One-way distance from the shop, miles (drives travel). */
  distanceMiles?: number;
  /** Number of mobilizations / site trips. */
  mobilizations?: number;
  /** A design fee / drawings are needed (vs. concept already exists). */
  designNeeded?: boolean;
  risk?: RiskFlags;
}

export interface CostBreakdown {
  material: number;
  labor: number;
  hardware: number;
  finishing: number;
  travel: number;
  design: number;
  subtotal: number;
  marginApplied: number;
  rushFee: number;
  riskBuffer: number;
}

export interface MarketInfo {
  /** Multiplier applied to market-linked (wood) materials, clamped. */
  factor: number;
  /** Source label, e.g. "CME Lumber Futures (LBR=F)" or "fallback". */
  source: string;
  /** ISO timestamp of the quote that produced the factor, or null on fallback. */
  asOf: string | null;
  /** True when the live fetch failed and the baseline (factor 1.0) was used. */
  stale: boolean;
  /** Raw index value (USD / 1,000 board feet) when available. */
  indexValue?: number;
}

export interface EstimateResult {
  low: number;
  point: number;
  high: number;
  confidence: Confidence;
  currency: "USD";
  breakdown: CostBreakdown;
  market: MarketInfo;
  assumptions: string[];
  engineVersion: string;
  rulesVersion: string;
}
