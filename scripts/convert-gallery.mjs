// One-off: convert source photos into web-optimized WebP and emit the gallery
// manifest (src/components/gallery/photos.ts). Produces two variants per photo:
//   - full:  <=1920px longest edge      → used in the lightbox (no crop)
//   - thumb: 1000x1000 centered square   → used in the uniform grid
//
// Usage: node scripts/convert-gallery.mjs <source-dir>
// Source assets live outside the repo; re-run only when the photo set changes.
// Output order is lexicographic by source filename, so cruz-NN is not stable if
// the source set is renamed or has files inserted — re-running rewrites all
// names, the captions mapping below, and the manifest.
import { readdir, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const MAX_EDGE = 1920;
const THUMB = 700;
const QUALITY = 80;

// Curated alt text, indexed by output number (cruz-01 = index 0). Derived from
// a visual review of each photo; keep in sync if the source set changes.
const CAPTIONS = [
  "Custom solid-wood dining table in a renovated kitchen with white cabinetry", // 01
  "Hardwood staircase with iron balusters and raised-panel wainscoting", // 02
  "Open staircase with a custom iron-baluster railing", // 03
  "Second-floor landing railing with iron balusters", // 04
  "Loft railing with iron balusters overlooking the main floor", // 05
  "Stairwell railing with iron balusters and a wood handrail", // 06
  "Custom floating wood shelves mounted on a wall", // 07
  "Staircase framing with newel posts and railing in progress", // 08
  "Custom kitchen island cabinetry under construction", // 09
  "Built-in bookshelves and entertainment center against a blue wall", // 10
  "Under-stair built-in cabinetry and shelving", // 11
  "Built-in pantry shelving in a custom niche", // 12
  "Floor-to-ceiling wardrobe cabinetry", // 13
  "Custom kitchen cabinetry installation", // 14
  "Built-in bookcase with a cabinet base and drawers", // 15
  "Kitchen cabinetry paired with floating wood shelves", // 16
  "Mudroom built-in lockers and cabinetry", // 17
  "Custom kitchen and pantry cabinetry with islands", // 18
  "Built-in storage bench with a window seat", // 19
  "Rustic sliding barn door", // 20
  "Built-in cubby shelving unit", // 21
  "Staircase railing with iron balusters, overhead view", // 22
  "Tall built-in pantry cabinet with wainscoting", // 23
  "Custom built-in bunk beds", // 24
  "Custom loft bed with built-in stairs and a desk", // 25
  "Mudroom cubbies with a built-in bench", // 26
  "Custom closet shelving system framed out", // 27
  "Exposed ceiling beam installation in progress", // 28
  "Walk-in closet system with drawers and shelving", // 29
  "Staircase with iron balusters and reclaimed-wood risers", // 30
  "New staircase under construction", // 31
  "Finished staircase with iron balusters", // 32
  "Wood ceiling beam and range-hood surround with window trim", // 33
  "Kitchen with a marble island and a custom wood range hood", // 34
  "Coffered wood ceiling with custom trim", // 35
  "Custom window and ceiling trim detail", // 36
  "Raised-panel wall paneling and cased openings", // 37
  "Cruz Carpentry craftsman on site", // 38
  "Exposed beam ceiling with custom window trim", // 39
  "Fireplace with a timber mantel and tile surround", // 40
  "Custom wood kitchen with floating shelves and a range hood", // 41
  "Modern cable-rail loft railing", // 42
];

const sourceDir = process.argv[2];
if (!sourceDir) {
  console.error("Usage: node scripts/convert-gallery.mjs <source-dir>");
  process.exit(1);
}

const projectRoot = path.resolve(import.meta.dirname, "..");
const outDir = path.join(projectRoot, "public", "gallery");
const thumbDir = path.join(outDir, "thumb");
const manifestPath = path.join(projectRoot, "src", "components", "gallery", "photos.ts");

// Start clean so a shrinking source set can't orphan stale files.
await rm(outDir, { recursive: true, force: true });
await mkdir(thumbDir, { recursive: true });

const sources = (await readdir(sourceDir))
  .filter((f) => /\.(jpe?g|png)$/i.test(f))
  .sort();

const photos = [];
let index = 0;

for (const file of sources) {
  index += 1;
  const name = `cruz-${String(index).padStart(2, "0")}.webp`;
  const input = path.join(sourceDir, file);

  // Full image (lightbox) — auto-oriented, capped, no crop.
  const full = await sharp(input)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    // Warm & golden grade — applied identically to every photo for a cohesive look.
    .modulate({ saturation: 1.14 })
    .linear([1.14, 1.04, 0.9], [-10, -8, -4])
    .webp({ quality: QUALITY })
    .toFile(path.join(outDir, name));

  // Square thumbnail (grid) — centered cover crop + gentle sharpen.
  await sharp(input)
    .rotate()
    .resize(THUMB, THUMB, { fit: "cover", position: "centre" })
    .sharpen({ sigma: 0.6 })
    .modulate({ saturation: 1.14 })
    .linear([1.14, 1.04, 0.9], [-10, -8, -4])
    .webp({ quality: QUALITY })
    .toFile(path.join(thumbDir, name));

  photos.push({
    thumb: `/gallery/thumb/${name}`,
    full: `/gallery/${name}`,
    width: full.width,
    height: full.height,
    alt: CAPTIONS[index - 1] ?? `Custom carpentry by Cruz Carpentry — project ${index}`,
  });
  console.log(`${file} -> ${name} (full ${full.width}x${full.height})`);
}

const body = `// AUTO-GENERATED by scripts/convert-gallery.mjs — do not edit by hand.
export interface GalleryPhoto {
  /** Centered 1000x1000 square crop, used in the grid. */
  thumb: string;
  /** Full uncropped image (<=1920px), used in the lightbox. */
  full: string;
  /** Intrinsic dimensions of the full image. */
  width: number;
  height: number;
  alt: string;
}

export const GALLERY_PHOTOS: GalleryPhoto[] = ${JSON.stringify(photos, null, 2)};
`;

await writeFile(manifestPath, body);
console.log(`\nWrote ${photos.length} photos (full + thumb) and manifest.`);
