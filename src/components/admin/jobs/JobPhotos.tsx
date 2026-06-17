"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { JobPhoto } from "@/lib/jobs";

const KIND_LABEL: Record<JobPhoto["kind"], string> = { before: "Before", progress: "In progress", after: "After" };
const KIND_COLOR: Record<JobPhoto["kind"], string> = {
  before: "bg-[#78716C]",
  progress: "bg-[#CA8A04]",
  after: "bg-[#0F766E]",
};

export function JobPhotos({ photos, title }: { photos: JobPhoto[]; title: string }) {
  const before = photos.find((p) => p.kind === "before");
  const after = photos.find((p) => p.kind === "after");
  const [pos, setPos] = useState(50);
  const [lb, setLb] = useState<number | null>(null);

  if (photos.length === 0) {
    return <p className="text-sm text-[#A8A29E]">No photos yet.</p>;
  }

  return (
    <div>
      {/* Before / after comparison slider */}
      {before && after && (
        <figure className="mb-6">
          <div className="relative aspect-[16/10] select-none overflow-hidden rounded-2xl">
            {/* after (base) */}
            <Image src={after.url} alt={`${title} — after`} fill sizes="(max-width:1024px) 100vw, 720px" className="object-cover" priority />
            {/* before (clipped from the left) */}
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <Image src={before.url} alt={`${title} — before`} fill sizes="(max-width:1024px) 100vw, 720px" className="object-cover" />
            </div>
            {/* labels */}
            <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">Before</span>
            <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">After</span>
            {/* divider */}
            <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90 shadow" style={{ left: `${pos}%` }}>
              <span className="absolute top-1/2 left-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#1C1917] shadow-lg">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M8 7l-4 5 4 5M16 7l4 5-4 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </div>
            {/* accessible range control over the whole image */}
            <input
              type="range"
              min={0}
              max={100}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="Reveal before / after"
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            />
          </div>
          <figcaption className="mt-2 text-xs text-[#A8A29E]">Drag the slider to compare before and after.</figcaption>
        </figure>
      )}

      {/* All photos */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setLb(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#E5D9C9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2"
          >
            <Image src={p.url} alt={p.caption} fill sizes="(max-width:640px) 50vw, 240px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${KIND_COLOR[p.kind]}`}>
              {KIND_LABEL[p.kind]}
            </span>
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-left text-[11px] text-white">{p.caption}</span>
          </button>
        ))}
      </div>

      {lb !== null && <Lightbox photos={photos} index={lb} onClose={() => setLb(null)} onIndex={setLb} />}
    </div>
  );
}

function Lightbox({ photos, index, onClose, onIndex }: { photos: JobPhoto[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const total = photos.length;
  const prev = useCallback(() => onIndex((index - 1 + total) % total), [index, total, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % total), [index, total, onIndex]);
  useEffect(() => {
    const o = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = o; };
  }, [onClose, prev, next]);
  const p = photos[index];
  return (
    <div role="dialog" aria-modal="true" aria-label="Project photos" className="fixed inset-0 z-[100] flex flex-col bg-black/95" onClick={onClose}>
      <div className="flex items-center justify-between px-5 py-4 text-white">
        <span className="text-sm text-white/80">{KIND_LABEL[p.kind]} · {index + 1}/{total}</span>
        <button type="button" onClick={onClose} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-4 pb-8" onClick={(e) => e.stopPropagation()}>
        {total > 1 && (
          <button type="button" onClick={prev} aria-label="Previous" className="absolute left-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-5">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
        <div className="relative h-full w-full max-w-5xl">
          <Image key={p.url} src={p.url} alt={p.caption} fill sizes="100vw" className="object-contain" priority />
        </div>
        {total > 1 && (
          <button type="button" onClick={next} aria-label="Next" className="absolute right-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-5">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
      </div>
      <p className="px-5 pb-5 text-center text-sm text-white/70">{p.caption}</p>
    </div>
  );
}
