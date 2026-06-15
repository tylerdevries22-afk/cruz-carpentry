import { withRetry } from "@/lib/retry";
import { getPublicSupabase } from "@/lib/supabase/public";
import type { GalleryProject } from "@/lib/supabase/types";
import { GalleryClient, type GalleryPhoto } from "./GalleryClient";
import { SEED_PROJECTS } from "./seed";

async function loadProjects(): Promise<GalleryProject[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return SEED_PROJECTS;

  try {
    const rows = await withRetry(
      async () => {
        const { data, error } = await supabase
          .from("gallery_projects")
          .select("id, title, location, alt, image_url, sort_order, published")
          .eq("published", true)
          .order("sort_order", { ascending: true });
        if (error) throw error;
        return data as GalleryProject[];
      },
      { retries: 1, delayMs: 300 },
    );

    return rows.length > 0 ? rows : SEED_PROJECTS;
  } catch (error) {
    console.error("[gallery] failed to load projects, using seed:", error);
    return SEED_PROJECTS;
  }
}

export async function Gallery() {
  const projects = await loadProjects();
  const photos: GalleryPhoto[] = projects.map((p) => ({
    src: p.image_url,
    alt: p.alt,
    label: p.title,
    location: p.location,
  }));

  return <GalleryClient photos={photos} />;
}
