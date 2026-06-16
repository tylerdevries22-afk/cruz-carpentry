"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { EASE, REVEAL_DURATION, REVEAL_Y, REVEAL_STAGGER, SCRUB_SPRING } from "@/lib/constants";
import { SERVICES_ORDERED, cardCarouselImages, type Service } from "@/lib/services";
import { ServiceCardCarousel } from "@/components/services/ServiceCardCarousel";

// One-shot in-view reveal (a single IntersectionObserver per card, not a live
// scroll listener) — far cheaper than per-card useScroll, and disabled for
// reduced-motion users. The photo area is a swipeable carousel; the text below
// links to the detail page. The carousel controls are kept OUTSIDE that link so
// we never nest interactive elements (button-in-anchor).
function ServiceCard({ service, index }: { service: Service; index: number }) {
  const reduced = useReducedMotion();

  const reveal = reduced
    ? {}
    : {
        initial: { opacity: 0, y: REVEAL_Y },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.18, margin: "0px 0px -8% 0px" },
        // Cap the cascade so cards far down the grid don't wait too long.
        transition: { duration: REVEAL_DURATION, ease: EASE, delay: Math.min(index, 5) * REVEAL_STAGGER },
      };

  return (
    <motion.div
      {...reveal}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white
                 transition-[border-color,box-shadow] duration-500 hover:border-[#CA8A04]/30 hover:shadow-2xl
                 focus-within:border-[#CA8A04]/40"
    >
      {/* Swipeable project photos */}
      <div className="relative">
        <ServiceCardCarousel images={cardCarouselImages(service)} alt={service.title} />
        <span className="pointer-events-none absolute top-3 left-3 z-30 rounded-full bg-[#B45309] px-2.5 py-1 text-[0.7rem] font-semibold tracking-wider text-white">
          {service.num}
        </span>
      </div>

      {/* Content — links to the detail page */}
      <Link
        href={`/services/${service.slug}`}
        aria-label={`${service.title} — view details`}
        className="flex flex-1 flex-col rounded-b-2xl p-5 sm:p-6
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B45309]"
      >
        {/* Icon + title on one row */}
        <div className="flex items-center gap-3.5">
          <span className="h-9 w-9 shrink-0 text-[#B45309] transition-transform duration-300 group-hover:scale-110">
            <service.Icon />
          </span>
          <h3 className="font-serif text-[1.35rem] sm:text-[1.45rem] leading-snug text-[#1C1917]">
            {service.title}
          </h3>
        </div>

        <p className="mt-3.5 text-[0.975rem] sm:text-base font-light leading-relaxed text-[#57534E]">
          {service.cardDescription}
        </p>

        {/* View details — pinned to the bottom-right */}
        <span className="mt-auto flex items-center justify-end gap-1.5 pt-5 text-sm font-medium text-[#B45309] transition-colors group-hover:text-[#92400E]">
          View details
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </Link>
    </motion.div>
  );
}

// Section header — scroll-driven, static under reduced motion
function SectionHeader({
  sectionProgress,
  reduced,
}: {
  sectionProgress: ReturnType<typeof useSpring>;
  reduced: boolean;
}) {
  const y = useTransform(sectionProgress, [0, 0.35], [64, 0]);
  const opacity = useTransform(sectionProgress, [0, 0.28], [0, 1]);

  return (
    <motion.div className="max-w-2xl mb-20" style={reduced ? undefined : { y, opacity }}>
      {/* Eyebrow rides the container's y/opacity (was a per-frame clip-path wipe,
          which is not GPU-compositable and repainted on every scroll frame). */}
      <p className="text-[#B45309] text-xs font-semibold tracking-[0.25em] uppercase mb-5">
        What We Build
      </p>
      <h2 className="font-serif text-5xl sm:text-6xl text-[#1C1917] leading-tight">
        Craftsmanship in
        <br />
        <em className="italic">every detail</em>
      </h2>
      <p className="text-[#57534E] text-lg font-light leading-relaxed mt-6">
        From a single fireplace mantel to a whole home of custom millwork — these
        are the things we shape in wood for homes across the Colorado Front Range.
        Select any one to see how we build it.
      </p>
    </motion.div>
  );
}

export function Services({ showHeader = true }: { showHeader?: boolean } = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  // Background parallax + header drive
  const { scrollYProgress: sectionScroll } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const sectionSmooth = useSpring(sectionScroll, SCRUB_SPRING);

  const bgY = useTransform(sectionSmooth, [0, 1], ["-16%", "16%"]);
  const bgOpacity = useTransform(sectionSmooth, [0, 0.15, 0.85, 1], [0, 0.055, 0.055, 0]);

  // Decorative ghost word parallaxes faster than the bg for layered depth.
  const decoY = useTransform(sectionSmooth, [0, 1], ["-28%", "28%"]);

  return (
    <section id="services" ref={sectionRef} className="relative bg-[#FAF7F2] py-28 sm:py-36 px-6 overflow-hidden">

      {/* Parallax wood grain background */}
      <motion.div className="absolute inset-x-0 inset-y-[-10%] h-[120%] pointer-events-none"
        style={{ y: reduced ? 0 : bgY, opacity: reduced ? 0.04 : bgOpacity }}
      >
        <Image src="https://nkarcozbgtgtcqfhytrx.supabase.co/storage/v1/object/public/what-we-build/general/real-photos/wood_grain.jpg" alt="" fill className="object-cover" sizes="100vw" />
      </motion.div>

      {/* Decorative ghost text */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 text-[18rem] font-serif italic
                   text-[#1C1917]/[0.025] leading-none select-none pointer-events-none"
        style={{ y: reduced ? 0 : decoY }}
      >
        craft
      </motion.div>

      <div className="relative mx-auto max-w-7xl 2xl:max-w-[90rem]">
        {showHeader && <SectionHeader sectionProgress={sectionSmooth} reduced={reduced} />}

        {/* 1 col (phone) → 2 (md) → 3 (lg) → 4 (2xl ultra-wide ≥1536px) */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 2xl:grid-cols-4">
          {SERVICES_ORDERED.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
