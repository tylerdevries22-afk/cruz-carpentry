import type { GalleryProject } from "@/lib/supabase/types";

/**
 * Fallback gallery used when Supabase has no published projects yet (or env
 * vars aren't configured). These point at the local images already in
 * /public/images so the site renders identically before any data is loaded.
 */
export const SEED_PROJECTS: GalleryProject[] = [
  {
    id: "seed-1",
    title: "Built-In Bookshelves",
    location: "Residential — Denver, CO",
    alt: "Custom floor-to-ceiling bookcase with cabinet base",
    image_url: "/images/project-1.jpg",
    sort_order: 1,
    published: true,
  },
  {
    id: "seed-2",
    title: "Walk-In Closet System",
    location: "Residential — Aurora, CO",
    alt: "Custom walk-in closet shelving system spanning full room",
    image_url: "/images/project-2.jpg",
    sort_order: 2,
    published: true,
  },
  {
    id: "seed-3",
    title: "Home Office Built-In",
    location: "Residential — Lakewood, CO",
    alt: "Built-in home office desk with surrounding shelving",
    image_url: "/images/project-3.jpg",
    sort_order: 3,
    published: true,
  },
];
