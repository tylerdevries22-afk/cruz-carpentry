"use server";

import { PHONE } from "@/lib/constants";
import { inquirySubmitSchema } from "@/lib/wizard-schema";
import { priceProject } from "@/lib/pricing";
import type { EstimateInput, EstimateResult } from "@/lib/pricing";
import { scoreLead } from "@/lib/lead-score";
import { getClientIp } from "@/lib/request-ip";
import { withRetry, isPermanentDbError } from "@/lib/retry";
import { recordHitAndCheckLimit, isOverSupabaseRateLimit } from "@/lib/rate-limit";
import { getServiceSupabase, isServiceConfigured } from "@/lib/supabase/server";

export interface InquiryResult {
  ok: boolean;
  message: string;
  estimate?: EstimateResult;
  fieldErrors?: Record<string, string>;
}

const CONTACT_FALLBACK = `Please call us at ${PHONE}.`;

/**
 * Persist a completed wizard submission: validate, rate-limit, compute the
 * estimate with the live market factor, and insert into public.inquiries via
 * the service-role client. Returns the estimate so the success screen can show
 * the range. Called directly (typed object) from the client wizard.
 */
export async function submitInquiry(payload: unknown): Promise<InquiryResult> {
  const parsed = inquirySubmitSchema.safeParse(payload);

  // Honeypot — pretend success without persisting.
  if (parsed.success && parsed.data.company && parsed.data.company.length > 0) {
    return { ok: true, message: "Thanks! We'll be in touch shortly." };
  }

  const ip = await getClientIp();
  const tooMany: InquiryResult = {
    ok: false,
    message: `Too many requests — please try again in a few minutes, or call us at ${PHONE}.`,
  };
  if (recordHitAndCheckLimit(ip)) return tooMany;
  const supabase = isServiceConfigured() ? getServiceSupabase() : null;
  if (supabase && (await isOverSupabaseRateLimit(supabase, ip))) return tooMany;

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
  }

  const data = parsed.data;

  let estimate: EstimateResult;
  try {
    estimate = await priceProject(data as EstimateInput);
  } catch (error) {
    console.error(`[inquiry] pricing failed: ${(error as { message?: string })?.message ?? "?"}`);
    return { ok: false, message: `We couldn't price your project right now. ${CONTACT_FALLBACK}` };
  }

  if (!supabase) {
    console.error("[inquiry] Supabase service client is not configured.");
    return { ok: false, message: `We couldn't submit your request right now. ${CONTACT_FALLBACK}` };
  }

  const lead = scoreLead(
    {
      tier: data.tier,
      projectType: data.projectType,
      budgetBand: data.budgetBand,
      timeline: data.timeline,
      areas: data.areas,
      contactRole: data.contactRole,
      email: data.email,
      zip: data.zip,
    },
    estimate,
  );

  const row = {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email ?? null,
    phone: data.phone,
    zip: data.zip ?? null,
    contact_role: data.contactRole ?? null,
    preferred_contact: data.preferredContact ?? null,
    permission_to_text: data.permissionToText ?? false,
    project_type: data.projectType,
    tier: data.tier,
    finish: data.finish,
    design_style: data.designStyle ?? null,
    timeline: data.timeline ?? null,
    budget_band: data.budgetBand ?? null,
    priority: data.priority ?? null,
    calculator_input: data,
    areas: data.areas,
    est_low: estimate.low,
    est_point: estimate.point,
    est_high: estimate.high,
    est_confidence: estimate.confidence,
    est_breakdown: estimate.breakdown,
    est_market: estimate.market,
    engine_version: estimate.engineVersion,
    rules_version: estimate.rulesVersion,
    lead_score: lead.score,
    lead_category: lead.category,
    lead_factors: lead.factors,
    photos: data.photos ?? [],
    conditions: data.conditions ?? [],
    goals: data.goals ?? [],
    source: "website_estimate_wizard",
  };

  try {
    await withRetry(
      async () => {
        const { error } = await supabase.from("inquiries").insert(row);
        if (error) throw error;
      },
      { retries: 1, delayMs: 400, shouldRetry: (e) => !isPermanentDbError(e) },
    );
  } catch (error) {
    const code = (error as { code?: string } | null)?.code;
    const message = (error as { message?: string } | null)?.message;
    console.error(`[inquiry] insert failed (code=${code ?? "?"}): ${message ?? "unknown"}`);
    return { ok: false, message: `Something went wrong submitting your request. ${CONTACT_FALLBACK}`, estimate };
  }

  // Structured new-lead log (no PII) — visible in runtime logs for triage until
  // the admin dashboard / email notification ships.
  console.log(
    `[inquiry] NEW LEAD score=${lead.score} category=${lead.category} type=${data.projectType} tier=${data.tier} est=${estimate.low}-${estimate.high}`,
  );

  return {
    ok: true,
    message: "Thanks! Cruz Carpentry will review your project and reach out within one business day.",
    estimate,
  };
}
