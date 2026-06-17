"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { addPhoto, removePhoto } from "@/app/actions/jobs";
import type { JobPhoto } from "@/lib/jobs";

const KIND_LABEL: Record<JobPhoto["kind"], string> = { before: "Before", progress: "In progress", after: "After" };
const KIND_COLOR: Record<JobPhoto["kind"], string> = { before: "bg-[#78716C]", progress: "bg-[#CA8A04]", after: "bg-[#0F766E]" };

export function JobPhotos({ jobId, photos: initial, title }: { jobId: string; photos: JobPhoto[]; title: string }) {
  const [photos, setPhotos] = useState<JobPhoto[]>(initial);
  const [pos, setPos] = useState(50);
  const [lb, setLb] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<JobPhoto["kind"]>("progress");

  const before = photos.find((p) => p.kind === "before");
  const after = photos.find((p) => p.kind === "after");

  const upload = async (file: File) => {
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("jobId", jobId);
      const res = await fetch("/api/jobs/photos", { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || "upload_failed");
      const r = await addPhoto(jobId, { url: j.url, kind, caption: file.name.replace(/\.[^.]+$/, "").slice(0, 80) });
      if (r.ok && r.item) setPhotos((p) => [...p, r.item!]);
    } catch {
      setErr("Upload failed — use a JPG/PNG/WEBP under 10 MB.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };
  const remove = (id: string) => {
    const prev = photos;
    setPhotos((p) => p.filter((x) => x.id !== id));
    void removePhoto(jobId, id).then((r) => { if (!r.ok) setPhotos(prev); });
  };

  return (
    <div>
      {before && after && (
        <figure className="mb-6">
          <div className="relative aspect-[16/10] select-none overflow-hidden rounded-2xl">
            <Image src={after.url} alt={`${title} — after`} fill sizes="(max-width:1024px) 100vw, 720px" className="object-cover" priority />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <Image src={before.url} alt={`${title} — before`} fill sizes="(max-width:1024px) 100vw, 720px" className="object-cover" />
            </div>
            <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">Before</span>
            <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">After</span>
            <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90 shadow" style={{ left: `${pos}%` }}>
              <span className="absolute top-1/2 left-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#1C1917] shadow-lg">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M8 7l-4 5 4 5M16 7l4 5-4 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </div>
            <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Reveal before / after" className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
          </div>
          <figcaption className="mt-2 text-xs text-[#A8A29E]">Drag the slider to compare before and after.</figcaption>
        </figure>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((p, i) => (
            <div key={p.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#E5D9C9]">
              <button type="button" onClick={() => setLb(i)} className="absolute inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]">
                <Image src={p.url} alt={p.caption} fill sizes="(max-width:640px) 50vw, 240px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${KIND_COLOR[p.kind]}`}>{KIND_LABEL[p.kind]}</span>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-left text-[11px] text-white">{p.caption}</span>
              </button>
              <button type="button" onClick={() => remove(p.id)} aria-label={`Remove ${p.caption}`} className="absolute right-1.5 top-1.5 z-10 grid h-6 w-6 place-items-center rounded-full bg-black/55 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100 focus:opacity-100">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <select value={kind} onChange={(e) => setKind(e.target.value as JobPhoto["kind"])} className="rounded-lg border border-[#D6CCBC] bg-white px-2.5 py-2 text-sm">
          <option value="before">Before</option>
          <option value="progress">In progress</option>
          <option value="after">After</option>
        </select>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
        <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#C2B6A6] px-4 py-2 text-sm font-medium text-[#57534E] transition-colors hover:border-[#B45309] hover:text-[#B45309] disabled:opacity-60">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M12 16V4m0 0L7 9m5-5l5 5" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 17v1a3 3 0 003 3h10a3 3 0 003-3v-1" strokeLinecap="round" /></svg>
          {busy ? "Uploading…" : "Add photo"}
        </button>
        {err && <span className="text-xs text-[#B91C1C]">{err}</span>}
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
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); else if (e.key === "ArrowLeft") prev(); else if (e.key === "ArrowRight") next(); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = o; };
  }, [onClose, prev, next]);
  const p = photos[index];
  if (!p) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Project photos" className="fixed inset-0 z-[100] flex flex-col bg-black/95" onClick={onClose}>
      <div className="flex items-center justify-between px-5 py-4 text-white">
        <span className="text-sm text-white/80">{KIND_LABEL[p.kind]} · {index + 1}/{total}</span>
        <button type="button" onClick={onClose} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg></button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-4 pb-8" onClick={(e) => e.stopPropagation()}>
        {total > 1 && <button type="button" onClick={prev} aria-label="Previous" className="absolute left-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-5"><svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>}
        <div className="relative h-full w-full max-w-5xl"><Image key={p.url} src={p.url} alt={p.caption} fill sizes="100vw" className="object-contain" priority /></div>
        {total > 1 && <button type="button" onClick={next} aria-label="Next" className="absolute right-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-5"><svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>}
      </div>
      <p className="px-5 pb-5 text-center text-sm text-white/70">{p.caption}</p>
    </div>
  );
}
