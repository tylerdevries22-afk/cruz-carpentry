"use server";

import { redirect } from "next/navigation";
import {
  clearAdminCookie,
  isAdmin,
  isAdminConfigured,
  setAdminCookie,
  verifyPassword,
} from "@/lib/admin-auth";
import { getClientIp } from "@/lib/request-ip";
import { recordHitAndCheckLimit, isOverSupabaseRateLimit } from "@/lib/rate-limit";
import { getServiceSupabase, isServiceConfigured } from "@/lib/supabase/server";

export interface AdminLoginState {
  error?: string;
}

const STATUSES = [
  "draft",
  "submitted",
  "reviewing",
  "contacted",
  "quoted",
  "scheduled",
  "won",
  "lost",
] as const;

export async function adminLogin(
  _prev: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const ip = await getClientIp();
  const tooMany: AdminLoginState = { error: "Too many attempts — please wait a few minutes." };
  // Brute-force gate: L1 per-instance, plus the shared Supabase limiter keyed to
  // the login namespace so the cap holds across instances. Fail CLOSED — a
  // limiter outage must not lift throttling on the admin login.
  if (recordHitAndCheckLimit(`admin-login:${ip}`)) return tooMany;
  if (isServiceConfigured()) {
    const supabase = getServiceSupabase();
    if (supabase && (await isOverSupabaseRateLimit(supabase, `admin-login:${ip}`, { failClosed: true }))) {
      return tooMany;
    }
  }
  if (!isAdminConfigured()) {
    return { error: "Admin access is not configured on this environment." };
  }
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    return { error: "Incorrect password." };
  }
  await setAdminCookie();
  redirect("/admin");
}

export async function adminLogout(): Promise<void> {
  await clearAdminCookie();
  redirect("/admin/login");
}

export async function updateInquiryStatus(
  id: string,
  status: string,
): Promise<{ ok: boolean }> {
  if (!(await isAdmin())) return { ok: false };
  if (!(STATUSES as readonly string[]).includes(status)) return { ok: false };
  const supabase = getServiceSupabase();
  if (!supabase) return { ok: false };
  const { error } = await supabase
    .from("inquiries")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  return { ok: !error };
}

/** Triage status for a quick "Request a Quote" lead (public.leads). */
export async function updateLeadStatus(
  id: string,
  status: string,
): Promise<{ ok: boolean }> {
  if (!(await isAdmin())) return { ok: false };
  if (!(STATUSES as readonly string[]).includes(status)) return { ok: false };
  const supabase = getServiceSupabase();
  if (!supabase) return { ok: false };
  const { error } = await supabase
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  return { ok: !error };
}

const UNSAFE_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Recursively validate a pricing override: every leaf must be a finite number
 * in [0, 1e7], objects may nest, and no key may be prototype-polluting. Returns
 * an error string on the first problem, or null when the whole tree is valid.
 */
function validateOverrideTree(node: unknown, path = ""): string | null {
  if (typeof node === "number") {
    if (!Number.isFinite(node) || node < 0 || node > 10_000_000) {
      return `"${path || "value"}" must be a number between 0 and 10,000,000.`;
    }
    return null;
  }
  if (typeof node !== "object" || node === null || Array.isArray(node)) {
    return `"${path || "value"}" must be a number or an object of numbers.`;
  }
  for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
    if (UNSAFE_KEYS.has(k)) return `Disallowed key "${k}".`;
    const err = validateOverrideTree(v, path ? `${path}.${k}` : k);
    if (err) return err;
  }
  return null;
}

/**
 * Save a new active pricing_config override (a partial RateSnapshot merged over
 * the in-code seed). Append-only: deactivates the current active row and
 * inserts a new version. Takes effect within the rate-source cache TTL (~10m).
 */
export async function saveRateOverrides(
  overridesJson: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Not authorized." };
  let parsed: unknown;
  try {
    parsed = JSON.parse(overridesJson);
  } catch {
    return { ok: false, error: "Invalid JSON." };
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { ok: false, error: "Overrides must be a JSON object." };
  }
  const allowedTop = new Set(["materials", "hardware", "labor"]);
  for (const k of Object.keys(parsed as Record<string, unknown>)) {
    if (!allowedTop.has(k)) {
      return { ok: false, error: `Unknown top-level key "${k}". Use materials, hardware, or labor.` };
    }
  }
  // Validate the whole tree: leaves must be finite, sane numbers and no key may
  // be prototype-polluting — a hostile/typo'd payload is deep-merged into the
  // live engine and would otherwise corrupt or crash every public estimate.
  const valueError = validateOverrideTree(parsed);
  if (valueError) return { ok: false, error: valueError };
  const supabase = getServiceSupabase();
  if (!supabase) return { ok: false, error: "Not configured." };
  const { data: latest } = await supabase
    .from("pricing_config")
    .select("version")
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextVersion = (((latest as { version?: number } | null)?.version ?? 0) as number) + 1;
  await supabase.from("pricing_config").update({ is_active: false }).eq("is_active", true);
  const { error } = await supabase
    .from("pricing_config")
    .insert({ version: nextVersion, label: "admin-edit", overrides: parsed, is_active: true });
  if (error) return { ok: false, error: "Save failed." };
  return { ok: true };
}

/** Deactivate all rate overrides → engine reverts to the in-code seed. */
export async function revertRatesToSeed(): Promise<{ ok: boolean }> {
  if (!(await isAdmin())) return { ok: false };
  const supabase = getServiceSupabase();
  if (!supabase) return { ok: false };
  const { error } = await supabase.from("pricing_config").update({ is_active: false }).eq("is_active", true);
  return { ok: !error };
}
