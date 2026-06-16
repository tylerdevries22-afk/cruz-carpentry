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
import { SERVICES, type Service } from "@/lib/services";

// One-shot in-view reveal (a single IntersectionObserver per card, not a live
// scroll listener) — far cheaper than per-card useScroll, and disabled for
// reduced-motion users. Each card links to its detail page. A pure opacity + y
// drift-up (no horizontal slide) on a real per-index cascade reads calmer and
// more luxurious than the prior scissor-in-from-the-sides paired pop.
function ServiceCard({ service, index }: { service: Service; index: number }) {
  const reduced = useReducedMotion();
  const imageSizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px";

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
    <motion.div {...reveal} className="h-full">
      <Link
        href={`/services/${service.slug}`}
        aria-label={`${service.title} — view details`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white
                   transition-[border-color,box-shadow] duration-500 hover:border-[#CA8A04]/30 hover:shadow-2xl
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F2]"
      >
        {/* Representative project photo */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={service.cardImage}
            alt={service.title}
            fill
            sizes={imageSizes}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <span className="absolute top-3 left-3 bg-[#B45309] text-white text-[0.7rem] font-semibold tracking-wider px-2.5 py-1 rounded-full">
            {service.num}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-7 sm:p-8">
          <div className="h-px bg-[#E8DDD4] mb-6" />
          <div className="w-10 h-10 mb-5 text-[#B45309] group-hover:scale-110 transition-transform duration-300">
            <service.Icon />
          </div>
          <h3 className="font-serif text-[1.2rem] text-[#1C1917] mb-3 leading-snug">
            {service.title}
          </h3>
          <p className="text-[#57534E] text-[0.9375rem] leading-relaxed font-light">
            {service.cardDescription}
          </p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-[#B45309] transition-colors group-hover:text-[#92400E]">
            View details
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
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
        </div>
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
        <Image src="/wood/wood_grain.jpg" alt="" fill className="object-cover" sizes="100vw" />
      </motion.div>

      {/* Decorative ghost text */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 text-[18rem] font-serif italic
                   text-[#1C1917]/[0.025] leading-none select-none pointer-events-none"
        style={{ y: reduced ? 0 : decoY }}
      >
        craft
      </motion.div>

      <div className="relative max-w-7xl mx-auto">
        {showHeader && <SectionHeader sectionProgress={sectionSmooth} reduced={reduced} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
