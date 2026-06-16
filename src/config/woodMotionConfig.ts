export interface Chapter {
  id: string;
  label: string;
  start: number;
  end: number;
  image: string;
  headline: string;
  sub: string;
  filters: {
    brightness: number;
    contrast: number;
    saturate: number;
    sepia: number;
  };
  overlayOpacity: number;
}

// 400svh (not vh) so the scroll track and the sticky 100svh pane share the SAME
// viewport basis — on iOS the URL bar showing/hiding no longer re-maps where
// scroll progress hits 0/1 mid-scroll (the old 320vh-track / 100svh-pane mix
// caused a scrub hitch). Longer than the prior 320vh so each chapter lingers
// for a slower, more cinematic pace. The image zoom is one continuous push-in
// across the whole story (see WoodChapter), so chapter boundaries never reverse
// scale direction.
export const SCROLL_HEIGHT = "400svh";

// Boundaries are near-even with slightly larger bookends — the opener ("raw")
// sets the tone and the closer ("finish") holds the CTA a beat longer. Adjacent
// chapters share a boundary (A.end === B.start); ScrollWoodStory overlaps the
// cross-fades around each boundary so there is never a black gap between them.
export const chapters: Chapter[] = [
  {
    id: "raw",
    label: "Raw Material",
    start: 0,
    end: 0.16,
    image: "/wood/wood_raw.jpg",
    headline: "It starts with the wood.",
    sub: "Selected. Inspected. Respected.",
    filters: { brightness: 0.6, contrast: 1.06, saturate: 0.82, sepia: 0.03 },
    overlayOpacity: 0.55,
  },
  {
    id: "grain",
    label: "Grain & Character",
    start: 0.16,
    end: 0.3,
    image: "/wood/wood_grain.jpg",
    headline: "Every grain tells a story.",
    sub: "No two pieces are ever the same.",
    filters: { brightness: 0.82, contrast: 1.08, saturate: 1.0, sepia: 0.02 },
    overlayOpacity: 0.35,
  },
  {
    id: "measure",
    label: "Precision",
    start: 0.3,
    end: 0.44,
    image: "/wood/wood_measure.jpg",
    headline: "Measured twice. Cut once.",
    sub: "Precision is the foundation of craft.",
    filters: { brightness: 0.86, contrast: 1.06, saturate: 0.92, sepia: 0.0 },
    overlayOpacity: 0.25,
  },
  {
    id: "cut",
    label: "The Cut",
    start: 0.44,
    end: 0.58,
    image: "/wood/wood_cut.jpg",
    headline: "Clean. Decisive. Exact.",
    sub: "Every cut is an act of commitment.",
    filters: { brightness: 0.8, contrast: 1.1, saturate: 0.9, sepia: 0.02 },
    overlayOpacity: 0.3,
  },
  {
    id: "sand",
    label: "Refinement",
    start: 0.58,
    end: 0.72,
    image: "/wood/wood_sand.jpg",
    headline: "Rough becomes smooth.",
    sub: "Patience is what separates good from great.",
    filters: { brightness: 0.9, contrast: 1.04, saturate: 0.93, sepia: 0.0 },
    overlayOpacity: 0.2,
  },
  {
    id: "assemble",
    label: "Assembly",
    start: 0.72,
    end: 0.85,
    image: "/wood/wood_assemble.jpg",
    headline: "Pieces become purpose.",
    sub: "Joinery that holds for generations.",
    filters: { brightness: 1.05, contrast: 1.0, saturate: 1.05, sepia: 0.0 },
    overlayOpacity: 0.15,
  },
  {
    id: "finish",
    label: "The Finish",
    start: 0.85,
    end: 1.0,
    image: "/wood/wood_finish.jpg",
    headline: "Built by hand. Built to last.",
    sub: "Cruz Carpentry — Custom Millwork",
    filters: { brightness: 0.97, contrast: 1.0, saturate: 1.02, sepia: 0.02 },
    overlayOpacity: 0.1,
  },
];

// Width (in progress units) of the overlap on each side of a chapter boundary.
// Neighbors cross-fade across 2×CROSSFADE centered on the seam so the summed
// opacity stays ≥1 (no black dip) and the dissolve is long/luxurious. Must stay
// below half the smallest chapter span (~0.13) to avoid 3-way overlaps.
export const CROSSFADE = 0.06;
