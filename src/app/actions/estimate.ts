"use server";

import { headers } from "next/headers";
import { PHONE } from "@/lib/constants";
import { parseEstimate, type EstimateField } from "@/lib/estimate-schema";
import { withRetry, isPermanentDbError } from "@/lib/retry";
import { getServiceSupabase, isServiceConfigured } from "@/lib/supabase/server";
import type { LeadInsert } from "@/lib/supabase/types";

export interface EstimateState {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<EstimateField, string>>;
}

export const initialEstimateState: EstimateState = {
  status: "idle",
  message: "",
};

const CONTACT_FALLBACK = `Please call us at ${PHONE}.`;

// Best-effort in-memory rate limit. It resets on cold start and is per-instance,
// so treat it as a first line of defense, not a guarantee. Back it with a shared
// store (Upstash, Supabase) if abuse becomes a problem.
const RATE_LIMIT = { max: 5, windowMs: 10 * 60_000 };
const MAX_TRACKED_IPS = 10_000;
const recentHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (recentHits.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT.windowMs,
  );
  recent.push(now);
  recentHits.set(ip, recent);

  // Bound memory: if the map grows large (e.g. spoofed IPs), drop entries whose
  // timestamps have all aged out of the window.
  if (recentHits.size > MAX_TRACKED_IPS) {
    for (const [key, hits] of recentHits) {
      if (hits.every((t) => now - t >= RATE_LIMIT.windowMs)) {
        recentHits.delete(key);
      }
    }
  }

  return recent.length > RATE_LIMIT.max;
}

async function getClientIp(): Promise<string> {
  const h = await headers();
  // Prefer headers set by the platform edge over the client-spoofable leftmost
  // `x-forwarded-for` hop.
  const platformIp =
    h.get("x-real-ip") || h.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (platformIp) return platformIp;
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/** Read a FormData field as a string; absent keys (`null`) become "". */
function formField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/**
 * Server Action invoked by the estimate form. Validates input, applies spam
 * defenses, and writes the lead to Supabase via the service-role client.
 */
export async function submitEstimate(
  _prevState: EstimateState,
  formData: FormData,
): Promise<EstimateState> {
  // Honeypot: bots fill this hidden field; humans never see it. Pretend success
  // so we don't reveal the check.
  const honeypot = formData.get("company");
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return { status: "success", message: "Thanks! We'll be in touch shortly." };
  }

  const ip = await getClientIp();
  if (isRateLimited(ip)) {
    return {
      status: "error",
      message: `Too many requests — please try again in a few minutes, or call us at ${PHONE}.`,
    };
  }

  const parsed = parseEstimate({
    name: formField(formData, "name"),
    phone: formField(formData, "phone"),
    email: formField(formData, "email"),
    projectType: formField(formData, "projectType"),
    message: formField(formData, "message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors: parsed.fieldErrors,
    };
  }

  const supabase = isServiceConfigured() ? getServiceSupabase() : null;
  if (!supabase) {
    console.error("[estimate] Supabase service client is not configured.");
    return {
      status: "error",
      message: `We couldn't submit your request right now. ${CONTACT_FALLBACK}`,
    };
  }

  const lead: LeadInsert = {
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email ?? null,
    project_type: parsed.data.projectType ?? null,
    message: parsed.data.message ?? null,
    source: "website_estimate_form",
  };

  try {
    await withRetry(
      async () => {
        const { error } = await supabase.from("leads").insert(lead);
        if (error) throw error;
      },
      // Don't retry permanent failures (e.g. constraint violations); a second
      // attempt would only duplicate work.
      { retries: 1, delayMs: 400, shouldRetry: (e) => !isPermanentDbError(e) },
    );
  } catch (error) {
    // Log only the error identity — never the lead's PII or the raw object,
    // which can echo submitted values back on a constraint violation.
    const code = (error as { code?: string; message?: string } | null)?.code;
    const message = (error as { message?: string } | null)?.message;
    console.error(`[estimate] lead insert failed (code=${code ?? "?"}): ${message ?? "unknown error"}`);
    return {
      status: "error",
      message: `Something went wrong submitting your request. ${CONTACT_FALLBACK}`,
    };
  }

  return {
    status: "success",
    message:
      "Thanks! Cruz Carpentry will reach out shortly to schedule your free estimate.",
  };
}
