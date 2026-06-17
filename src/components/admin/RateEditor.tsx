"use client";

import { useRef, useState, useTransition } from "react";
import { revertRatesToSeed, saveRateOverrides } from "@/app/actions/admin";
import type { RateSnapshot } from "@/lib/pricing/rates";

type Tier = "essential" | "premium" | "signature";
const TIERS: Tier[] = ["essential", "premium", "signature"];
const TIER_LABEL: Record<Tier, string> = { essential: "Essential", premium: "Premium", signature: "Signature" };

const MAT_ROWS = ["sheet", "solid", "trim"] as const;
const MAT_ROW_LABEL: Record<(typeof MAT_ROWS)[number], string> = {
  sheet: "Sheet good",
  solid: "Solid wood",
  trim: "Trim & moulding",
};
const UNIT_LABEL: Record<string, string> = {
  sheet: "per sheet",
  board_ft: "per board ft",
  linear_ft: "per linear ft",
  each: "each",
  pair: "per pair",
  sf: "per sq ft",
};

const HW_FIELDS = ["hingeEach", "slidePair", "pullEach", "drawerBoxStock", "shelfPinSet"] as const;
const HW_LABEL: Record<(typeof HW_FIELDS)[number], string> = {
  hingeEach: "Hinge (each)",
  slidePair: "Drawer slide (pair)",
  pullEach: "Pull / knob (each)",
  drawerBoxStock: "Drawer box stock",
  shelfPinSet: "Shelf pin set",
};

const LABOR_STAGES = ["shop", "install", "finish", "design"] as const;
const LABOR_LABEL: Record<(typeof LABOR_STAGES)[number], string> = {
  shop: "Shop / build",
  install: "Install",
  finish: "Finishing",
  design: "Design",
};

/* ---------- a single labeled number input ---------- */

function NumField({
  name,
  current,
  seed,
  prefix,
  suffix,
  step = "0.01",
  srLabel,
}: {
  name: string;
  current: number;
  seed: number;
  prefix?: string;
  suffix?: string;
  step?: string;
  srLabel: string;
}) {
  const changed = current !== seed;
  return (
    <label className="block">
      <span className="sr-only">{srLabel}</span>
      <span
        className={`flex items-center rounded-lg border bg-white pl-2.5 pr-2 transition-colors focus-within:ring-2 focus-within:ring-[#B45309] ${
          changed ? "border-[#CA8A04]" : "border-[#D6CCBC]"
        }`}
      >
        {prefix && <span className="text-sm text-[#A8A29E]">{prefix}</span>}
        <input
          name={name}
          type="number"
          inputMode="decimal"
          step={step}
          min="0"
          defaultValue={current}
          aria-label={srLabel}
          className="w-full min-w-0 bg-transparent px-1.5 py-2 text-right text-sm tabular-nums text-[#1C1917] outline-none"
        />
        {suffix && <span className="text-xs text-[#A8A29E]">{suffix}</span>}
      </span>
      <span className="mt-0.5 block text-[10px] text-[#A8A29E]">
        seed {prefix}{seed}{suffix ? ` ${suffix}` : ""}
      </span>
    </label>
  );
}

