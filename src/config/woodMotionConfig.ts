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
  scale: [number, number];
  overlayOpacity: number;
}

export const SCROLL_HEIGHT = "900vh";

export const chapters: Chapter[] = [
  {
    id: "raw",
    label: "Raw Material",
    start: 0,
    end: 0.15,
    image: "/wood/wood_raw.jpg",
    headline: "It starts with the wood.",
    sub: "Selected. Inspected. Respected.",
    filters: { brightness: 0.6, contrast: 1.1, saturate: 0.8, sepia: 0.1 },
    scale: [1.08, 1.02],
    overlayOpacity: 0.55,
  },
  {
    id: "grain",
    label: "Grain & Character",
    start: 0.15,
    end: 0.3,
    image: "/wood/wood_grain.jpg",
    headline: "Every grain tells a story.",
    sub: "No two pieces are ever the same.",
    filters: { brightness: 0.85, contrast: 1.15, saturate: 1.1, sepia: 0.05 },
    scale: [1.05, 1.0],
    overlayOpacity: 0.35,
  },
  {
    id: "measure",
    label: "Precision",
    start: 0.3,
    end: 0.45,
    image: "/wood/wood_measure.jpg",
    headline: "Measured twice. Cut once.",
    sub: "Precision is the foundation of craft.",
    filters: { brightness: 0.9, contrast: 1.1, saturate: 0.95, sepia: 0.0 },
    scale: [1.04, 1.0],
    overlayOpacity: 0.25,
  },
  {
    id: "cut",
    label: "The Cut",
    start: 0.45,
    end: 0.6,
    image: "/wood/wood_cut.jpg",
    headline: "Clean. Decisive. Exact.",
    sub: "Every cut is an act of commitment.",
    filters: { brightness: 0.8, contrast: 1.2, saturate: 0.9, sepia: 0.05 },
    scale: [1.06, 1.01],
    overlayOpacity: 0.3,
  },
  {
    id: "sand",
    label: "Refinement",
    start: 0.6,
    end: 0.75,
    image: "/wood/wood_sand.jpg",
    headline: "Rough becomes smooth.",
    sub: "Patience is what separates good from great.",
    filters: { brightness: 1.0, contrast: 1.05, saturate: 1.0, sepia: 0.0 },
    scale: [1.03, 1.0],
    overlayOpacity: 0.2,
  },
  {
    id: "assemble",
    label: "Assembly",
    start: 0.75,
    end: 0.88,
    image: "/wood/wood_assemble.jpg",
    headline: "Pieces become purpose.",
    sub: "Joinery that holds for generations.",
    filters: { brightness: 1.05, contrast: 1.0, saturate: 1.05, sepia: 0.0 },
    scale: [1.04, 1.0],
    overlayOpacity: 0.15,
  },
  {
    id: "finish",
    label: "The Finish",
    start: 0.88,
    end: 1.0,
    image: "/wood/wood_finish.jpg",
    headline: "Built by hand. Built to last.",
    sub: "Cruz Carpentry — Custom Millwork",
    filters: { brightness: 1.1, contrast: 1.0, saturate: 1.15, sepia: 0.08 },
    scale: [1.02, 1.0],
    overlayOpacity: 0.1,
  },
];

export const springConfig = { stiffness: 65, damping: 26 };
