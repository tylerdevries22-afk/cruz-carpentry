"use server";

import { isAdmin } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/server";
import { STAGE_KEYS, type JobMaterial, type StageKey } from "@/lib/jobs";

/** Move a job to a pipeline stage (admin only). Marks complete at "done". */
export async function setJobStage(id: string, stage: string): Promise<{ ok: boolean }> {
  if (!(await isAdmin())) return { ok: false };
  if (!(STAGE_KEYS as string[]).includes(stage)) return { ok: false };
  const supabase = getServiceSupabase();
  if (!supabase) return { ok: false };
  const status = stage === "done" ? "complete" : "active";
  const { error } = await supabase
    .from("jobs")
    .update({ stage: stage as StageKey, status, updated_at: new Date().toISOString() })
    .eq("id", id);
  return { ok: !error };
}

/** Toggle one shopping-list item's purchased flag (admin only). */
export async function toggleMaterial(jobId: string, materialId: string): Promise<{ ok: boolean }> {
  if (!(await isAdmin())) return { ok: false };
  const supabase = getServiceSupabase();
  if (!supabase) return { ok: false };
  const { data, error } = await supabase.from("jobs").select("materials").eq("id", jobId).maybeSingle();
  if (error || !data) return { ok: false };
  const materials = (data.materials ?? []) as JobMaterial[];
  const next = materials.map((m) => (m.id === materialId ? { ...m, purchased: !m.purchased } : m));
  const { error: upErr } = await supabase
    .from("jobs")
    .update({ materials: next, updated_at: new Date().toISOString() })
    .eq("id", jobId);
  return { ok: !upErr };
}
