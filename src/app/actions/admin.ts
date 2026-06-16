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
