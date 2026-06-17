"use client";

import { useState, useTransition } from "react";
import { saveContentOverrides, revertContentToSeed } from "@/app/actions/content";
import type { CopyTree } from "@/lib/content/copy";
import { NodeFields, SectionCard, SaveBar, diff, setAt, humanize, type Path } from "./fieldTree";

/**
 * Page-copy editor: walks the merged copy tree and renders a field per string
 * (grouped into a card per top-level page), highlighting changes vs the seed and
 * saving only the diff. Adding a key to SEED_COPY makes it editable here with no
 * extra wiring. Owns the `copy` namespace of the override.
 */
export function CopyEditor({
  copy,
  seed,
  source,
}: {
  copy: CopyTree;
  seed: CopyTree;
  source: "db" | "seed";
}) {
  const [state, setState] = useState<CopyTree>(() => structuredClone(copy));
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();

  const onLeafChange = (path: Path, value: string) => {
    setState((prev) => setAt(prev, path, value) as CopyTree);
    setMsg(null);
  };

  const save = () => {
    const override = diff(state, seed) ?? {};
    start(async () => {
      const r = await saveContentOverrides(JSON.stringify({ copy: override })).catch(() => ({ ok: false, error: "Save failed." }));
      setMsg(r.ok ? { kind: "ok", text: "Saved — live in a moment." } : { kind: "err", text: r.error ?? "Save failed." });
    });
  };

  const revert = () => {
    start(async () => {
      const r = await revertContentToSeed().catch(() => ({ ok: false }));
      setMsg(r.ok ? { kind: "ok", text: "Reverted to defaults. Reload to see them." } : { kind: "err", text: "Revert failed." });
    });
  };

  const pages = Object.keys(state) as (keyof CopyTree)[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-serif text-2xl text-[#1C1917]">Page copy</h2>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${source === "db" ? "bg-[#0F766E]/10 text-[#0F766E]" : "bg-[#78716C]/10 text-[#78716C]"}`}>
          {source === "db" ? "Custom content active" : "Using defaults"}
        </span>
      </div>
      <p className="max-w-2xl text-sm font-light leading-relaxed text-[#57534E]">
        Edit the headlines, descriptions, and FAQs across the site. Changed fields are outlined in gold and
        show the original underneath. Hit <strong>Save</strong> — no deploy needed.
      </p>

      {pages.map((page) => (
        <SectionCard key={String(page)} title={humanize(String(page))}>
          <NodeFields node={state[page]} seed={seed[page]} path={[page as string]} onLeafChange={onLeafChange} />
        </SectionCard>
      ))}

      <SaveBar pending={pending} msg={msg} onSave={save} onRevert={revert} />
    </div>
  );
}
