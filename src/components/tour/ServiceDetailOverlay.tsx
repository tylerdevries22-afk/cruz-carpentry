"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Full-screen overlay that shows a service's detail page (the chrome-less
 * `/services/[slug]/embed` route) in an iframe, slid up over the /tour film.
 * The visitor stays on /tour; closing returns them to the exact same frame.
 */
export function ServiceDetailOverlay({
  slug,
  label,
  onClose,
}: {
  slug: string | null;
  label?: string;
  onClose: () => void;
}) {
  const open = slug !== null;
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  // Track which slug's iframe has finished loading, so `loaded` resets for free
  // whenever a different build is opened — no setState-in-effect needed.
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);
  const loaded = slug !== null && loadedSlug === slug;

  // Esc to close, lock the page behind, move focus into the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // preventScroll: the panel is still sliding up from off-screen when this
    // fires; focusing without preventScroll makes mobile browsers (esp. iOS)
    // scroll the page down to chase the button — the "auto-scroll to the bottom".
    const focusTimer = window.setTimeout(
      () => closeBtnRef.current?.focus({ preventScroll: true }),
      60,
    );
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={label ? `${label} — details` : "Build details"}
        >
          <button
            type="button"
            aria-label="Close details"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            className="relative z-10 flex h-[94svh] w-full max-w-6xl flex-col overflow-hidden rounded-t-2xl bg-[#FAF7F2] shadow-[0_-20px_60px_rgba(0,0,0,0.5)] sm:my-[4svh] sm:h-[92svh] sm:rounded-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 280 }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#e7ddcb] bg-[#FAF7F2]/95 px-4 py-3 backdrop-blur sm:px-6">
              <p className="truncate text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#8a7c63] sm:text-xs">
                {label ?? "Cruz Carpentry"}
              </p>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#5b513f] transition-colors hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div className="relative flex-1 overflow-hidden bg-[#FAF7F2]">
              {!loaded && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#d8cdb6] border-t-[#B45309]" />
                </div>
              )}
              {slug && (
                <iframe
                  key={slug}
                  src={`/services/${slug}/embed`}
                  title={label ? `${label} — details` : "Service details"}
                  onLoad={(e) => {
                    setLoadedSlug(slug);
                    // Always reveal the detail page from its top (the hero), never
                    // mid-page, regardless of any in-page focus/anchor behaviour.
                    try {
                      e.currentTarget.contentWindow?.scrollTo(0, 0);
                    } catch {
                      /* cross-origin guard — same-origin in practice */
                    }
                  }}
                  className="h-full w-full border-0"
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
