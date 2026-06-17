"use client";

import { useState, useTransition } from "react";
import { toggleMaterial } from "@/app/actions/jobs";
import { type JobMaterial, money, materialsTotal, materialsPurchased } from "@/lib/jobs";

/** Interactive materials shopping list: check items off (persists), grouped by
 * category, with line costs and a purchased-vs-total summary. */
export function ShoppingList({ jobId, initial }: { jobId: string; initial: JobMaterial[] }) {
  const [items, setItems] = useState<JobMaterial[]>(initial);
  const [, start] = useTransition();

  const toggle = (id: string) => {
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, purchased: !m.purchased } : m)));
    start(async () => {
      const r = await toggleMaterial(jobId, id);
      if (!r.ok) setItems((prev) => prev.map((m) => (m.id === id ? { ...m, purchased: !m.purchased } : m)));
    });
  };

  const categories = [...new Set(items.map((m) => m.category))];
  const total = materialsTotal(items);
  const got = materialsPurchased(items);
  const doneCount = items.filter((m) => m.purchased).length;

  return (
    <div>
      {/* summary */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#F0E8DC] px-4 py-3">
        <span className="text-sm text-[#57534E]">
          <strong className="text-[#1C1917]">{doneCount}</strong> of {items.length} sourced ·{" "}
          <span className="text-[#0F766E]">{money(got)} in</span> · {money(total - got)} to go
        </span>
        <span className="text-sm font-semibold text-[#1C1917]">{money(total)} total</span>
      </div>
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-[#E2D6C4]">
        <div className="h-full rounded-full bg-[#B45309] transition-[width] duration-300" style={{ width: `${total > 0 ? (got / total) * 100 : 0}%` }} />
      </div>

      <div className="space-y-5">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#A8A29E]">{cat}</p>
            <ul className="divide-y divide-[#F0E8DC] rounded-xl border border-[#E7DFD3] bg-white">
              {items.filter((m) => m.category === cat).map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => toggle(m.id)}
                    aria-pressed={m.purchased}
                    className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-[#FAF7F2] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B45309]"
                  >
                    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${m.purchased ? "border-[#B45309] bg-[#B45309] text-white" : "border-[#C2B6A6] bg-white"}`}>
                      {m.purchased && (
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden="true"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm ${m.purchased ? "text-[#A8A29E] line-through" : "text-[#1C1917]"}`}>{m.name}</span>
                      <span className="text-xs text-[#8A7F73]">{m.qty} {m.unit} · {m.supplier}</span>
                    </span>
                    <span className="shrink-0 text-sm tabular-nums text-[#57534E]">{money(m.qty * m.unitCost)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
