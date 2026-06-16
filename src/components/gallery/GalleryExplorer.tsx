"use client";

import { useState } from "react";
import { Gallery } from "./Gallery";
import { GALLERY_PHOTOS } from "./photos";

// Filter categories → 1-based cruz-NN photo indices (from the curated captions).
const CATEGORIES: { label: string; indices: number[] | null }[] = [
  { label: "All Work", indices: null },
  { label: "Kitchens & Islands", indices: [1, 9, 14, 16, 18, 34, 41] },
  { label: "Staircases & Railings", indices: [2, 3, 4, 5, 6, 8, 22, 30, 31, 32, 42] },
  { label: "Built-Ins & Shelving", indices: [7, 10, 11, 12, 15, 19, 21] },
  { label: "Closets & Storage", indices: [13, 23, 27, 29] },
  { label: "Mudrooms", indices: [17, 26] },
  { label: "Ceilings & Beams", indices: [28, 33, 35, 39] },
  { label: "Trim & Paneling", indices: [23, 36, 37] },
  { label: "Fireplaces", indices: [40] },
  { label: "Doors", indices: [20] },
  { label: "Specialty Builds", indices: [19, 24, 25] },
];

export function GalleryExplorer() {
  const [active, setActive] = useState("All Work");
  const category = CATEGORIES.find((c) => c.label === active) ?? CATEGORIES[0];
  const photos = category.indices
    ? category.indices.map((n) => GALLERY_PHOTOS[n - 1]).filter(Boolean)
    : GALLERY_PHOTOS;

  return (
    <div className="bg-[#F0E8DC]">
      {/* Filter chips */}
      <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-2.5 px-6 pt-16 sm:pt-20">
        {CATEGORIES.map((c) => {
          const isActive = c.label === active;
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => setActive(c.label)}
              aria-pressed={isActive}
              className={`min-h-[40px] rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F0E8DC] ${
                isActive
                  ? "bg-[#B45309] text-white"
                  : "border border-[#D6CCBA] bg-white text-[#57534E] hover:border-[#CA8A04]/50 hover:text-[#1C1917] active:bg-[#FAF7F2]"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <Gallery
        photos={photos}
        eyebrow="Portfolio"
        heading={
          <>
            {active === "All Work" ? "Built with purpose," : `${active},`}
            <br />
            <em className="italic">finished with care</em>
          </>
        }
        subheading={`${photos.length} ${photos.length === 1 ? "project" : "projects"} · open any photo to view it full size`}
        id="work"
      />
    </div>
  );
}
