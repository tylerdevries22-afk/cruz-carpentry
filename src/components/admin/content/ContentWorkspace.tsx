"use client";

import { useState, useTransition } from "react";
import { saveContentOverrides, revertContentToSeed } from "@/app/actions/content";
import { buildServicesOverride, type ServiceRow, type ServiceSeed } from "@/lib/content/service-edit";
import { setAt, type Path } from "./fieldTree";
import { CardsEditor } from "./CardsEditor";
import { ServiceTextEditor } from "./ServiceTextEditor";
import { CopyEditor } from "./CopyEditor";
import type { CopyTree } from "@/lib/content/copy";

type Tab = "cards" | "text" | "copy";
type Msg = { kind: "ok" | "err"; text: string } | null;

/**
 * Tabbed content workspace. The Cards and Service-text tabs share ONE services
 * state (and one save) so they can't clobber each other's slice of the services
 * namespace. The Page-copy tab owns the separate `copy` namespace.
 */
export function ContentWorkspace({
  services,
  seedServices,
  copy,
  seedCopy,
  source,
}: {
  services: ServiceRow[];
  seedServices: ServiceSeed;
  copy: CopyTree;
  seedCopy: CopyTree;
  source: "db" | "seed";
}) {
  const [tab, setTab] = useState<Tab>("cards");
  const [rows, setRows] = useState<ServiceRow[]>(() => structuredClone(services));
  const [msg, setMsg] = useState<Msg>(null);
  const [pending, start] = useTransition();

  const move = (from: number, to: number) => {
    if (to < 0 || to >= rows.length || from === to) return;
    setRows((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setMsg(null);
  };
  const setImage = (slug: string, url: string) => {
    setRows((prev) => prev.map((r) => (r.slug === slug ? { ...r, cardImage: url } : r)));
    setMsg(null);
  };
  const editField = (slug: string, path: Path, value: string) => {
    setRows((prev) => prev.map((r) => (r.slug === slug ? (setAt(r, path, value) as ServiceRow) : r)));
    setMsg(null);
  };

  const saveServices = () => {
    const override = buildServicesOverride(rows, seedServices);
    start(async () => {
      const r = await saveContentOverrides(JSON.stringify({ services: override })).catch(() => ({ ok: false, error: "Save failed." }));
      setMsg(r.ok ? { kind: "ok", text: "Saved — live in a moment." } : { kind: "err", text: r.error ?? "Save failed." });
    });
  };
  const revert = () => {
    start(async () => {
      const r = await revertContentToSeed().catch(() => ({ ok: false }));
      setMsg(r.ok ? { kind: "ok", text: "Reverted to defaults. Reload to see them." } : { kind: "err", text: "Revert failed." });
    });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "cards", label: "Home-page cards" },
    { id: "text", label: "Service pages" },
    { id: "copy", label: "Page copy" },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-3xl text-[#1C1917]">Site content</h1>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${source === "db" ? "bg-[#0F766E]/10 text-[#0F766E]" : "bg-[#78716C]/10 text-[#78716C]"}`}>
          {source === "db" ? "Custom content active" : "Using defaults"}
        </span>
      </div>

      <div role="tablist" aria-label="Content sections" className="mb-6 inline-flex flex-wrap gap-1 rounded-xl border border-[#E2D7C6] bg-[#EDE3D3] p-1">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] ${
                active ? "bg-white text-[#B45309] shadow-sm" : "text-[#6B6056] hover:bg-white/50"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "cards" && (
        <CardsEditor rows={rows} onMove={move} onSetImage={setImage} pending={pending} msg={msg} onSave={saveServices} onRevert={revert} />
      )}
      {tab === "text" && (
        <ServiceTextEditor rows={rows} seed={seedServices} onLeafChange={editField} pending={pending} msg={msg} onSave={saveServices} onRevert={revert} />
      )}
      {tab === "copy" && <CopyEditor copy={copy} seed={seedCopy} source={source} />}
    </div>
  );
}
