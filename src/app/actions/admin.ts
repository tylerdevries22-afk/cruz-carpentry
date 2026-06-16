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
import { recordHitAndCheckLimit } from "@/lib/rate-limit";
import { getServiceSupabase } from "@/lib/supabase/server";

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
  if (recordHitAndCheckLimit(ip)) {
    return { error: "Too many attempts — please wait a few minutes." };
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
