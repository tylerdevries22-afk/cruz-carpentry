/**
 * Loads the active site-content override from Supabase and deep-merges it over
 * the in-code seeds (SEED_COPY for page copy, SERVICES for service/card data).
 * Mirrors the rate-source pattern, but for STATIC marketing pages: the read is
 * wrapped in `unstable_cache` tagged CONTENT_TAG, so pages stay prerendered and
 * an admin "Save" calls `revalidateTag(CONTENT_TAG)` to push edits live without
 * a redeploy. Fails open to the seeds on any error.
 */

import "server-only";
import { unstable_cache } from "next/cache";
import { getServiceSupabase, isServiceConfigured } from "@/lib/supabase/server";
import { SEED_COPY, type CopyTree } from "./copy";
import { SERVICES, type Service } from "@/lib/services";
import type { ContentOverride, EditableService } from "./types";

/** Cache tag busted by saveContentOverrides / revertContentToSeed. */
export const CONTENT_TAG = "site-content";

export interface ResolvedContent {
  copy: CopyTree;
  services: Service[];
  source: "db" | "seed";
}

const UNSAFE_KEYS = new Set(["__proto__", "constructor", "prototype"]);
type Json = Record<string, unknown>;
function isObj(v: unknown): v is Json {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Deep-merge a partial override onto a base. Arrays are REPLACED wholesale
 *  (copy lists / materials / faq are edited as complete arrays). Prototype-
 *  polluting keys are skipped. */
function deepMerge<T>(base: T, override: unknown): T {
  if (!isObj(override)) return base;
  const out: Json = { ...(base as unknown as Json) };
  for (const [k, v] of Object.entries(override)) {
    if (UNSAFE_KEYS.has(k)) continue;
    out[k] = isObj(v) && isObj(out[k]) ? deepMerge(out[k], v) : v;
  }
  return out as unknown as T;
}

/** Read the active override row (no cache). Fails open to `{}`. */
async function fetchActiveOverride(): Promise<ContentOverride> {
  if (!isServiceConfigured()) return {};
  const supabase = getServiceSupabase();
  if (!supabase) return {};
  try {
    const { data, error } = await supabase
      .from("content_config")
      .select("overrides")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    const ov = (data as { overrides?: unknown } | null)?.overrides;
    return isObj(ov) ? (ov as ContentOverride) : {};
  } catch (error) {
    console.error(
      `[content] load failed — using seed defaults: ${(error as { message?: string })?.message ?? "?"}`,
    );
    return {};
  }
}

// Cached read for public (static/ISR) pages. Invalidated on save via the tag.
const getCachedOverride = unstable_cache(fetchActiveOverride, ["content-config-active"], {
  tags: [CONTENT_TAG],
});

/** Re-attach the editable overrides onto the in-code services (Icon, slug,
 *  galleryIndices, projectType always come from the seed). */
function resolveServices(svcOv?: Record<string, Partial<EditableService>>): Service[] {
  if (!svcOv || Object.keys(svcOv).length === 0) return SERVICES;
  return SERVICES.map((s) => {
    const o = svcOv[s.slug];
    return o ? (deepMerge(s, o) as Service) : s;
  });
}

export async function loadContent(opts?: { force?: boolean }): Promise<ResolvedContent> {
  const override = opts?.force ? await fetchActiveOverride() : await getCachedOverride();
  const copy = deepMerge(SEED_COPY as unknown as CopyTree, override.copy);
  const services = resolveServices(override.services);
  const source: "db" | "seed" = override.copy || override.services ? "db" : "seed";
  return { copy, services, source };
}

/* ---------- convenience getters (cached path) ---------- */

export async function getResolvedCopy(): Promise<CopyTree> {
  return (await loadContent()).copy;
}

export async function getResolvedServices(): Promise<Service[]> {
  return (await loadContent()).services;
}

/** Services in homepage display order (by `num`) — DB-aware replacement for
 *  the static SERVICES_ORDERED. */
export async function getResolvedServicesOrdered(): Promise<Service[]> {
  const services = await getResolvedServices();
  return [...services].sort((a, b) => a.num.localeCompare(b.num));
}

export async function getResolvedServiceBySlug(slug: string): Promise<Service | undefined> {
  return (await getResolvedServices()).find((s) => s.slug === slug);
}
