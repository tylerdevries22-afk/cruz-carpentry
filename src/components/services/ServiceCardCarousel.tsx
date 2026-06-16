"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

const SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px";

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      {dir === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

/**
 * Per-card photo carousel: a native scroll-snap rail (touch/trackpad swipe is
 * free), with prev/next buttons (desktop, on hover/focus) and always-visible dot
 * indicators. Controls are real <button>s — kept OUTSIDE the card's <Link> so we
 * never nest interactive elements. A single image renders without any controls.
 * Honors prefers-reduced-motion (no smooth scroll).
 */
export function ServiceCardCarousel({ images, alt }: { images: string[]; alt: string }) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = Math.max(0, Math.min(images.length - 1, i));
      track.scrollTo({ left: clamped * track.clientWidth, behavior: reduced ? "auto" : "smooth" });
    },
    [images.length, reduced],
  );

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    setActive((prev) => (prev === i ? prev : i));
  }, []);

  if (images.length <= 1) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden bg-[#E8DDD4]">
        {images[0] ? (
          <Image src={images[0]} alt={alt} fill sizes={SIZES} className="object-cover" />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
    );
  }

  const arrowBase =
    "absolute top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-opacity duration-200 hover:bg-black/65 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-default disabled:opacity-0 " +
    "opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100";

  return (
    <div className="group/carousel relative aspect-[16/10] overflow-hidden bg-[#E8DDD4]">
      <ul
        ref={trackRef}
        onScroll={onScroll}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollBehavior: reduced ? "auto" : "smooth" }}
      >
        {images.map((src, i) => (
          <li key={src} className="relative h-full w-full shrink-0 snap-center">
            <Image
              src={src}
              alt={i === 0 ? alt : `${alt} — photo ${i + 1}`}
              fill
              sizes={SIZES}
              className="object-cover"
            />
          </li>
        ))}
      </ul>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Prev / Next — desktop pointer affordance (touch users swipe) */}
      <button
        type="button"
        aria-label="Previous photo"
        onClick={() => goTo(active - 1)}
        disabled={active === 0}
        className={`${arrowBase} left-2 hidden sm:grid`}
      >
        <Chevron dir="left" />
      </button>
      <button
        type="button"
        aria-label="Next photo"
        onClick={() => goTo(active + 1)}
        disabled={active === images.length - 1}
        className={`${arrowBase} right-2 hidden sm:grid`}
      >
        <Chevron dir="right" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Show photo ${i + 1} of ${images.length}`}
            aria-current={i === active}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full shadow-[0_0_2px_rgba(0,0,0,0.4)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              i === active ? "w-4 bg-white" : "w-1.5 bg-white/55 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      <span className="sr-only" aria-live="polite">
        Photo {active + 1} of {images.length}
      </span>
    </div>
  );
}
