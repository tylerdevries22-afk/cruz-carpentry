"use server";

import { redirect } from "next/navigation";
import {
  clearCustomerCookie,
  getCurrentCustomerId,
  isSessionConfigured,
  setCustomerCookie,
  verifyPassword,
} from "@/lib/customer-auth";
import { getClientIp } from "@/lib/request-ip";
import { recordHitAndCheckLimit } from "@/lib/rate-limit";
import { getServiceSupabase, isServiceConfigured } from "@/lib/supabase/server";

export interface LoginState {
  error?: string;
}

export async function customerLogin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const ip = await getClientIp();
  if (recordHitAndCheckLimit(ip)) return { error: "Too many attempts — please wait a few minutes." };
  if (!isSessionConfigured() || !isServiceConfigured()) {
    return { error: "Sign-in isn't available right now." };
  }
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };
  const supabase = getServiceSupabase();
  if (!supabase) return { error: "Sign-in is unavailable." };
  const { data: c } = await supabase
    .from("customers")
    .select("id, password_hash")
    .eq("email", email)
    .maybeSingle();
  const stored = (c as { id: string; password_hash?: string } | null) ?? null;
  if (!stored || !verifyPassword(password, stored.password_hash)) {
    return { error: "Incorrect email or password." };
  }
  await setCustomerCookie(stored.id);
  redirect("/account");
}

export async function customerLogout(): Promise<void> {
  await clearCustomerCookie();
  redirect("/login");
}

export async function createBooking(
  inquiryId: string,
  preferredDate: string,
  preferredWindow: string,
  notes: string,
): Promise<{ ok: boolean; error?: string }> {
  const cid = await getCurrentCustomerId();
  if (!cid) return { ok: false, error: "Please sign in." };
  const supabase = getServiceSupabase();
  if (!supabase) return { ok: false, error: "Unavailable." };
  // Verify the inquiry belongs to this customer before booking against it.
  const { data: inq } = await supabase
    .from("inquiries")
    .select("id, customer_id")
    .eq("id", inquiryId)
    .maybeSingle();
  if (!inq || (inq as { customer_id?: string }).customer_id !== cid) {
    return { ok: false, error: "Project not found." };
  }
  const { error } = await supabase.from("consultation_bookings").insert({
    inquiry_id: inquiryId,
    customer_id: cid,
    preferred_date: preferredDate || null,
    preferred_window: preferredWindow || null,
    notes: notes || null,
  });
  return { ok: !error, error: error ? "Could not save your request." : undefined };
}
