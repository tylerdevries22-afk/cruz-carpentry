// Size presets for the estimate wizard. Picking Small/Medium/Large fills the
// area fields with realistic dimensions + counts for that project type, so the
// pricing engine gets a real takeoff (tighter range, higher confidence) without
// the homeowner needing a tape measure. Power users can still open "exact
// measurements" and override.
//
// Numbers feed src/lib/pricing/engine.ts: widthIn×heightIn → carcass sq-ft,
// linearFeet → run length, and the counts → doors/drawers/shelves labor+hardware.

export type PresetSize = "sm" | "md" | "lg";

/** Matches the wizard's AreaInput (all strings; empty = unset). */
export interface PresetArea {
  widthIn?: string;
  heightIn?: string;
  depthIn?: string;
  linearFeet?: string;
  numShelves?: string;
  numDoors?: string;
  numDrawers?: string;
}

export interface SizeOption {
  /** One-line, plain-English description shown on the tile. */
  sub: string;
  area: PresetArea;
}

type PresetSet = Record<PresetSize, SizeOption>;

const a = (
  linearFeet: number,
  heightIn: number,
  depthIn: number,
  doors: number,
  drawers: number,
  shelves: number,
): PresetArea => ({
  widthIn: String(linearFeet * 12),
  heightIn: String(heightIn),
  depthIn: String(depthIn),
  linearFeet: String(linearFeet),
  numDoors: String(doors),
  numDrawers: String(drawers),
  numShelves: String(shelves),
});

const GENERIC: PresetSet = {
  sm: { sub: "A small built-in or single piece", area: a(6, 84, 16, 2, 2, 8) },
  md: { sub: "A standard wall or room", area: a(12, 90, 18, 4, 4, 16) },
  lg: { sub: "A large or whole-room project", area: a(20, 96, 20, 8, 6, 24) },
};

