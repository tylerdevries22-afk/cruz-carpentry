"use client";

import { useActionState } from "react";
import { PROJECT_TYPES } from "@/lib/estimate-schema";
import { STAGES } from "@/lib/jobs";
import type { Job } from "@/lib/jobs";

type Action = (prev: { error?: string }, fd: FormData) => Promise<{ error?: string }>;

const field = "w-full rounded-lg border border-[#D6CCBC] bg-white px-3.5 py-2.5 text-sm text-[#1C1917] outline-none focus:border-[#B45309] focus:ring-2 focus:ring-[#CA8A04]/20";

function Field({ label, name, defaultValue, type = "text", required, placeholder, children }: {
  label: string; name: string; defaultValue?: string | number | null; type?: string; required?: boolean; placeholder?: string; children?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-[#57534E]">{label}{required && <span className="text-[#B45309]"> *</span>}</span>
      {children ?? (
        <input name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue ?? undefined} className={field} />
      )}
    </label>
  );
}

export function JobForm({ action, job, submitLabel }: { action: Action; job?: Job; submitLabel: string }) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p role="alert" className="rounded-lg border border-[#B91C1C]/30 bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">{state.error}</p>
      )}

      <Field label="Job title" name="title" required defaultValue={job?.title} placeholder="e.g. Walnut Kitchen — Smith Residence" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Client name" name="client_name" required defaultValue={job?.client_name} />
        <Field label="Site / address" name="address" defaultValue={job?.address} placeholder="City, CO" />
        <Field label="Client email" name="client_email" type="email" defaultValue={job?.client_email} />
        <Field label="Client phone" name="client_phone" type="tel" defaultValue={job?.client_phone} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Project type" name="project_type">
          <select name="project_type" defaultValue={job?.project_type ?? "Custom Cabinetry"} className={field}>
            {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Current stage" name="stage">
          <select name="stage" defaultValue={job?.stage ?? "consult"} className={field}>
            {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </Field>
        <Field label="Start date" name="start_date" type="date" defaultValue={job?.start_date} />
        <Field label="Target date" name="target_date" type="date" defaultValue={job?.target_date} />
        <Field label="Quoted budget ($)" name="budget_quoted" type="number" defaultValue={job?.budget_quoted} />
        <Field label="Deposit ($)" name="deposit" type="number" defaultValue={job?.deposit} />
      </div>

      <Field label="Cover image URL" name="cover_image" defaultValue={job?.cover_image} placeholder="https://… (optional)" />

      <label className="flex items-center gap-2.5 text-sm text-[#1C1917]">
        <input
          type="checkbox"
          name="on_hold"
          defaultChecked={job?.status === "on_hold"}
          className="h-4 w-4 rounded border-[#C2B6A6] text-[#B45309] focus:ring-[#CA8A04]/30"
        />
        Put this job on hold (pauses it without changing the stage)
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={pending} className="rounded-full bg-[#B45309] px-7 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#92400E] disabled:opacity-60">
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
