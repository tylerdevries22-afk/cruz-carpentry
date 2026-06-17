"use server";

import { revalidateTag } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/server";
import { CONTENT_TAG } from "@/lib/content/source";
import { validateContentOverride } from "@/lib/content/validate";

/**
 * Persist a new active site-content override (a partial of { copy, services }
 * deep-merged over the in-code seed). Append-only + versioned like the rate
 * editor, then `revalidateTag` so the change goes live on static pages without
 * a redeploy.
 */
function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export async function saveContentOverrides(
  overridesJson: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Not authorized." };
  let parsed: unknown;
  try {
    parsed = JSON.parse(overridesJson);
  } catch {
    return { ok: false, error: "Invalid JSON." };
  }
  if (!isObj(parsed)) return { ok: false, error: "Overrides must be a JSON object." };

  const supabase = getServiceSupabase();
  if (!supabase) return { ok: false, error: "Not configured." };

  // The Copy editor and Cards editor each own one top-level namespace
  // (`copy` / `services`). Preserve the OTHER namespace from the current active
  // override so saving one doesn't wipe the other.
  const { data: active } = await supabase
    .from("content_config")
    .select("version")
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data: activeRow } = await supabase
    .from("content_config")
    .select("overrides")
    .eq("is_active", true)
    .maybeSingle();
  const current = isObj((activeRow as { overrides?: unknown } | null)?.overrides)
    ? ((activeRow as { overrides: Record<string, unknown> }).overrides)
    : {};
  const merged: Record<string, unknown> = { ...current, ...parsed };

  const invalid = validateContentOverride(merged);
  if (invalid) return { ok: false, error: invalid };

  const nextVersion = (((active as { version?: number } | null)?.version ?? 0) as number) + 1;
  await supabase.from("content_config").update({ is_active: false }).eq("is_active", true);
  const { error } = await supabase
    .from("content_config")
    .insert({ version: nextVersion, label: "admin-edit", overrides: merged, is_active: true });
  if (error) return { ok: false, error: "Save failed." };

  // Push the edit live on the static/ISR public pages without a redeploy.
  revalidateTag(CONTENT_TAG, "max");
  return { ok: true };
}

/** Deactivate all content overrides → the site reverts to the in-code seed. */
export async function revertContentToSeed(): Promise<{ ok: boolean }> {
  if (!(await isAdmin())) return { ok: false };
  const supabase = getServiceSupabase();
  if (!supabase) return { ok: false };
  const { error } = await supabase
    .from("content_config")
    .update({ is_active: false })
    .eq("is_active", true);
  if (!error) revalidateTag(CONTENT_TAG, "max");
  return { ok: !error };
}

/**
 * List images available in the what-we-build bucket so the Cards editor can pick
 * a thumbnail without uploads. Returns public URLs grouped by category folder.
 * Admin-only; uses the service-role storage client.
 */
export async function listLibraryImages(): Promise<{
  ok: boolean;
  folders?: { category: string; kind: string; images: string[] }[];
  error?: string;
}> {
  if (!(await isAdmin())) return { ok: false, error: "Not authorized." };
  const supabase = getServiceSupabase();
  if (!supabase) return { ok: false, error: "Not configured." };
  const { listLibrary } = await import("@/lib/content/library");
  try {
    const folders = await listLibrary(supabase);
    return { ok: true, folders };
  } catch (error) {
    console.error(`[content] listLibraryImages failed: ${(error as { message?: string })?.message ?? "?"}`);
    return { ok: false, error: "Could not load the image library." };
  }
}
