import { NextResponse } from "next/server";
import { getServiceSupabase, isServiceConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

const BUCKET = "careers-uploads";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * GET /api/cron/cleanup-careers — removes orphaned applicant upload folders:
 * resumes / cover letters / work photos uploaded during a careers session that
 * was never submitted (so no job_application references their `{uploadToken}/`
 * prefix) and are older than 7 days. Invoked by Vercel Cron, which sends
 * `Authorization: Bearer $CRON_SECRET`. Mirrors /api/cron/cleanup-photos.
 */
export async function GET(req: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!isServiceConfigured()) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }
  const supabase = getServiceSupabase();
  if (!supabase) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });

  // Tokens still referenced by a submitted application.
  const { data: rows } = await supabase.from("job_applications").select("upload_token");
  const referenced = new Set<string>();
  for (const r of (rows ?? []) as { upload_token?: string }[]) {
    if (r.upload_token) referenced.add(r.upload_token);
  }

  const { data: folders, error } = await supabase.storage.from(BUCKET).list("", { limit: 1000 });
  if (error) {
    return NextResponse.json({ ok: false, error: "list_failed" }, { status: 500 });
  }

  const cutoff = Date.now() - MAX_AGE_MS;
  let deleted = 0;
  let foldersChecked = 0;
  for (const folder of folders ?? []) {
    const token = folder.name;
    if (!token || referenced.has(token)) continue;
    foldersChecked += 1;
    const { data: objs } = await supabase.storage.from(BUCKET).list(token, { limit: 100 });
    if (!objs || objs.length === 0) continue;
    const newest = Math.max(
      ...objs.map((o) => new Date(o.created_at ?? o.updated_at ?? 0).getTime()),
    );
    if (Number.isFinite(newest) && newest > cutoff) continue; // too recent, keep
    const paths = objs.map((o) => `${token}/${o.name}`);
    const { error: rmErr } = await supabase.storage.from(BUCKET).remove(paths);
    if (!rmErr) deleted += paths.length;
  }

  return NextResponse.json({ ok: true, foldersChecked, deleted });
}
