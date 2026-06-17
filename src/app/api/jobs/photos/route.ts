import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getServiceSupabase, isServiceConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

const BUCKET = "what-we-build"; // public bucket; job photos live under jobs/<id>/
const MAX_BYTES = 10 * 1024 * 1024;
const UUID_RE = /^[0-9a-f-]{36}$/i;

function sniff(b: Uint8Array): "jpg" | "png" | "webp" | null {
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (b.length >= 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "webp";
  return null;
}
const CT: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };
const json = (b: object, s = 200) => NextResponse.json(b, { status: s });

/** POST /api/jobs/photos — admin uploads a job photo to the public bucket and
 * gets back its public URL. FormData: file, jobId (uuid). */
export async function POST(req: Request): Promise<Response> {
  if (!(await isAdmin())) return json({ ok: false, error: "unauthorized" }, 401);
  if (!isServiceConfigured()) return json({ ok: false, error: "not_configured" }, 503);
  const supabase = getServiceSupabase();
  if (!supabase) return json({ ok: false, error: "not_configured" }, 503);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ ok: false, error: "invalid_form" }, 400);
  }
  const jobId = String(form.get("jobId") ?? "");
  if (!UUID_RE.test(jobId)) return json({ ok: false, error: "invalid_job" }, 400);
  const file = form.get("file");
  if (!(file instanceof Blob) || file.size === 0) return json({ ok: false, error: "no_file" }, 400);
  if (file.size > MAX_BYTES) return json({ ok: false, error: "too_large" }, 413);

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = sniff(buffer.subarray(0, 16));
  if (!ext) return json({ ok: false, error: "unsupported_type" }, 415);

  const path = `jobs/${jobId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, { contentType: CT[ext], upsert: false });
  if (error) {
    console.error(`[jobs] photo upload failed: ${error.message}`);
    return json({ ok: false, error: "upload_failed" }, 500);
  }
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
  return json({ ok: true, url });
}
