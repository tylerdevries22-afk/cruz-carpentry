import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/request-ip";
import { recordHitAndCheckLimit, isOverSupabaseRateLimit } from "@/lib/rate-limit";
import { getServiceSupabase, isServiceConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

const BUCKET = "careers-uploads";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const UUID_RE = /^[0-9a-f-]{36}$/i;

// Which file kinds may be uploaded, their on-disk prefix, accepted extensions,
// and how many of each a single application session may hold.
const KINDS = {
  resume: { docs: true, max: 5 },
  cover: { docs: true, max: 5 },
  photo: { docs: false, max: 8 },
} as const;
type Kind = keyof typeof KINDS;

const CONTENT_TYPE: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/** Sniff the real file type from magic bytes — never trust the client. */
function sniffDoc(b: Uint8Array): "pdf" | "docx" | "doc" | null {
  if (b.length >= 4 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return "pdf"; // %PDF
  if (b.length >= 4 && b[0] === 0x50 && b[1] === 0x4b && (b[2] === 0x03 || b[2] === 0x05 || b[2] === 0x07)) return "docx"; // PK zip (docx)
  if (b.length >= 8 && b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0) return "doc"; // legacy OLE .doc
  return null;
}
function sniffImage(b: Uint8Array): "jpg" | "png" | "webp" | null {
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (
    b.length >= 12 &&
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  )
    return "webp";
  return null;
}

const json = (body: object, status = 200) => NextResponse.json(body, { status });

/**
 * POST /api/careers/uploads — upload one application file to the PRIVATE
 * careers bucket. FormData: file (Blob), uploadToken (uuid), kind
 * (resume|cover|photo). Rate-limited; validates token, kind, size, real type
 * (magic bytes), per-(token,kind) count. Returns the storage path to record on
 * the application at submit.
 */
export async function POST(req: Request): Promise<Response> {
  const ip = await getClientIp();
  if (recordHitAndCheckLimit(ip)) return json({ ok: false, error: "rate_limited" }, 429);
  if (!isServiceConfigured()) return json({ ok: false, error: "not_configured" }, 503);
  const supabase = getServiceSupabase();
  if (!supabase) return json({ ok: false, error: "not_configured" }, 503);
  if (await isOverSupabaseRateLimit(supabase, ip)) return json({ ok: false, error: "rate_limited" }, 429);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ ok: false, error: "invalid_form" }, 400);
  }

  const uploadToken = String(form.get("uploadToken") ?? "");
  if (!UUID_RE.test(uploadToken)) return json({ ok: false, error: "invalid_token" }, 400);

  const kind = String(form.get("kind") ?? "") as Kind;
  if (!(kind in KINDS)) return json({ ok: false, error: "invalid_kind" }, 400);
  const rules = KINDS[kind];

  const file = form.get("file");
  if (!(file instanceof Blob) || file.size === 0) return json({ ok: false, error: "no_file" }, 400);
  if (file.size > MAX_BYTES) return json({ ok: false, error: "too_large" }, 413);

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = rules.docs ? sniffDoc(buffer.subarray(0, 16)) : sniffImage(buffer.subarray(0, 16));
  if (!ext) return json({ ok: false, error: "unsupported_type" }, 415);

  // Per-(token, kind) count cap.
  const { data: existing } = await supabase.storage
    .from(BUCKET)
    .list(uploadToken, { limit: 100, search: `${kind}-` });
  const sameKind = (existing ?? []).filter((o) => o.name.startsWith(`${kind}-`));
  if (sameKind.length >= rules.max) return json({ ok: false, error: "too_many" }, 409);

  const path = `${uploadToken}/${kind}-${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: CONTENT_TYPE[ext], upsert: false });
  if (error) {
    console.error(`[careers] upload failed: ${error.message}`);
    return json({ ok: false, error: "upload_failed" }, 500);
  }

  const name = (file instanceof File ? file.name : `${kind}.${ext}`).slice(0, 200);
  return json({ ok: true, path, name, bytes: file.size, kind });
}
