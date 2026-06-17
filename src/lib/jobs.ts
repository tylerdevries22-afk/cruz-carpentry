/**
 * Shared types + pipeline for the admin Jobs (project-management) feature.
 * Pure — no I/O — so the list page, detail page, client widgets, and the seed
 * all agree on one shape.
 */

export const STAGES = [
  { key: "consult", label: "Consult", blurb: "On-site visit & measurements" },
  { key: "design", label: "Design", blurb: "Drawings & material selections" },
  { key: "materials", label: "Materials", blurb: "Sourcing & ordering" },
  { key: "build", label: "Build", blurb: "In the shop" },
  { key: "install", label: "Install", blurb: "On-site fit & finish" },
  { key: "done", label: "Done", blurb: "Walkthrough & handover" },
] as const;

export type StageKey = (typeof STAGES)[number]["key"];
export const STAGE_KEYS = STAGES.map((s) => s.key) as StageKey[];

export interface JobMaterial {
  id: string;
  name: string;
  category: string; // "Lumber" | "Sheet goods" | "Hardware" | "Finish" | ...
  qty: number;
  unit: string;
  unitCost: number;
  supplier: string;
  purchased: boolean;
}
export interface JobPhoto {
  id: string;
  url: string;
  kind: "before" | "progress" | "after";
  caption: string;
}
export interface JobPayment {
  label: string;
  amount: number;
  dueDate: string | null;
  paid: boolean;
}
export interface JobDocument {
  label: string;
  kind: "estimate" | "contract" | "invoice" | "drawing" | "other";
}
export interface JobNote {
  at: string; // ISO
  text: string;
  author: string;
}

export interface Job {
  id: string;
  created_at: string;
  title: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  address: string | null;
  project_type: string;
  stage: StageKey;
  status: "active" | "complete" | "on_hold";
  start_date: string | null;
  target_date: string | null;
  budget_quoted: number | null;
  budget_actual: number | null;
  deposit: number | null;
  cover_image: string | null;
  inquiry_id: string | null;
  materials: JobMaterial[];
  photos: JobPhoto[];
  payments: JobPayment[];
  documents: JobDocument[];
  notes: JobNote[];
}

export function stageIndex(stage: StageKey): number {
  return Math.max(0, STAGE_KEYS.indexOf(stage));
}

/** 0–100 progress: a completed job is 100%, otherwise position along the pipeline. */
export function jobProgress(job: Pick<Job, "stage" | "status">): number {
  if (job.status === "complete" || job.stage === "done") return 100;
  return Math.round((stageIndex(job.stage) / (STAGE_KEYS.length - 1)) * 100);
}

export function money(n: number | null | undefined): string {
  if (n == null) return "—";
  return `$${Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function materialsTotal(materials: JobMaterial[]): number {
  return materials.reduce((s, m) => s + m.qty * m.unitCost, 0);
}
export function materialsPurchased(materials: JobMaterial[]): number {
  return materials.filter((m) => m.purchased).reduce((s, m) => s + m.qty * m.unitCost, 0);
}
