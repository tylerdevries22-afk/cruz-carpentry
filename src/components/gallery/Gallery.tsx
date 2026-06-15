"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { EASE } from "@/lib/constants";
import { GALLERY_PHOTOS } from "./photos";

// Section header — scroll-driven, matches the rest of the site. Falls back to a
// static render when the visitor prefers reduced motion.
function GalleryHeader({
  sectionSmooth,
  reduced,
}: {
  sectionSmooth: ReturnType<typeof useSpring>;
  reduced: boolean;
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
    <motion.div className="mb-16 sm:mb-20" style={reduced ? undefined : { y, opacity }}>
      <motion.p
        className="text-[#CA8A04] text-xs font-semibold tracking-[0.25em] uppercase mb-5"
        style={reduced ? undefined : { clipPath: labelClip }}
      >
        Our Work
      </motion.p>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <h2 className="font-serif text-5xl sm:text-6xl text-[#1C1917] leading-tight">
          Built with purpose,
          <br />
          <em className="italic">finished with care</em>
        </h2>
        <div className="sm:text-right shrink-0">
          <motion.div
            className="h-px w-24 bg-[#CA8A04] mb-3 origin-left sm:origin-right sm:ml-auto"
            style={reduced ? undefined : { scaleX: lineScaleX }}
          />
          <p className="text-[#78716C] text-sm font-light">
            Custom millwork
            <br />
            Colorado Front Range
          </p>
        </div>
      </div>
    </motion.div>
  );
}

const [featured, ...rest] = GALLERY_PHOTOS;

export function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const sectionSmooth = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  // Parallax wood accent behind the section (single scroll tracker for the
  // whole section — per-image parallax doesn't scale to a large gallery).
  const accentY = useTransform(sectionSmooth, [0, 1], ["-18%", "18%"]);
  const accentOpacity = useTransform(
    sectionSmooth,
    [0, 0.1, 0.9, 1],
    [0, 0.07, 0.07, 0],
  );

  // One-shot reveal, disabled for reduced-motion users (framer's JS transforms
  // aren't covered by the global prefers-reduced-motion CSS rule).
  const featuredReveal = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.7, ease: EASE },
      };

  return (
    <section
      ref={sectionRef}
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
        <GalleryHeader sectionSmooth={sectionSmooth} reduced={reduced} />

        {/* Featured image */}
        {featured && (
          <motion.div
            className="relative overflow-hidden rounded-xl mb-4 aspect-[3/2]"
            {...featuredReveal}
          >
            <Image
              src={featured.src}
              alt={featured.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1152px"
            />
          </motion.div>
        )}

        {/* Masonry grid — lazy-loaded, lightweight one-shot reveal per photo. */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {rest.map((photo, i) => {
            const reveal = reduced
              ? {}
              : {
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.15 },
                  transition: { duration: 0.55, ease: EASE, delay: (i % 3) * 0.05 },
                };
            return (
              <motion.div
                key={photo.src}
                className="mb-4 break-inside-avoid overflow-hidden rounded-xl"
                {...reveal}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  className="w-full h-auto"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
