"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * Airbnb-style lead gallery for a service page: the AI design photos shown FIRST.
 * Mobile = a swipeable scroll-snap carousel with a counter + dots; desktop = a
 * bento grid (one large + up to four small) with a "Show all photos" button.
 * Any tile opens an accessible full-screen lightbox (keyboard, focus-trap,
 * scroll-lock, prev/next). Falls back gracefully for 1–4 photos.
 */
export function ServiceGallery({ images, title }: { images: string[]; title: string }) {
  const reduced = useReducedMotion();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [current, setCurrent] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);

  const open = useCallback((i: number) => setLightbox(i), []);
  const close = useCallback(() => setLightbox(null), []);
  const total = images.length;

  // Track the mobile carousel index from scroll position.
  const onRailScroll = () => {
    const el = railRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== current) setCurrent(Math.max(0, Math.min(total - 1, i)));
  };

  if (total === 0) return null;

  return (
    <div>
      {/* ---------- Mobile: swipe carousel ---------- */}
      <div className="relative md:hidden">
        <div
          ref={railRef}
          onScroll={onRailScroll}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => open(i)}
              aria-label={`${title} photo ${i + 1} of ${total} — view larger`}
              className="relative aspect-[4/3] w-full shrink-0 snap-center"
            >
              <Image
                src={src}
                alt={`${title} — design example ${i + 1}`}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
        {total > 1 && (
          <>
            <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white">
              {current + 1} / {total}
            </div>
            <div className="mt-3 flex justify-center gap-1.5">
              {images.map((src, i) => (
                <span
                  key={src}
                  aria-hidden="true"
                  className={`h-1.5 rounded-full transition-all ${i === current ? "w-5 bg-[#B45309]" : "w-1.5 bg-[#D6CCBA]"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ---------- Desktop: bento grid ---------- */}
      <div className="hidden md:block">
        <BentoGrid images={images} title={title} onOpen={open} />
        {total > 1 && (
          <button
            type="button"
            onClick={() => open(0)}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#D6CCBA] bg-white px-5 py-2.5 text-sm font-medium text-[#1C1917] shadow-sm transition-colors hover:bg-[#FAF7F2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]"
          >
            <GridIcon className="h-4 w-4" />
            Show all {total} photos
          </button>
        )}
      </div>

      {/* ---------- Lightbox ---------- */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            images={images}
            index={lightbox}
            title={title}
            reduced={!!reduced}
            onClose={close}
            onIndex={setLightbox}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- desktop bento ---------------- */

function Tile({
  src,
  alt,
  priority,
  onClick,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${alt} — view larger`}
      className={`group relative overflow-hidden bg-[#E5D9C9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2 ${className ?? ""}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width:1024px) 60vw, 640px"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
    </button>
  );
}

function BentoGrid({
  images,
  title,
  onOpen,
}: {
  images: string[];
  title: string;
  onOpen: (i: number) => void;
}) {
  const n = images.length;
  const alt = (i: number) => `${title} — design example ${i + 1}`;

  // One large primary + up to four supporting tiles, laid out so there are
  // never empty cells for 1–5+ photos.
  if (n === 1) {
    return (
      <div className="aspect-[2/1] overflow-hidden rounded-2xl">
        <Tile src={images[0]} alt={alt(0)} priority onClick={() => onOpen(0)} className="h-full w-full" />
      </div>
    );
  }
  if (n === 2) {
    return (
      <div className="grid aspect-[2/1] grid-cols-2 gap-2 overflow-hidden rounded-2xl">
        <Tile src={images[0]} alt={alt(0)} priority onClick={() => onOpen(0)} />
        <Tile src={images[1]} alt={alt(1)} onClick={() => onOpen(1)} />
      </div>
    );
  }
  if (n === 3) {
    return (
      <div className="grid aspect-[2/1] grid-cols-3 grid-rows-2 gap-2 overflow-hidden rounded-2xl">
        <Tile src={images[0]} alt={alt(0)} priority onClick={() => onOpen(0)} className="col-span-2 row-span-2" />
        <Tile src={images[1]} alt={alt(1)} onClick={() => onOpen(1)} />
        <Tile src={images[2]} alt={alt(2)} onClick={() => onOpen(2)} />
      </div>
    );
  }
  if (n === 4) {
    return (
      <div className="grid aspect-[2/1] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl">
        <Tile src={images[0]} alt={alt(0)} priority onClick={() => onOpen(0)} className="col-span-2 row-span-2" />
        <Tile src={images[1]} alt={alt(1)} onClick={() => onOpen(1)} className="col-span-2" />
        <Tile src={images[2]} alt={alt(2)} onClick={() => onOpen(2)} />
        <Tile src={images[3]} alt={alt(3)} onClick={() => onOpen(3)} />
      </div>
    );
  }
  // 5+: classic — one big left + 2×2 right.
  return (
    <div className="grid aspect-[2/1] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl">
      <Tile src={images[0]} alt={alt(0)} priority onClick={() => onOpen(0)} className="col-span-2 row-span-2" />
      <Tile src={images[1]} alt={alt(1)} onClick={() => onOpen(1)} />
      <Tile src={images[2]} alt={alt(2)} onClick={() => onOpen(2)} />
      <Tile src={images[3]} alt={alt(3)} onClick={() => onOpen(3)} />
      <Tile src={images[4]} alt={alt(4)} onClick={() => onOpen(4)} />
    </div>
  );
}

/* ---------------- lightbox ---------------- */

function Lightbox({
  images,
  index,
  title,
  reduced,
  onClose,
  onIndex,
}: {
  images: string[];
  index: number;
  title: string;
  reduced: boolean;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const total = images.length;
  const closeRef = useRef<HTMLButtonElement>(null);
  const prev = useCallback(() => onIndex((index - 1 + total) % total), [index, total, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % total), [index, total, onIndex]);

  // Scroll-lock + keyboard + initial focus.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, prev, next]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduced ? undefined : { opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex flex-col bg-black/95"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-4 text-white">
        <span className="text-sm tabular-nums text-white/80">
          {index + 1} / {total}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 pb-8" onClick={(e) => e.stopPropagation()}>
        {total > 1 && (
          <button
            type="button"
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-5"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
        <div className="relative h-full w-full max-w-5xl">
          <Image
            key={images[index]}
            src={images[index]}
            alt={`${title} — design example ${index + 1}`}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>
        {total > 1 && (
          <button
            type="button"
            onClick={next}
            aria-label="Next photo"
            className="absolute right-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-5"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
      </div>
    </motion.div>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