function SectionCard({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#E7DFD3] bg-white p-5 sm:p-6">
      <h2 className="font-serif text-xl text-[#1C1917]">{title}</h2>
      {hint && <p className="mt-1 text-sm font-light text-[#57534E]">{hint}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/* ---------- the editor ---------- */

export function RateEditor({ snapshot, seed }: { snapshot: RateSnapshot; seed: RateSnapshot }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();

  const save = () => {
    const form = formRef.current;
    if (!form) return;
    const fd = new FormData(form);
    const num = (n: string) => Number(fd.get(n));
    type J = Record<string, unknown>;
    const ov: J = {};
    const set = (path: string[], v: number) => {
      let o: J = ov;
      for (let i = 0; i < path.length - 1; i++) {
        if (!o[path[i]]) o[path[i]] = {};
        o = o[path[i]] as J;
      }
      o[path[path.length - 1]] = v;
    };
    const consider = (name: string, path: string[], seedVal: number) => {
      const v = num(name);
      if (Number.isFinite(v) && v !== seedVal) set(path, v);
    };

    for (const t of TIERS) {
      for (const row of MAT_ROWS) {
        for (const f of ["unitCost", "markupPct", "wasteFactor"] as const) {
          consider(`mat.${t}.${row}.${f}`, ["materials", t, row, f], seed.materials[t][row][f]);
        }
      }
      consider(`fin.${t}`, ["materials", t, "finishPerSf"], seed.materials[t].finishPerSf);
      for (const f of HW_FIELDS) {
        consider(`hw.${t}.${f}`, ["hardware", t, f], seed.hardware[t][f]);
      }
    }
    for (const s of LABOR_STAGES) {
      for (const t of TIERS) {
        consider(`lab.${s}.${t}`, ["labor", s, t], seed.labor[s][t]);
      }
    }

    start(async () => {
      const r = await saveRateOverrides(JSON.stringify(ov));
      setMsg(r.ok ? { kind: "ok", text: "Saved — live within ~10 minutes." } : { kind: "err", text: r.error ?? "Save failed." });
    });
  };

  const revert = () => {
    start(async () => {
      const r = await revertRatesToSeed();
      if (r.ok) {
        setMsg({ kind: "ok", text: "Reverted to seed defaults. Reload to see them." });
      } else setMsg({ kind: "err", text: "Revert failed." });
    });
  };

  return (
    <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="space-y-6">
      {/* Labor */}
      <SectionCard title="Labor rates" hint="What an hour of work costs, by stage and tier. Drives most of the estimate.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="w-32 text-left text-xs font-medium uppercase tracking-wide text-[#A8A29E]"></th>
                {TIERS.map((t) => (
                  <th key={t} className="px-1 text-center text-xs font-semibold uppercase tracking-wide text-[#57534E]">
                    {TIER_LABEL[t]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LABOR_STAGES.map((s) => (
                <tr key={s}>
                  <th scope="row" className="pr-3 text-left text-sm font-medium text-[#1C1917]">{LABOR_LABEL[s]}</th>
                  {TIERS.map((t) => (
                    <td key={t} className="px-1 align-top">
                      <NumField name={`lab.${s}.${t}`} current={snapshot.labor[s][t]} seed={seed.labor[s][t]} prefix="$" suffix="/hr" step="1" srLabel={`${LABOR_LABEL[s]} ${TIER_LABEL[t]} hourly rate`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Materials */}
      <SectionCard title="Material buy-costs" hint="Cruz's purchase price per material, plus the markup and waste allowance applied on top. The live lumber-market factor is applied automatically.">
        <div className="grid gap-5 lg:grid-cols-3">
          {TIERS.map((t) => (
            <div key={t} className="rounded-xl border border-[#EFE7DA] bg-[#FAF7F2] p-4">
              <p className="mb-3 text-sm font-semibold text-[#B45309]">{TIER_LABEL[t]}</p>
              <div className="space-y-4">
                {MAT_ROWS.map((row) => {
                  const r = snapshot.materials[t][row];
                  return (
                    <div key={row}>
                      <p className="text-[0.8125rem] font-medium text-[#1C1917]">{MAT_ROW_LABEL[row]}</p>
                      <p className="mb-1.5 text-xs text-[#8A7F73]">{r.label} · {UNIT_LABEL[r.unit] ?? r.unit}</p>
                      <div className="grid grid-cols-3 gap-2">
                        <NumField name={`mat.${t}.${row}.unitCost`} current={r.unitCost} seed={seed.materials[t][row].unitCost} prefix="$" step="0.1" srLabel={`${TIER_LABEL[t]} ${MAT_ROW_LABEL[row]} buy cost`} />
                        <NumField name={`mat.${t}.${row}.markupPct`} current={r.markupPct} seed={seed.materials[t][row].markupPct} suffix="%" step="1" srLabel={`${TIER_LABEL[t]} ${MAT_ROW_LABEL[row]} markup`} />
                        <NumField name={`mat.${t}.${row}.wasteFactor`} current={r.wasteFactor} seed={seed.materials[t][row].wasteFactor} suffix="×" step="0.01" srLabel={`${TIER_LABEL[t]} ${MAT_ROW_LABEL[row]} waste factor`} />
                      </div>
                      <div className="mt-1 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-wide text-[#A8A29E]">
                        <span>Buy</span><span>Markup</span><span>Waste</span>
                      </div>
                    </div>
                  );
                })}
                <div>
                  <p className="mb-1.5 text-[0.8125rem] font-medium text-[#1C1917]">Finish material <span className="font-normal text-[#8A7F73]">(per sq ft)</span></p>
                  <div className="w-1/2">
                    <NumField name={`fin.${t}`} current={snapshot.materials[t].finishPerSf} seed={seed.materials[t].finishPerSf} prefix="$" step="0.05" srLabel={`${TIER_LABEL[t]} finish material per sq ft`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Hardware */}
      <SectionCard title="Hardware costs" hint="Per-piece hardware prices used in the takeoff.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="w-40 text-left"></th>
                {TIERS.map((t) => (
                  <th key={t} className="px-1 text-center text-xs font-semibold uppercase tracking-wide text-[#57534E]">{TIER_LABEL[t]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HW_FIELDS.map((f) => (
                <tr key={f}>
                  <th scope="row" className="pr-3 text-left text-sm font-medium text-[#1C1917]">{HW_LABEL[f]}</th>
                  {TIERS.map((t) => (
                    <td key={t} className="px-1 align-top">
                      <NumField name={`hw.${t}.${f}`} current={snapshot.hardware[t][f]} seed={seed.hardware[t][f]} prefix="$" step="0.5" srLabel={`${TIER_LABEL[t]} ${HW_LABEL[f]} cost`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Actions */}
      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-[#E7DFD3] bg-[#FAF7F2]/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-6">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="rounded-full bg-[#B45309] px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#92400E] disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save & activate"}
        </button>
        <button
          type="button"
          onClick={revert}
          disabled={pending}
          className="rounded-full border border-[#D6CCBC] px-5 py-2.5 text-sm text-[#57534E] transition-colors hover:bg-white disabled:opacity-60"
        >
          Revert to seed defaults
        </button>
        {msg && (
          <span role="status" className={`text-sm ${msg.kind === "ok" ? "text-[#0F766E]" : "text-[#B91C1C]"}`}>
            {msg.text}
          </span>
        )}
      </div>
    </form>
  );
}
