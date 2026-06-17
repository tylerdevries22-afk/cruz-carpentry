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
import { recordHitAndCheckLimit, isOverSupabaseRateLimit } from "@/lib/rate-limit";
import { getServiceSupabase, isServiceConfigured } from "@/lib/supabase/server";

export interface LoginState {
  error?: string;
}

export async function customerLogin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const ip = await getClientIp();
  const tooMany: LoginState = { error: "Too many attempts — please wait a few minutes." };
  // Brute-force gate: L1 per-instance + shared Supabase limiter, keyed to the
  // login namespace and failing CLOSED so a limiter outage can't lift the cap.
  if (recordHitAndCheckLimit(`customer-login:${ip}`)) return tooMany;
  if (!isSessionConfigured() || !isServiceConfigured()) {
    return { error: "Sign-in isn't available right now." };
  }
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };
  const supabase = getServiceSupabase();
  if (!supabase) return { error: "Sign-in is unavailable." };
  if (await isOverSupabaseRateLimit(supabase, `customer-login:${ip}`, { failClosed: true })) {
    return tooMany;
  }
  const { data: c } = await supabase
    .from("customers")
    .select("id, password_hash")
    .eq("email", email)
    .maybeSingle();
  const stored = (c as { id: string; password_hash?: string } | null) ?? null;
  // Always call verifyPassword (it runs scrypt even with no stored hash) so a
  // missing account can't be distinguished from a wrong password by timing.
  const ok = verifyPassword(password, stored?.password_hash);
  if (!ok || !stored) {
    return { error: "Incorrect email or password." };
  }
  await setCustomerCookie(stored.id);
  redirect("/account");
}

export async function customerLogout(): Promise<void> {
  await clearCustomerCookie();
  redirect("/login");
}

const BOOKING_WINDOWS = new Set(["morning", "afternoon", "evening"]);
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function createBooking(
  inquiryId: string,
  preferredDate: string,
  preferredWindow: string,
  notes: string,
): Promise<{ ok: boolean; error?: string }> {
  const cid = await getCurrentCustomerId();
  if (!cid) return { ok: false, error: "Please sign in." };

  // Validate the free-text inputs server-side — the client form is the only
  // caller today, but a Server Action is a public endpoint.
  const date = preferredDate.trim();
  if (date && !ISO_DATE_RE.test(date)) {
    return { ok: false, error: "Enter a valid date." };
  }
  const win = preferredWindow.trim();
  if (win && !BOOKING_WINDOWS.has(win)) {
    return { ok: false, error: "Pick a valid time window." };
  }
  const cleanNotes = notes.trim().slice(0, 1000);

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
    preferred_date: date || null,
    preferred_window: win || null,
    notes: cleanNotes || null,
  });
  return { ok: !error, error: error ? "Could not save your request." : undefined };
}
