/**
 * Pure pricing engine. Deterministic: `estimate(input, marketFactor)` returns
 * the same result for the same inputs (no Date.now / Math.random / I/O). The
 * live market factor is supplied by the caller (see ./index and ./market) and
 * applied only to market-linked (wood) materials.
 *
 * Methodology mirrors docs/custom-project-inquiry-spec.md Parts 8–10: a
 * bottom-up takeoff (sheet goods + solid lumber + trim + hardware + finishing +
 * travel + design) rolled into a margined subtotal, a priority/rush factor, a
 * risk buffer, a minimum-fee floor, and a confidence-driven customer range.
 */

import type {
  AreaBlock,
  Confidence,
  EstimateInput,
  EstimateResult,
  Finish,
  ProjectType,
  RiskFlags,
  Timeline,
} from "./types";
import {
  ACCESS_MULTIPLIER,
  COMPLEXITY_MULTIPLIER,
  CONFIDENCE_RANGE,
  DEMOLITION_MULTIPLIER,
  DESIGN_FEE_FRACTION,
  ENGINE_VERSION,
  FINISH_MULTIPLIER,
  MIN_PROJECT_FEE,
  PRIORITY_FACTOR,
  PROJECT_TYPE_MULTIPLIER,
  RISK_BUFFER,
  RULES_VERSION,
  RUSH_MULTIPLIER,
  SHEET_SQFT,
  TIER_MARGIN,
} from "./multipliers";
import { SEED_SNAPSHOT, sellCost, type RateSnapshot } from "./rates";

// ---- Geometry primitives (exact, unit-tested) -----------------------------

export const squareInches = (widthIn: number, heightIn: number): number => widthIn * heightIn;
export const squareFeet = (widthIn: number, heightIn: number): number =>
  squareInches(widthIn, heightIn) / 144;
export const cubicInches = (widthIn: number, heightIn: number, depthIn: number): number =>
  widthIn * heightIn * depthIn;
export const linearFeet = (totalLengthIn: number): number => totalLengthIn / 12;
export const boardFeet = (thicknessIn: number, widthIn: number, lengthIn: number): number =>
  (thicknessIn * widthIn * lengthIn) / 144;
export const sheetCount = (sqFt: number, layers: number, wasteFactor: number): number =>
  Math.ceil((sqFt * layers * wasteFactor) / SHEET_SQFT);

// ---- Helpers ---------------------------------------------------------------

const RUSH_TIMELINES: ReadonlySet<Timeline> = new Set<Timeline>([
  "asap",
  "rush_priority",
  "emergency_repair",
]);

const roundMoney = (n: number): number => Math.round(n * 100) / 100;
const roundTo = (n: number, step: number): number => Math.round(n / step) * step;

/** Visible-surface multiplier for the sheet-good carcass takeoff, per type. */
function carcassSurfaceFactor(type: ProjectType): number {
  const map: Partial<Record<ProjectType, number>> = {
    custom_cabinetry: 1.8,
    built_in_shelving: 1.6,
    custom_closets: 1.5,
    mudrooms_lockers: 1.6,
    trim_wainscoting: 1.0,
    fireplace_mantels: 1.2,
    exposed_beams: 0.8, // mostly solid timber (priced via board-feet), low sheet goods
    staircases_railings: 1.0,
    interior_exterior_doors: 0.9, // priced per door (solid + hardware) more than sheet
    wine_cellars: 1.9, // dense racking surface
    home_bars: 1.8,
    home_offices: 1.7,
    garage_storage: 1.4,
    beds_frames: 1.3, // furniture: less carcass surface
    custom_woodwork: 1.4,
    cedar_hot_tubs: 1.5,
  };
  return map[type] ?? 1.2; // other / not_sure
}

const TRIM_TYPES: ReadonlySet<ProjectType> = new Set<ProjectType>(["trim_wainscoting"]);

function finishCoats(finish: Finish): number {
  switch (finish) {
    case "raw_unfinished":
      return 0;
    case "primed":
      return 1;
    case "color_matched":
    case "stain_matched":
    case "high_gloss":
    case "luxury_furniture_grade":
      return 3;
    default:
      return 2;
  }
}

