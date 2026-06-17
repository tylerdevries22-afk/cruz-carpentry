"use server";

import { PHONE } from "@/lib/constants";
import { parseEstimate, type EstimateField } from "@/lib/estimate-schema";
import { getClientIp } from "@/lib/request-ip";
import { withRetry, isPermanentDbError } from "@/lib/retry";
import { recordHitAndCheckLimit, isOverSupabaseRateLimit } from "@/lib/rate-limit";
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
  const tooManyRequests: EstimateState = {
    status: "error",
    message: `Too many requests — please try again in a few minutes, or call us at ${PHONE}.`,
  };

  // Spam defense, cheapest first: per-instance L1, then the shared Supabase L2
  // limiter that holds across serverless instances.
  if (recordHitAndCheckLimit(ip)) return tooManyRequests;

  const supabase = isServiceConfigured() ? getServiceSupabase() : null;
  if (supabase && (await isOverSupabaseRateLimit(supabase, ip))) {
    return tooManyRequests;
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
