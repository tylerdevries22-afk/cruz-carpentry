"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { listLibraryImages } from "@/app/actions/content";

interface Folder {
  category: string;
  kind: string;
  images: string[];
}

const prettyCategory = (c: string) =>
  c.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
const prettyKind = (k: string) => (k === "ai-generated" ? "Design examples" : "Real photos");

/**
 * Modal that browses the what-we-build Storage bucket and lets the admin pick an
 * existing image (no uploads). Loads the library lazily the first time it opens.
 */
export function ImagePicker({
  open,
  current,
  onSelect,
  onClose,
}: {
  open: boolean;
  current?: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [folders, setFolders] = useState<Folder[] | null>(null);
  const [error, setError] = useState("");
  const requested = useRef(false);
  const loading = folders === null && !error;

  useEffect(() => {
    // Lazy-load the library the first time the picker opens. State is only set
    // from the async callbacks (never synchronously in the effect body).
    if (!open || requested.current) return;
    requested.current = true;
    listLibraryImages()
      .then((r) => {
        if (r.ok && r.folders) setFolders(r.folders);
        else setError(r.error ?? "Could not load images.");
      })
      .catch(() => setError("Could not load images."));
  }, [open]);

  // Esc to close + scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Choose an image">
      <button type="button" aria-label="Close image picker" onClick={onClose} className="absolute inset-0 bg-black/50" />
      <div className="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E7DFD3] px-5 py-4">
          <div>
            <h2 className="font-serif text-xl text-[#1C1917]">Choose a thumbnail</h2>
            <p className="text-xs text-[#8A7F73]">
              From the what-we-build library. Design examples appear on the home-page carousel; real photos work too.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-lg text-[#57534E] hover:bg-[#F0E8DC]">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          {loading && <p className="py-10 text-center text-sm text-[#8A7F73]">Loading the image library…</p>}
          {error && <p className="py-10 text-center text-sm text-[#B91C1C]">{error}</p>}
          {folders?.length === 0 && <p className="py-10 text-center text-sm text-[#8A7F73]">No images found.</p>}
          {folders?.map((f) => (
            <section key={`${f.category}/${f.kind}`} className="mb-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#A8A29E]">
                {prettyCategory(f.category)} · {prettyKind(f.kind)}
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {f.images.map((url) => {
                  const selected = url === current;
                  return (
                    <button
                      key={url}
                      type="button"
                      onClick={() => { onSelect(url); onClose(); }}
                      className={`relative aspect-[16/10] overflow-hidden rounded-lg border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] ${
                        selected ? "border-[#B45309]" : "border-transparent hover:border-[#CA8A04]/50"
                      }`}
                      aria-label={`Use ${url.split("/").pop()}`}
                      aria-pressed={selected}
                    >
                      <Image src={url} alt="" fill sizes="160px" className="object-cover" />
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
