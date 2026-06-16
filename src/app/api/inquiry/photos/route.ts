import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/request-ip";
import { recordHitAndCheckLimit, isOverSupabaseRateLimit } from "@/lib/rate-limit";
import { getServiceSupabase, isServiceConfigured } from "@/lib/supabase/server";
import { PHOTO_LABELS } from "@/lib/wizard-schema";

export const runtime = "nodejs";

const BUCKET = "inquiry-photos";
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB (client compresses to ~1.5 MB)
const MAX_PER_TOKEN = 12;
const UUID_RE = /^[0-9a-f-]{36}$/i;
const LABELS = new Set<string>(PHOTO_LABELS);

/** Sniff the real type from magic bytes (don't trust the client Content-Type). */
function sniff(bytes: Uint8Array): "jpg" | "png" | "webp" | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && // RIFF
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50 // WEBP
  )
    return "webp";
  return null;
}
const CONTENT_TYPE: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

/**
 * POST /api/inquiry/photos — upload one guided photo to the PRIVATE bucket.
 * FormData: file (Blob), uploadToken (uuid), label (optional). Rate-limited;
 * validates token format, size, real image type (magic bytes), per-token count.
 * Returns the storage path to record on the inquiry at submit.
 */
export async function POST(req: Request): Promise<Response> {
  const ip = await getClientIp();
  if (recordHitAndCheckLimit(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }
  if (!isServiceConfigured()) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }
  const supabase = getServiceSupabase();
  if (!supabase) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  if (await isOverSupabaseRateLimit(supabase, ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_form" }, { status: 400 });
  }

  const uploadToken = String(form.get("uploadToken") ?? "");
  if (!UUID_RE.test(uploadToken)) {
    return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 400 });
  }
  const labelRaw = form.get("label");
  const label = typeof labelRaw === "string" && LABELS.has(labelRaw) ? labelRaw : undefined;

  const file = form.get("file");
  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ ok: false, error: "no_file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buffer.subarray(0, 16));
  if (!kind) {
    return NextResponse.json({ ok: false, error: "unsupported_type" }, { status: 415 });
  }

  // Per-token count cap (cheap list call).
  const { data: existing } = await supabase.storage.from(BUCKET).list(uploadToken, { limit: MAX_PER_TOKEN + 1 });
  if (existing && existing.length >= MAX_PER_TOKEN) {
    return NextResponse.json({ ok: false, error: "too_many" }, { status: 409 });
  }

  const photoId = crypto.randomUUID();
  const path = `${uploadToken}/${photoId}.${kind}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: CONTENT_TYPE[kind], upsert: false });
  if (error) {
    console.error(`[photos] upload failed: ${error.message}`);
    return NextResponse.json({ ok: false, error: "upload_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, path, label, bytes: file.size });
}
