"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { ServiceRow } from "@/lib/content/service-edit";
import { SaveBar } from "./fieldTree";
import { ImagePicker } from "./ImagePicker";

/**
 * Reorder the home-page "What We Build" cards (drag-and-drop or move buttons) and
 * swap each card's thumbnail from the image library. Controlled by the workspace,
 * which owns the shared services state and the save (the card position drives the
 * `num`; the thumbnail sets `cardImage`).
 */
export function CardsEditor({
  rows,
  onMove,
  onSetImage,
  pending,
  msg,
  onSave,
  onRevert,
}: {
  rows: ServiceRow[];
  onMove: (from: number, to: number) => void;
  onSetImage: (slug: string, url: string) => void;
  pending: boolean;
  msg: { kind: "ok" | "err"; text: string } | null;
  onSave: () => void;
  onRevert: () => void;
}) {
  const [picker, setPicker] = useState<string | null>(null);
  const dragIndex = useRef<number | null>(null);
  const activeCard = rows.find((r) => r.slug === picker);

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm font-light leading-relaxed text-[#57534E]">
        Drag a card (or use the arrows) to reorder how the &ldquo;What We Build&rdquo; cards appear on the
        home page, footer, and sitemap. Click a thumbnail to swap its image. Hit <strong>Save</strong> —
        no deploy needed.
      </p>

      <ol className="space-y-2.5">
        {rows.map((row, i) => (
          <li
            key={row.slug}
            draggable
            onDragStart={() => (dragIndex.current = i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex.current !== null) onMove(dragIndex.current, i);
              dragIndex.current = null;
            }}
            className="flex items-center gap-3 rounded-xl border border-[#E7DFD3] bg-white p-2.5"
          >
            <span className="grid h-8 w-8 shrink-0 cursor-grab place-items-center text-[#A8A29E]" aria-hidden="true">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" strokeLinecap="round" /></svg>
            </span>
            <span className="w-7 shrink-0 text-center text-sm font-semibold tabular-nums text-[#B45309]">{String(i + 1).padStart(2, "0")}</span>
            <button
              type="button"
              onClick={() => setPicker(row.slug)}
              className="relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-lg border border-[#E7DFD3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]"
              aria-label={`Change ${row.title} thumbnail`}
            >
              <Image src={row.cardImage} alt="" fill sizes="96px" className="object-cover" />
              <span className="absolute inset-x-0 bottom-0 bg-black/55 py-0.5 text-center text-[10px] font-medium text-white">Change</span>
            </button>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#1C1917]">{row.title}</span>
            <div className="flex shrink-0 flex-col">
              <button type="button" onClick={() => onMove(i, i - 1)} disabled={i === 0} aria-label={`Move ${row.title} up`} className="grid h-6 w-7 place-items-center rounded text-[#57534E] hover:bg-[#F0E8DC] disabled:opacity-30">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button type="button" onClick={() => onMove(i, i + 1)} disabled={i === rows.length - 1} aria-label={`Move ${row.title} down`} className="grid h-6 w-7 place-items-center rounded text-[#57534E] hover:bg-[#F0E8DC] disabled:opacity-30">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </li>
        ))}
      </ol>

      <SaveBar pending={pending} msg={msg} onSave={onSave} onRevert={onRevert} />

      <ImagePicker
        open={picker !== null}
        current={activeCard?.cardImage}
        onSelect={(url) => activeCard && onSetImage(activeCard.slug, url)}
        onClose={() => setPicker(null)}
      />
    </div>
  );
}
