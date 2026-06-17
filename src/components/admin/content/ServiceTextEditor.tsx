"use client";

import { useState } from "react";
import type { ServiceRow, ServiceSeed } from "@/lib/content/service-edit";
import { NodeFields, SaveBar, type Path } from "./fieldTree";

// The text fields editable here (order + thumbnail live on the Cards tab).
const TEXT_FIELDS = ["title", "shortTitle", "cardDescription", "tagline", "intro", "materials", "details", "faq", "seo"] as const;

function pickText(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of TEXT_FIELDS) if (obj[k] !== undefined) out[k] = obj[k];
  return out;
}

/**
 * Edit the page text for each service (the /services/[slug] detail pages and
 * home-card descriptions). Controlled by the workspace, which owns the shared
 * services state and the save.
 */
export function ServiceTextEditor({
  rows,
  seed,
  onLeafChange,
  pending,
  msg,
  onSave,
  onRevert,
}: {
  rows: ServiceRow[];
  seed: ServiceSeed;
  onLeafChange: (slug: string, path: Path, value: string) => void;
  pending: boolean;
  msg: { kind: "ok" | "err"; text: string } | null;
  onSave: () => void;
  onRevert: () => void;
}) {
  const [sel, setSel] = useState(rows[0]?.slug ?? "");
  const row = rows.find((r) => r.slug === sel);
  const seedRow = seed[sel];

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm font-light leading-relaxed text-[#57534E]">
        Edit the copy on each service&rsquo;s detail page — its title, tagline, intro, materials, talking
        points, FAQs, and SEO. Changed fields are outlined in gold. Hit <strong>Save</strong> — no deploy needed.
      </p>

      <label className="block max-w-sm">
        <span className="mb-1 block text-xs font-medium text-[#57534E]">Service</span>
        <select
          value={sel}
          onChange={(e) => setSel(e.target.value)}
          className="w-full rounded-lg border border-[#D6CCBC] bg-white px-3 py-2.5 text-sm text-[#1C1917] outline-none focus:ring-2 focus:ring-[#CA8A04]/20"
        >
          {rows.map((r) => (
            <option key={r.slug} value={r.slug}>{r.title}</option>
          ))}
        </select>
      </label>

      {row && seedRow && (
        <section className="rounded-2xl border border-[#E7DFD3] bg-white p-5 sm:p-6">
          <NodeFields
            node={pickText(row as unknown as Record<string, unknown>)}
            seed={pickText(seedRow as unknown as Record<string, unknown>)}
            path={[]}
            onLeafChange={(path, value) => onLeafChange(sel, path, value)}
          />
        </section>
      )}

      <SaveBar pending={pending} msg={msg} onSave={onSave} onRevert={onRevert} />
    </div>
  );
}
