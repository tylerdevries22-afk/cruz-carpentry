"use client";

import { useState, useTransition } from "react";
import { addMaterial, removeMaterial, toggleMaterial } from "@/app/actions/jobs";
import { type JobMaterial, money, materialsTotal, materialsPurchased } from "@/lib/jobs";

const CATEGORIES = ["Lumber", "Sheet goods", "Hardware", "Finish", "Glass / stone", "Other"];
const input = "w-full rounded-lg border border-[#D6CCBC] bg-white px-2.5 py-2 text-sm outline-none focus:border-[#B45309] focus:ring-2 focus:ring-[#CA8A04]/20";

/** Interactive materials shopping list: add items, check them off (persists),
 * remove them. Grouped by category, with line costs and a sourced summary. */
export function ShoppingList({ jobId, initial }: { jobId: string; initial: JobMaterial[] }) {
  const [items, setItems] = useState<JobMaterial[]>(initial);
  const [adding, setAdding] = useState(false);
  const [err, setErr] = useState("");
  const [, start] = useTransition();
  const SAVE_FAILED = "Couldn't save — please try again.";

  const toggle = (id: string) => {
    setErr("");
    setItems((p) => p.map((m) => (m.id === id ? { ...m, purchased: !m.purchased } : m)));
    start(async () => {
      const r = await toggleMaterial(jobId, id).catch(() => ({ ok: false }));
      if (!r.ok) {
        setItems((p) => p.map((m) => (m.id === id ? { ...m, purchased: !m.purchased } : m)));
        setErr(SAVE_FAILED);
      }
    });
  };
  const remove = (id: string) => {
    setErr("");
    const prev = items;
    setItems((p) => p.filter((m) => m.id !== id));
    start(async () => {
      const r = await removeMaterial(jobId, id).catch(() => ({ ok: false }));
      if (!r.ok) {
        setItems(prev);
        setErr(SAVE_FAILED);
      }
    });
  };
  const add = (fd: FormData) => {
    setErr("");
    const m = {
      name: String(fd.get("name") ?? "").trim(),
      category: String(fd.get("category") ?? "Other"),
      qty: Number(fd.get("qty")) || 1,
      unit: String(fd.get("unit") ?? "each").trim() || "each",
      unitCost: Number(fd.get("unitCost")) || 0,
      supplier: String(fd.get("supplier") ?? "").trim(),
      purchased: false,
    };
    if (m.name.length < 1) return;
    start(async () => {
      const r = await addMaterial(jobId, m).catch(() => ({ ok: false, item: undefined }));
      if (r.ok && r.item) {
        setItems((p) => [...p, r.item!]);
        setAdding(false);
      } else {
        setErr(SAVE_FAILED);
      }
    });
  };

  const categories = [...new Set(items.map((m) => m.category))];
  const total = materialsTotal(items);
  const got = materialsPurchased(items);
  const doneCount = items.filter((m) => m.purchased).length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#F0E8DC] px-4 py-3">
        <span className="text-sm text-[#57534E]">
          <strong className="text-[#1C1917]">{doneCount}</strong> of {items.length} sourced ·{" "}
          <span className="text-[#0F766E]">{money(got)} in</span> · {money(total - got)} to go
        </span>
        <span className="text-sm font-semibold text-[#1C1917]">{money(total)} total</span>
      </div>
      {err && <p role="alert" className="mb-3 text-sm text-[#B91C1C]">{err}</p>}
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-[#E2D6C4]">
        <div className="h-full rounded-full bg-[#B45309] transition-[width] duration-300" style={{ width: `${total > 0 ? (got / total) * 100 : 0}%` }} />
      </div>

      <div className="space-y-5">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#A8A29E]">{cat}</p>
            <ul className="divide-y divide-[#F0E8DC] rounded-xl border border-[#E7DFD3] bg-white">
              {items.filter((m) => m.category === cat).map((m) => (
                <li key={m.id} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => toggle(m.id)}
                    aria-pressed={m.purchased}
                    className="flex flex-1 items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-[#FAF7F2] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B45309]"
                  >
                    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${m.purchased ? "border-[#B45309] bg-[#B45309] text-white" : "border-[#C2B6A6] bg-white"}`}>
                      {m.purchased && <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden="true"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm ${m.purchased ? "text-[#A8A29E] line-through" : "text-[#1C1917]"}`}>{m.name}</span>
                      <span className="text-xs text-[#8A7F73]">{m.qty} {m.unit}{m.supplier ? ` · ${m.supplier}` : ""}</span>
                    </span>
                    <span className="shrink-0 text-sm tabular-nums text-[#57534E]">{money(m.qty * m.unitCost)}</span>
                  </button>
                  <button type="button" onClick={() => remove(m.id)} aria-label={`Remove ${m.name}`} className="px-3 text-[#C2B6A6] transition-colors hover:text-[#B91C1C]">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Add material */}
      {adding ? (
        <form action={add} className="mt-4 rounded-xl border border-[#E2D6C4] bg-[#FAF7F2] p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <input name="name" placeholder="Material" required className={`${input} col-span-2 sm:col-span-3`} />
            <select name="category" className={input} defaultValue="Lumber">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input name="qty" type="number" step="0.1" placeholder="Qty" className={input} />
            <input name="unit" placeholder="unit (e.g. board ft)" className={input} />
            <input name="unitCost" type="number" step="0.01" placeholder="$ / unit" className={input} />
            <input name="supplier" placeholder="Supplier" className={`${input} col-span-2`} />
          </div>
          <div className="mt-3 flex gap-2">
            <button type="submit" className="rounded-full bg-[#B45309] px-5 py-2 text-sm font-semibold text-white hover:bg-[#92400E]">Add</button>
            <button type="button" onClick={() => setAdding(false)} className="rounded-full px-4 py-2 text-sm text-[#57534E] hover:bg-white">Cancel</button>
          </div>
        </form>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#C2B6A6] px-4 py-2 text-sm font-medium text-[#57534E] transition-colors hover:border-[#B45309] hover:text-[#B45309]">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
          Add material
        </button>
      )}
    </div>
  );
}
