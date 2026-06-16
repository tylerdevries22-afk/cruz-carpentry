"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { EASE } from "@/lib/constants";
import { GALLERY_PHOTOS, type GalleryPhoto } from "./photos";

// Section header — scroll-driven, with a static fallback for reduced motion.
function GalleryHeader({
  sectionSmooth,
  reduced,
  eyebrow,
  heading,
  subheading,
}: {
  sectionSmooth: ReturnType<typeof useSpring>;
  reduced: boolean;
  eyebrow: string;
  heading: ReactNode;
  subheading: string;
}) {
  const y = useTransform(sectionSmooth, [0, 0.25], [50, 0]);
  const opacity = useTransform(sectionSmooth, [0, 0.2], [0, 1]);
  const labelClip = useTransform(
    sectionSmooth,
    [0, 0.18],
    [
      "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
      "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    ],
  );
  const lineScaleX = useTransform(sectionSmooth, [0.05, 0.25], [0, 1]);

  return (
    <motion.div className="mb-14 sm:mb-16" style={reduced ? undefined : { y, opacity }}>
      <motion.p
        className="text-[#B45309] text-xs font-semibold tracking-[0.25em] uppercase mb-5"
        style={reduced ? undefined : { clipPath: labelClip }}
      >
        {eyebrow}
      </motion.p>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <h2 className="font-serif text-5xl sm:text-6xl text-[#1C1917] leading-tight">
          {heading}
        </h2>
        <div className="sm:text-right shrink-0">
          <motion.div
            className="h-px w-24 bg-[#CA8A04] mb-3 origin-left sm:origin-right sm:ml-auto"
            style={reduced ? undefined : { scaleX: lineScaleX }}
          />
          <p className="text-[#57534E] text-sm font-light">
            {subheading}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
  reduced,
}: {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  reduced: boolean;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const photo = photos[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
      else if (e.key === "Tab") {
        // Trap focus within the dialog's controls (WCAG 2.4.3 / modal pattern).
        const focusables = dialogRef.current?.querySelectorAll("button");
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
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
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      tabIndex={-1}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-10 outline-none"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduced ? undefined : { opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center rounded-full
                   bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Prev */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous photo"
        className="absolute left-2 sm:left-5 z-10 w-11 h-11 flex items-center justify-center rounded-full
                   bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Image + caption */}
      <motion.figure
        key={photo.full}
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col items-center max-w-[92vw]"
        initial={reduced ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        <Image
          src={photo.full}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
          sizes="92vw"
          priority
        />
        <figcaption className="mt-4 text-center">
          <p className="text-white/85 text-sm font-light">{photo.alt}</p>
          <p className="text-white/60 text-xs mt-1 tracking-wider">
            {index + 1} / {photos.length}
          </p>
        </figcaption>
      </motion.figure>

      {/* Next */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next photo"
        className="absolute right-2 sm:right-5 z-10 w-11 h-11 flex items-center justify-center rounded-full
                   bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </motion.div>
  );
}

const defaultHeading = (
  <>
    Built with purpose,
    <br />
    <em className="italic">finished with care</em>
  </>
);

export function Gallery({
  photos = GALLERY_PHOTOS,
  eyebrow = "Our Work",
  heading = defaultHeading,
  subheading = "Tap any photo to view it full size",
  id = "gallery",
}: {
  /** Defaults to the full gallery; pass a subset for a filtered grid. */
  photos?: GalleryPhoto[];
  eyebrow?: string;
  heading?: ReactNode;
  subheading?: string;
  id?: string;
} = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const reduced = useReducedMotion() ?? false;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const sectionSmooth = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  const accentY = useTransform(sectionSmooth, [0, 1], ["-18%", "18%"]);
  const accentOpacity = useTransform(sectionSmooth, [0, 0.1, 0.9, 1], [0, 0.07, 0.07, 0]);

  const count = photos.length;
  const close = useCallback(() => {
    setOpenIndex(null);
    // Return focus to the tile that opened the lightbox (WCAG 2.4.3).
    triggerRef.current?.focus();
  }, []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + count) % count)),
    [count],
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % count)),
    [count],
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative bg-[#F0E8DC] py-28 sm:py-36 px-6 overflow-hidden"
    >
      {/* Parallax dark wood accent */}
      <motion.div
        className="absolute inset-x-0 inset-y-[-18%] h-[136%] pointer-events-none"
        style={{ y: reduced ? 0 : accentY, opacity: reduced ? 0.05 : accentOpacity }}
      >
        <Image src="/wood/wood_dark.jpg" alt="" fill className="object-cover" sizes="100vw" />
      </motion.div>

      {/* Decorative ghost numeral */}
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 text-[20rem] font-serif italic
                   text-[#1C1917]/[0.03] leading-none select-none pointer-events-none"
        style={{ y: reduced ? 0 : accentY }}
      >
        iii
      </motion.div>

      <div className="relative max-w-7xl mx-auto">
        <GalleryHeader
          sectionSmooth={sectionSmooth}
          reduced={reduced}
          eyebrow={eyebrow}
          heading={heading}
          subheading={subheading}
        />

        {/* Uniform square grid — centered thumbnails, click to open full image. */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {photos.map((photo, i) => (
            <motion.button
              key={photo.thumb}
              type="button"
              onClick={(e) => {
                triggerRef.current = e.currentTarget;
                setOpenIndex(i);
              }}
              aria-label={`View larger: ${photo.alt}`}
              className="group relative aspect-square overflow-hidden rounded-lg bg-[#E5D9C9] cursor-pointer
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F0E8DC]"
              initial={reduced ? false : { opacity: 0 }}
              whileInView={reduced ? undefined : { opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, ease: EASE, delay: (i % 4) * 0.04 }}
            >
              <Image
                src={photo.thumb}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
              {/* Hover veil + expand affordance */}
              <div className="absolute inset-0 bg-[#1C1917]/0 group-hover:bg-[#1C1917]/25 transition-colors duration-300" />
              <span
                className="absolute inset-0 flex items-center justify-center text-white
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <span className="w-10 h-10 rounded-full bg-[#CA8A04]/90 flex items-center justify-center">
                  <ExpandIcon />
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox
            photos={photos}
            index={openIndex}
            onClose={close}
            onPrev={prev}
            onNext={next}
            reduced={reduced}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
