"use client";

import { useEffect, useRef, type RefObject } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { PHONE, PHONE_HREF, EASE } from "@/lib/constants";
import { PhoneIcon } from "@/components/ui/PhoneIcon";

export interface NavLinkItem {
  label: string;
  href: string;
}

/**
 * Slide-in mobile navigation drawer. Accessible modal dialog: focus is trapped
 * while open, Escape closes, the backdrop closes, background scroll is locked,
 * and focus returns to the trigger on close. Motion is disabled for users who
 * prefer reduced motion.
 */
export function MobileMenu({
  open,
  onClose,
  links,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  links: NavLinkItem[];
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const reduced = useReducedMotion() ?? false;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    // Capture the trigger now so cleanup restores focus to the same node.
    const trigger = triggerRef.current;

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      );

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const list = focusables();
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      trigger?.focus();
    };
  }, [open, onClose, triggerRef]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] md:hidden"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-black/55 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute right-0 top-0 flex h-[100dvh] w-[82%] max-w-sm flex-col bg-[#1C1917] shadow-2xl"
            initial={reduced ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduced ? undefined : { x: "100%" }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <span className="font-serif text-lg text-white">
                <em className="italic">Cruz</em> Carpentry
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-6 w-6">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-2">
              <ul className="flex flex-col">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="flex min-h-[44px] items-center border-b border-white/5 py-4 font-serif text-xl text-white/90 transition-colors hover:text-[#CA8A04] active:text-[#CA8A04] focus:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[#CA8A04]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-white/10 px-6 py-6">
              <a
                href={PHONE_HREF}
                className="flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-[#B45309] px-6 text-base font-medium text-white shadow-lg transition-colors hover:bg-[#92400E] active:bg-[#92400E] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]"
              >
                <PhoneIcon className="h-4 w-4" />
                Call · {PHONE}
              </a>
              <p className="mt-4 text-center text-xs font-light text-white/50">
                Serving the Colorado Front Range
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
