"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/server";
import { STAGE_KEYS, type JobMaterial, type JobNote, type JobPhoto, type StageKey } from "@/lib/jobs";

const str = (v: FormDataEntryValue | null, max = 200) => {
  const s = typeof v === "string" ? v.trim() : "";
  return s.slice(0, max);
};
const numOrNull = (v: FormDataEntryValue | null) => {
  const n = Number(v);
  return typeof v === "string" && v.trim() !== "" && Number.isFinite(n) ? n : null;
};
const dateOrNull = (v: FormDataEntryValue | null) => {
  const s = typeof v === "string" ? v.trim() : "";
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
};

/** Build the editable core columns from a job form (create + edit share this). */
function coreFields(fd: FormData) {
  const stage = str(fd.get("stage"), 20);
  return {
    title: str(fd.get("title"), 160),
    client_name: str(fd.get("client_name"), 120),
    client_email: str(fd.get("client_email"), 200) || null,
    client_phone: str(fd.get("client_phone"), 40) || null,
    address: str(fd.get("address"), 200) || null,
    project_type: str(fd.get("project_type"), 80) || "Custom Woodwork",
    stage: ((STAGE_KEYS as string[]).includes(stage) ? stage : "consult") as StageKey,
    status: stage === "done" ? "complete" : "active",
    start_date: dateOrNull(fd.get("start_date")),
    target_date: dateOrNull(fd.get("target_date")),
    budget_quoted: numOrNull(fd.get("budget_quoted")),
    deposit: numOrNull(fd.get("deposit")),
    cover_image: str(fd.get("cover_image"), 400) || null,
  };
}

export async function createJob(_prev: { error?: string }, fd: FormData): Promise<{ error?: string }> {
  if (!(await isAdmin())) return { error: "Not authorized." };
  const supabase = getServiceSupabase();
  if (!supabase) return { error: "Not configured." };
  const fields = coreFields(fd);
  if (fields.title.length < 2) return { error: "Please enter a job title." };
  if (fields.client_name.length < 2) return { error: "Please enter a client name." };
  const { data, error } = await supabase.from("jobs").insert(fields).select("id").single();
  if (error || !data) return { error: "Could not create the job." };
  revalidatePath("/admin/jobs");
  redirect(`/admin/jobs/${data.id}`);
}

export async function updateJob(id: string, _prev: { error?: string }, fd: FormData): Promise<{ error?: string }> {
  if (!(await isAdmin())) return { error: "Not authorized." };
  const supabase = getServiceSupabase();
  if (!supabase) return { error: "Not configured." };
  const fields = coreFields(fd);
  if (fields.title.length < 2) return { error: "Please enter a job title." };
  const { error } = await supabase.from("jobs").update({ ...fields, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return { error: "Could not save changes." };
  revalidatePath(`/admin/jobs/${id}`);
  redirect(`/admin/jobs/${id}`);
}

export async function deleteJob(id: string): Promise<void> {
  if (!(await isAdmin())) return;
  const supabase = getServiceSupabase();
  if (!supabase) return;
  await supabase.from("jobs").delete().eq("id", id);
  revalidatePath("/admin/jobs");
  redirect("/admin/jobs");
}

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

/* ---------- jsonb-array mutations (read-modify-write) ---------- */

async function patchJob<T>(jobId: string, column: string, fn: (arr: T[]) => T[]): Promise<{ ok: boolean }> {
  if (!(await isAdmin())) return { ok: false };
  const supabase = getServiceSupabase();
  if (!supabase) return { ok: false };
  const { data, error } = await supabase.from("jobs").select(column).eq("id", jobId).maybeSingle();
  if (error || !data) return { ok: false };
  const next = fn(((data as unknown as Record<string, unknown>)[column] ?? []) as T[]);
  const { error: upErr } = await supabase
    .from("jobs")
    .update({ [column]: next, updated_at: new Date().toISOString() })
    .eq("id", jobId);
  return { ok: !upErr };
}

export async function toggleMaterial(jobId: string, materialId: string) {
  return patchJob<JobMaterial>(jobId, "materials", (arr) =>
    arr.map((m) => (m.id === materialId ? { ...m, purchased: !m.purchased } : m)),
  );
}

export async function addMaterial(jobId: string, m: Omit<JobMaterial, "id">): Promise<{ ok: boolean; item: JobMaterial | null }> {
  const item: JobMaterial = { ...m, id: randomUUID() };
  const r = await patchJob<JobMaterial>(jobId, "materials", (arr) => [...arr, item]);
  return { ok: r.ok, item: r.ok ? item : null };
}

export async function removeMaterial(jobId: string, materialId: string) {
  return patchJob<JobMaterial>(jobId, "materials", (arr) => arr.filter((m) => m.id !== materialId));
}

export async function addNote(jobId: string, text: string): Promise<{ ok: boolean; note: JobNote | null }> {
  const t = text.trim().slice(0, 1000);
  if (t.length < 1) return { ok: false, note: null };
  const note: JobNote = { at: new Date().toISOString().slice(0, 10), text: t, author: "Cruz" };
  const r = await patchJob<JobNote>(jobId, "notes", (arr) => [note, ...arr]);
  return { ok: r.ok, note: r.ok ? note : null };
}

export async function addPhoto(jobId: string, p: Omit<JobPhoto, "id">): Promise<{ ok: boolean; item: JobPhoto | null }> {
  const item: JobPhoto = { ...p, id: randomUUID() };
  const r = await patchJob<JobPhoto>(jobId, "photos", (arr) => [...arr, item]);
  return { ok: r.ok, item: r.ok ? item : null };
}

export async function removePhoto(jobId: string, photoId: string) {
  return patchJob<JobPhoto>(jobId, "photos", (arr) => arr.filter((p) => p.id !== photoId));
}