export const SIZE_PRESETS: Record<string, PresetSet> = {
  custom_cabinetry: {
    sm: { sub: "A few cabinets or a galley (~8 ft)", area: a(8, 84, 24, 10, 6, 4) },
    md: { sub: "A standard kitchen (~16 ft)", area: a(16, 84, 24, 18, 12, 8) },
    lg: { sub: "Full kitchen + island (~28 ft)", area: a(28, 84, 24, 30, 20, 12) },
  },
  built_in_shelving: {
    sm: { sub: "One alcove or short wall (~6 ft)", area: a(6, 84, 12, 2, 2, 10) },
    md: { sub: "A feature wall (~12 ft)", area: a(12, 96, 12, 4, 4, 20) },
    lg: { sub: "Floor-to-ceiling, whole wall (~20 ft)", area: a(20, 108, 14, 6, 6, 32) },
  },
  custom_closets: {
    sm: { sub: "A reach-in closet (~6 ft)", area: a(6, 84, 16, 2, 4, 8) },
    md: { sub: "A walk-in closet (~14 ft)", area: a(14, 96, 16, 4, 8, 16) },
    lg: { sub: "A large primary suite (~24 ft)", area: a(24, 108, 20, 8, 14, 28) },
  },
  mudrooms_lockers: {
    sm: { sub: "A small bench + hooks (~5 ft)", area: a(5, 84, 18, 3, 2, 4) },
    md: { sub: "A lockers + bench run (~9 ft)", area: a(9, 84, 18, 5, 4, 6) },
    lg: { sub: "A full mudroom wall (~14 ft)", area: a(14, 90, 20, 8, 6, 10) },
  },
  trim_wainscoting: {
    sm: { sub: "One room or accent wall (~20 ft)", area: a(20, 42, 1, 0, 0, 0) },
    md: { sub: "A few rooms / a hallway (~45 ft)", area: a(45, 48, 1, 0, 0, 0) },
    lg: { sub: "Whole-floor trim package (~90 ft)", area: a(90, 54, 1, 0, 0, 0) },
  },
  fireplace_mantels: {
    sm: { sub: "A simple floating mantel", area: { widthIn: "60", heightIn: "12", depthIn: "8", linearFeet: "5" } },
    md: { sub: "A mantel + partial surround", area: { widthIn: "72", heightIn: "48", depthIn: "10", linearFeet: "6" } },
    lg: { sub: "A full floor-to-ceiling surround", area: { widthIn: "84", heightIn: "108", depthIn: "12", linearFeet: "8" } },
  },
  exposed_beams: {
    sm: { sub: "One beam or accent (~20 ft)", area: a(20, 8, 8, 0, 0, 0) },
    md: { sub: "A room of beams (~45 ft)", area: a(45, 10, 10, 0, 0, 0) },
    lg: { sub: "A great-room ceiling (~90 ft)", area: a(90, 12, 12, 0, 0, 0) },
  },
  staircases_railings: {
    sm: { sub: "A railing run or short flight", area: { widthIn: "48", heightIn: "120", depthIn: "10", linearFeet: "14" } },
    md: { sub: "A standard staircase", area: { widthIn: "60", heightIn: "132", depthIn: "11", linearFeet: "22" } },
    lg: { sub: "A feature / open-riser staircase", area: { widthIn: "72", heightIn: "144", depthIn: "12", linearFeet: "32" } },
  },
  interior_exterior_doors: {
    sm: { sub: "One custom door", area: { widthIn: "36", heightIn: "84", depthIn: "2", numDoors: "1" } },
    md: { sub: "A few doors (~4)", area: { widthIn: "36", heightIn: "84", depthIn: "2", numDoors: "4" } },
    lg: { sub: "Whole-home doors (~8)", area: { widthIn: "36", heightIn: "84", depthIn: "2", numDoors: "8" } },
  },
  wine_cellars: {
    sm: { sub: "A wine wall / closet (~8 ft)", area: a(8, 96, 12, 0, 0, 40) },
    md: { sub: "A dedicated wine room (~16 ft)", area: a(16, 108, 12, 0, 0, 90) },
    lg: { sub: "A grand cellar (~28 ft)", area: a(28, 120, 14, 0, 0, 160) },
  },
  home_bars: {
    sm: { sub: "A dry bar (~8 ft)", area: a(8, 42, 24, 6, 4, 6) },
    md: { sub: "A wet bar + back-bar (~14 ft)", area: a(14, 90, 24, 10, 6, 10) },
    lg: { sub: "A full bar + pantry (~22 ft)", area: a(22, 96, 24, 16, 10, 16) },
  },
  home_offices: {
    sm: { sub: "A desk + shelving (~8 ft)", area: a(8, 84, 14, 4, 4, 16) },
    md: { sub: "A built-in office (~16 ft)", area: a(16, 96, 14, 8, 6, 28) },
    lg: { sub: "A full library (~28 ft)", area: a(28, 108, 16, 12, 10, 44) },
  },
  garage_storage: {
    sm: { sub: "A cabinet run (~8 ft)", area: a(8, 84, 20, 6, 4, 6) },
    md: { sub: "One garage wall (~16 ft)", area: a(16, 84, 24, 10, 6, 10) },
    lg: { sub: "A full garage system (~28 ft)", area: a(28, 90, 24, 16, 10, 16) },
  },
  beds_frames: {
    sm: { sub: "A bed frame", area: { widthIn: "80", heightIn: "48", depthIn: "84", numDrawers: "2" } },
    md: { sub: "A bed + nightstands", area: { widthIn: "84", heightIn: "54", depthIn: "90", numDrawers: "4", numShelves: "2" } },
    lg: { sub: "A full bedroom suite", area: { widthIn: "90", heightIn: "60", depthIn: "96", numDrawers: "6", numShelves: "4" } },
  },
  custom_woodwork: {
    sm: { sub: "A single specialty piece (~6 ft)", area: a(6, 84, 12, 2, 2, 8) },
    md: { sub: "A feature build (~14 ft)", area: a(14, 96, 14, 4, 4, 16) },
    lg: { sub: "A large architectural build (~24 ft)", area: a(24, 108, 16, 8, 6, 24) },
  },
  cedar_hot_tubs: {
    sm: { sub: "A compact soaking tub", area: { widthIn: "72", heightIn: "36", depthIn: "72" } },
    md: { sub: "A standard cedar tub + steps", area: { widthIn: "84", heightIn: "40", depthIn: "84" } },
    lg: { sub: "A large tub + surround deck", area: { widthIn: "96", heightIn: "44", depthIn: "96" } },
  },
};

export function presetsFor(projectType: string): PresetSet {
  return SIZE_PRESETS[projectType] ?? GENERIC;
}
