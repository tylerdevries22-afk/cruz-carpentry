"use server";

import { PHONE } from "@/lib/constants";
import { applicationSchema, APPLICATION_STATUSES, type FileMeta } from "@/lib/careers-schema";
import { getClientIp } from "@/lib/request-ip";
import { withRetry, isPermanentDbError } from "@/lib/retry";
import { recordHitAndCheckLimit, isOverSupabaseRateLimit } from "@/lib/rate-limit";
import { getServiceSupabase, isServiceConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin-auth";

export interface ApplicationResult {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}

const CONTACT_FALLBACK = `If it keeps happening, call us at ${PHONE}.`;

/**
 * Persist a carpenter application: validate, rate-limit, bind uploaded files to
 * this session's token, and insert into public.job_applications via the
 * service-role client. Called directly (typed object) from the client form.
 */
export async function submitApplication(payload: unknown): Promise<ApplicationResult> {
  const parsed = applicationSchema.safeParse(payload);

  // Honeypot — pretend success without persisting.
  if (parsed.success && parsed.data.company && parsed.data.company.length > 0) {
    return { ok: true, message: "Thanks! We've received your application." };
  }

  const ip = await getClientIp();
  const tooMany: ApplicationResult = {
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

  // Bind every uploaded file to THIS session's token — a payload can't reference
  // another applicant's files.
  const prefix = `${data.uploadToken}/`;
  const allFiles: FileMeta[] = [
    data.resume,
    ...(data.coverLetter ? [data.coverLetter] : []),
    ...data.workPhotos,
  ];
  if (allFiles.some((f) => !f.path.startsWith(prefix))) {
    return { ok: false, message: "Your uploads didn't match this session — please re-attach them." };
  }

  if (!supabase) {
    console.error("[careers] Supabase service client is not configured.");
    return { ok: false, message: `We couldn't submit your application right now. ${CONTACT_FALLBACK}` };
  }

  const row = {
    full_name: data.fullName,
    email: data.email.toLowerCase(),
    phone: data.phone,
    location: data.location,
    work_authorized: data.workAuthorized,
    role: data.role,
    experience_years: data.experienceYears,
    experience_level: data.experienceLevel ?? null,
    current_employer: data.currentEmployer ?? null,
    specialties: data.specialties,
    tools: data.tools,
    certifications: data.certifications,
    availability: data.availability,
    start_date: data.startDate ?? null,
    portfolio_url: data.portfolioUrl ?? null,
    resume: data.resume,
    cover_letter: data.coverLetter ?? null,
    work_photos: data.workPhotos,
    why_cruz: data.whyCruz,
    proud_of: data.proudOf ?? null,
    salary_expectation: data.salaryExpectation ?? null,
    referral_source: data.referralSource,
    referral_name: data.referralName ?? null,
    upload_token: data.uploadToken,
    source: "website_careers",
  };

  try {
    await withRetry(
      async () => {
        const { error } = await supabase.from("job_applications").insert(row);
        if (error) throw error;
      },
      { retries: 1, delayMs: 400, shouldRetry: (e) => !isPermanentDbError(e) },
    );
  } catch (error) {
    const code = (error as { code?: string } | null)?.code;
    const message = (error as { message?: string } | null)?.message;
    console.error(`[careers] insert failed (code=${code ?? "?"}): ${message ?? "unknown"}`);
    return { ok: false, message: `Something went wrong submitting your application. ${CONTACT_FALLBACK}` };
  }

  console.log(`[careers] NEW APPLICATION role=${data.role} years=${data.experienceYears} specialties=${data.specialties.length}`);
  return {
    ok: true,
    message: "Thanks — we've got your application and a real person will review it.",
  };
}

/** Triage status for a job application (admin only). */
export async function updateApplicationStatus(id: string, status: string): Promise<{ ok: boolean }> {
  if (!(await isAdmin())) return { ok: false };
  if (!(APPLICATION_STATUSES as readonly string[]).includes(status)) return { ok: false };
  const supabase = getServiceSupabase();
  if (!supabase) return { ok: false };
  const { error } = await supabase
    .from("job_applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  return { ok: !error };
}
