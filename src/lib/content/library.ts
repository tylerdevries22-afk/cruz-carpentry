import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { WHAT_WE_BUILD_BUCKET, publicUrl } from "./storage";

const KINDS = ["ai-generated", "real-photos"] as const;
const IMAGE_RE = /\.(webp|jpg|jpeg|png)$/i;

export interface LibraryFolder {
  category: string;
  kind: string;
  images: string[];
}

/**
 * Enumerate image objects in the what-we-build bucket, grouped by
 * `<category>/<ai-generated|real-photos>`. Used by the Cards editor's image
 * picker so a thumbnail can be chosen from existing media (no uploads).
 */
export async function listLibrary(supabase: SupabaseClient): Promise<LibraryFolder[]> {
  const { data: top, error } = await supabase.storage
    .from(WHAT_WE_BUILD_BUCKET)
    .list("", { limit: 200 });
  if (error) throw error;

  // Top-level entries with no file extension are category folders.
  const categories = (top ?? [])
    .map((o) => o.name)
    .filter((name) => name && !IMAGE_RE.test(name))
    .sort((a, b) => a.localeCompare(b));

  const folders: LibraryFolder[] = [];
  for (const category of categories) {
    for (const kind of KINDS) {
      const { data: files } = await supabase.storage
        .from(WHAT_WE_BUILD_BUCKET)
        .list(`${category}/${kind}`, { limit: 200, sortBy: { column: "name", order: "asc" } });
      const images = (files ?? [])
        .filter((f) => IMAGE_RE.test(f.name))
        .map((f) => publicUrl(`${category}/${kind}/${f.name}`));
      if (images.length > 0) folders.push({ category, kind, images });
    }
  }
  return folders;
}
