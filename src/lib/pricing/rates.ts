/**
 * Seeded material & hardware rate table — Front Range / Denver buy-costs from
 * docs/custom-project-inquiry-spec.md Part 8 (2025 estimates). Each row carries
 * `lastVerified` (staleness) and `marketLinked` (whether the live lumber index
 * applies). These defaults mirror the `material_rates` table; production should
 * load the DB rows and treat these as the seed/fallback.
 *
 * `markupPct` is a percent added to cost (25 → ×1.25). `wasteFactor` is a
 * multiplier (1.12 → +12%). `unitCost` is Cruz's buy price, pre-markup.
 */

import type { Tier } from "./types";
import { LABOR_RATE } from "./multipliers";

export interface RateRow {
  key: string;
  label: string;
  unit: "sheet" | "board_ft" | "linear_ft" | "each" | "pair" | "sf";
  unitCost: number;
  markupPct: number;
  wasteFactor: number;
  /** Live lumber index applies to this row (solid wood, plywood, wood trim). */
  marketLinked: boolean;
  lastVerified: string; // ISO date
  source: string;
}

const VERIFIED = "2025-10-01";

/** Representative material per tier used by the bottom-up takeoff. */
export interface TierMaterials {
  sheet: RateRow; // carcass / panel sheet good (per 4×8 sheet)
  solid: RateRow; // face-frame / solid stock (per board foot)
  trim: RateRow; // trim & moulding (per linear foot)
  finishPerSf: number; // finish material cost per finished sq ft
}

const MATERIALS: Record<Tier, TierMaterials> = {
  essential: {
    sheet: { key: "paint_grade_ply_34", label: '3/4" paint-grade plywood', unit: "sheet", unitCost: 62, markupPct: 25, wasteFactor: 1.12, marketLinked: true, lastVerified: VERIFIED, source: "Home Depot / Austin Hardwoods" },
    solid: { key: "poplar", label: "Poplar", unit: "board_ft", unitCost: 4.5, markupPct: 30, wasteFactor: 1.15, marketLinked: true, lastVerified: VERIFIED, source: "Austin Hardwoods / Paxton" },
    trim: { key: "mdf_trim", label: "MDF base/casing (primed)", unit: "linear_ft", unitCost: 1.3, markupPct: 25, wasteFactor: 1.12, marketLinked: false, lastVerified: VERIFIED, source: "Home Depot / Lowe's" },
    finishPerSf: 0.4,
  },
  premium: {
    sheet: { key: "birch_ply_34", label: '3/4" birch plywood (cabinet-grade)', unit: "sheet", unitCost: 118, markupPct: 30, wasteFactor: 1.12, marketLinked: true, lastVerified: VERIFIED, source: "Austin Hardwoods" },
    solid: { key: "red_oak", label: "Red oak", unit: "board_ft", unitCost: 6.0, markupPct: 32, wasteFactor: 1.15, marketLinked: true, lastVerified: VERIFIED, source: "Austin Hardwoods / Paxton" },
    trim: { key: "poplar_trim", label: "Poplar trim (milled)", unit: "linear_ft", unitCost: 3.1, markupPct: 30, wasteFactor: 1.14, marketLinked: true, lastVerified: VERIFIED, source: "Austin Hardwoods" },
    finishPerSf: 0.55,
  },
  signature: {
    sheet: { key: "rift_qswo_veneer_ply", label: '3/4" rift/QSWO veneer plywood', unit: "sheet", unitCost: 215, markupPct: 35, wasteFactor: 1.14, marketLinked: true, lastVerified: VERIFIED, source: "Austin Hardwoods / B&B Rare Woods" },
    solid: { key: "white_oak", label: "White oak (plain-sawn)", unit: "board_ft", unitCost: 8.5, markupPct: 32, wasteFactor: 1.15, marketLinked: true, lastVerified: VERIFIED, source: "Austin Hardwoods / Sears Trostel" },
    trim: { key: "hardwood_trim", label: "Hardwood trim (stain-grade)", unit: "linear_ft", unitCost: 10.0, markupPct: 32, wasteFactor: 1.15, marketLinked: true, lastVerified: VERIFIED, source: "Austin Hardwoods / Paxton" },
    finishPerSf: 0.85,
  },
};

export interface TierHardware {
  hingeEach: number;
  slidePair: number;
  pullEach: number;
  drawerBoxStock: number;
  shelfPinSet: number; // 4 pins per shelf
}

const HARDWARE: Record<Tier, TierHardware> = {
  essential: { hingeEach: 4.5, slidePair: 11, pullEach: 3, drawerBoxStock: 22, shelfPinSet: 1.6 },
  premium: { hingeEach: 7.5, slidePair: 28, pullEach: 9, drawerBoxStock: 35, shelfPinSet: 1.6 },
  signature: { hingeEach: 7.5, slidePair: 28, pullEach: 22, drawerBoxStock: 55, shelfPinSet: 1.6 },
};

/** Buy-cost → sell price for one rate row, before market adjustment. */
export function sellCost(row: RateRow): number {
  return row.unitCost * (1 + row.markupPct / 100) * row.wasteFactor;
}

/**
 * The full rate set the engine consumes. Loaded from the DB (pricing_config,
 * merged over this seed) at runtime; this in-code seed is the default and the
 * graceful fallback. See rate-source.ts.
 */
export interface RateSnapshot {
  materials: Record<Tier, TierMaterials>;
  hardware: Record<Tier, TierHardware>;
  labor: Record<"shop" | "install" | "finish" | "design", Record<Tier, number>>;
}

export const SEED_SNAPSHOT: RateSnapshot = {
  materials: MATERIALS,
  hardware: HARDWARE,
  labor: LABOR_RATE,
};
