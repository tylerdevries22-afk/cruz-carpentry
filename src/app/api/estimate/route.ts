import { NextResponse } from "next/server";
import { z } from "zod";
import { estimateInputSchema } from "@/lib/wizard-schema";
import { priceProject } from "@/lib/pricing";
import type { EstimateInput } from "@/lib/pricing";
import { getClientIp } from "@/lib/request-ip";
import { recordHitAndCheckLimit, isOverSupabaseRateLimit } from "@/lib/rate-limit";
import { getServiceSupabase, isServiceConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * POST /api/estimate — preliminary estimate range for the wizard's review step.
 * Validates input, applies the same L1+L2 rate limiting as the form, runs the
 * pricing engine with the LIVE wood-material market factor, and returns the
 * range. No persistence (that happens on final submit).
 */
export async function POST(req: Request): Promise<Response> {
  const ip = await getClientIp();
  if (recordHitAndCheckLimit(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }
  const supabase = isServiceConfigured() ? getServiceSupabase() : null;
  if (supabase && (await isOverSupabaseRateLimit(supabase, ip))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = estimateInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_input", issues: z.treeifyError(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const estimate = await priceProject(parsed.data as EstimateInput);
    return NextResponse.json(
      { ok: true, estimate },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message = (error as { message?: string } | null)?.message ?? "unknown";
    console.error(`[api/estimate] pricing failed: ${message}`);
    return NextResponse.json({ ok: false, error: "pricing_failed" }, { status: 500 });
  }
}