function deriveConfidence(input: EstimateInput, hasMeasurements: boolean): Confidence {
  if (!hasMeasurements) return "low";
  const r = input.risk ?? {};
  const flags: (keyof RiskFlags)[] = [
    "oldHome",
    "unknownWallCondition",
    "lowPhotoQuality",
    "unverifiedMeasurements",
    "complexInstall",
    "matchExisting",
  ];
  const n = flags.reduce((acc, f) => acc + (r[f] ? 1 : 0), 0);
  if (n >= 3) return "low";
  if (n >= 1) return "medium";
  return "high";
}

function riskFraction(r: RiskFlags | undefined): number {
  if (!r) return 0;
  let sum = 0;
  if (r.oldHome) sum += RISK_BUFFER.oldHome;
  if (r.unknownWallCondition) sum += RISK_BUFFER.unknownWallCondition;
  if (r.lowPhotoQuality) sum += RISK_BUFFER.lowPhotoQuality;
  if (r.unverifiedMeasurements) sum += RISK_BUFFER.unverifiedMeasurements;
  if (r.complexInstall) sum += RISK_BUFFER.complexInstall;
  if (r.matchExisting) sum += RISK_BUFFER.matchExisting;
  if (r.tightTimeline) sum += RISK_BUFFER.tightTimeline;
  return sum;
}

interface Takeoff {
  carcassSf: number;
  runLf: number;
  doors: number;
  drawers: number;
  shelves: number;
  cabinets: number;
  trimRuns: number;
}

function takeoff(areas: AreaBlock[], type: ProjectType): Takeoff {
  const sf = carcassSurfaceFactor(type);
  return areas.reduce<Takeoff>(
    (acc, a) => {
      const areaSf = a.widthIn && a.heightIn ? (a.widthIn * a.heightIn) / 144 : 0;
      acc.carcassSf += areaSf * sf;
      acc.runLf += a.linearFeet ?? (a.widthIn ? a.widthIn / 12 : 0);
      acc.doors += a.numDoors ?? 0;
      acc.drawers += a.numDrawers ?? 0;
      acc.shelves += a.numShelves ?? 0;
      acc.cabinets += a.numCabinets ?? 0;
      acc.trimRuns += a.numTrimRuns ?? 0;
      return acc;
    },
    { carcassSf: 0, runLf: 0, doors: 0, drawers: 0, shelves: 0, cabinets: 0, trimRuns: 0 },
  );
}

// ---- Core estimate ---------------------------------------------------------

export function estimate(
  input: EstimateInput,
  marketFactor: number,
  snapshot: RateSnapshot = SEED_SNAPSHOT,
): EstimateResult {
  const { tier, projectType, finish } = input;
  const mats = snapshot.materials[tier];
  const hw = snapshot.hardware[tier];
  const t = takeoff(input.areas ?? [], projectType);
  const wood = (linked: boolean) => (linked ? marketFactor : 1);

  // --- Material (sheet goods + solid + trim), wood rows market-adjusted -----
  const sheets = t.carcassSf > 0 ? sheetCount(t.carcassSf, 1, mats.sheet.wasteFactor) : 0;
  const sheetCost =
    sheets * mats.sheet.unitCost * (1 + mats.sheet.markupPct / 100) * wood(mats.sheet.marketLinked);
  const solidBf = t.runLf * 0.75 + t.doors * 2.5 + t.drawers * 1.0;
  const solidCost = solidBf * sellCost(mats.solid) * wood(mats.solid.marketLinked);
  const trimLf = TRIM_TYPES.has(projectType) ? t.runLf : t.trimRuns * 8;
  const trimCost = trimLf * sellCost(mats.trim) * wood(mats.trim.marketLinked);
  const material = sheetCost + solidCost + trimCost;

  // --- Labor ----------------------------------------------------------------
  const baseHours =
    t.carcassSf / 8 +
    t.runLf * 0.3 +
    t.doors * 1.2 +
    t.drawers * 0.9 +
    t.shelves * 0.4 +
    t.cabinets * 3 +
    t.trimRuns * 1.5;
  const hours =
    baseHours *
    PROJECT_TYPE_MULTIPLIER[projectType] *
    COMPLEXITY_MULTIPLIER[input.complexity ?? "moderate"] *
    ACCESS_MULTIPLIER[input.access ?? "easy"] *
    (input.demolition ? DEMOLITION_MULTIPLIER : 1);
  const labor =
    hours * 0.6 * snapshot.labor.shop[tier] + hours * 0.4 * snapshot.labor.install[tier];

  // --- Hardware -------------------------------------------------------------
  const hardware =
    t.doors * 2 * hw.hingeEach +
    t.drawers * hw.slidePair +
    t.drawers * hw.drawerBoxStock +
    (t.doors + t.drawers) * hw.pullEach +
    t.shelves * hw.shelfPinSet;

  // --- Finishing ------------------------------------------------------------
  const finishSf = t.carcassSf * 0.8 + t.doors * 8 + t.drawers * 3 + t.runLf * 0.7;
  const coats = finishCoats(finish);
  const finishingBase =
    finishSf * mats.finishPerSf + (finishSf / 100) * coats * snapshot.labor.finish[tier];
  const finishing = finishingBase * FINISH_MULTIPLIER[finish];

  // --- Travel ---------------------------------------------------------------
  const dist = input.distanceMiles ?? 20;
  const mob = input.mobilizations ?? 1;
  const travel = (dist * 0.7 * 2 + 45) * mob;

  // --- Design / admin -------------------------------------------------------
  const core = material + labor + hardware + finishing + travel;
  const design = input.designNeeded ? core * DESIGN_FEE_FRACTION : 0;
  const subtotal = core + design;

  // --- Margin, priority/rush, risk, floor -----------------------------------
  const warranty = subtotal * 0.03;
  const margin = TIER_MARGIN[tier];
  const priced = (subtotal + warranty) / (1 - margin);
  const marginApplied = priced - subtotal;

  const isRush =
    input.priority === "fast_quality" ||
    (input.timeline !== undefined && RUSH_TIMELINES.has(input.timeline));
  const priorityFactor = input.priority
    ? PRIORITY_FACTOR[input.priority]
    : isRush
      ? RUSH_MULTIPLIER
      : 1;
  const afterPriority = priced * priorityFactor;
  const rushFee = afterPriority - priced;

  const riskBuffer = afterPriority * riskFraction(input.risk);
  const pointRaw = afterPriority + riskBuffer;

  const floor = MIN_PROJECT_FEE[tier];
  const point = Math.max(floor, pointRaw);

  const hasMeasurements =
    t.carcassSf > 0 ||
    t.runLf > 0 ||
    t.doors + t.drawers + t.shelves + t.cabinets + t.trimRuns > 0;
  const confidence = deriveConfidence(input, hasMeasurements);
  const range = CONFIDENCE_RANGE[confidence];

  const assumptions: string[] = [
    `Tier: ${tier}; project type: ${projectType}; finish: ${finish}.`,
    `Wood material market factor applied: ×${marketFactor.toFixed(3)}.`,
    `Confidence: ${confidence} (range ${range.low}–${range.high} of point).`,
    point === floor ? `Minimum project fee floor applied ($${floor}).` : `Above minimum fee floor.`,
    "Preliminary estimate — not a quote; subject to on-site review and verified measurements.",
  ];

  return {
    low: roundTo(point * range.low, 25),
    point: roundTo(point, 5),
    high: roundTo(point * range.high, 25),
    confidence,
    currency: "USD",
    breakdown: {
      material: roundMoney(material),
      labor: roundMoney(labor),
      hardware: roundMoney(hardware),
      finishing: roundMoney(finishing),
      travel: roundMoney(travel),
      design: roundMoney(design),
      subtotal: roundMoney(subtotal),
      marginApplied: roundMoney(marginApplied),
      rushFee: roundMoney(rushFee),
      riskBuffer: roundMoney(riskBuffer),
    },
    market: { factor: marketFactor, source: "supplied", asOf: null, stale: false },
    assumptions,
    engineVersion: ENGINE_VERSION,
    rulesVersion: RULES_VERSION,
  };
}
