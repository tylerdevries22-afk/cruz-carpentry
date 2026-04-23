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

const photos = [
  {
    src: "/images/project-1.jpg",
    alt: "Custom floor-to-ceiling bookcase with cabinet base",
    label: "Built-In Bookshelves",
    location: "Residential — Denver, CO",
  },
  {
    src: "/images/project-2.jpg",
    alt: "Custom walk-in closet shelving system spanning full room",
    label: "Walk-In Closet System",
    location: "Residential — Aurora, CO",
  },
  {
    src: "/images/project-3.jpg",
    alt: "Built-in home office desk with surrounding shelving",
    label: "Home Office Built-In",
    location: "Residential — Lakewood, CO",
  },
];

interface ParallaxPhotoProps {
  src: string;
  alt: string;
  label: string;
  location: string;
  className?: string;
  revealOffset?: [string, string];
  parallaxRange?: [string, string];
}

function ParallaxPhoto({
  src,
  alt,
  label,
  location,
  className = "",
  revealOffset = ["start 90%", "start 35%"],
  parallaxRange = ["-14%", "14%"],
}: ParallaxPhotoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Clip-path scroll reveal
  const { scrollYProgress: revealScroll } = useScroll({
    target: ref,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    offset: revealOffset as any,
  });
  const reveal = useSpring(revealScroll, { stiffness: 44, damping: 22 });

  // Clip-path: diagonal reveal from left
  const clipPath = useTransform(reveal, [0, 1], [
    "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
    "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  ]);

  // Caption reveal
  const captionY = useTransform(reveal, [0.4, 1], [20, 0]);
  const captionOpacity = useTransform(reveal, [0.4, 0.9], [0, 1]);

  // Image parallax (separate scroll range)
  const { scrollYProgress: parallaxScroll } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(parallaxScroll, [0, 1], parallaxRange);

  if (reduced) {
    return (
      <div className={`relative overflow-hidden rounded-xl ${className}`}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="100vw" />
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white font-serif text-lg">{label}</p>
          <p className="text-white/60 text-xs">{location}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{ clipPath }}
    >
      {/* Parallax image — larger than container so it can move */}
      <motion.div
        className="absolute inset-x-0 h-[128%] top-[-14%]"
        style={{ y: imageY }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </motion.div>

      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

      {/* Caption */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-5 sm:p-7"
        style={{ y: captionY, opacity: captionOpacity }}
      >
        <p className="text-white font-serif text-xl leading-tight mb-0.5">{label}</p>
        <p className="text-white/55 text-xs tracking-wide font-light">{location}</p>
      </motion.div>
    </motion.div>
  );
}

// Section header — scroll-driven
function GalleryHeader({
  sectionSmooth,
}: {
  sectionSmooth: ReturnType<typeof useSpring>;
}) {
  const y = useTransform(sectionSmooth, [0, 0.25], [50, 0]);
  const opacity = useTransform(sectionSmooth, [0, 0.2], [0, 1]);
  const labelClip = useTransform(
    sectionSmooth,
    [0, 0.18],
    [
      "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
      "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    ]
  );
  const lineScaleX = useTransform(sectionSmooth, [0.05, 0.25], [0, 1]);

  return (
    <motion.div className="mb-16 sm:mb-20" style={{ y, opacity }}>
      <motion.p
        className="text-[#CA8A04] text-xs font-semibold tracking-[0.25em] uppercase mb-5"
        style={{ clipPath: labelClip }}
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
            style={{ scaleX: lineScaleX }}
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

export function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: sectionScroll } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const sectionSmooth = useSpring(sectionScroll, { stiffness: 50, damping: 20 });

  // Parallax wood accent behind section
  const accentY = useTransform(sectionSmooth, [0, 1], ["-18%", "18%"]);
  const accentOpacity = useTransform(sectionSmooth, [0, 0.1, 0.9, 1], [0, 0.07, 0.07, 0]);

  // Continuous container drift keeps photos moving throughout the section
  const photosY = useTransform(sectionSmooth, [0, 1], ["2.5%", "-2.5%"]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#F0E8DC] py-28 sm:py-36 px-6 overflow-hidden"
    >
      {/* Parallax dark wood accent */}
      <motion.div
        className="absolute inset-x-0 inset-y-[-18%] h-[136%] pointer-events-none"
        style={{ y: accentY, opacity: accentOpacity }}
      >
        <Image src="/wood/wood_dark.jpg" alt="" fill className="object-cover" />
      </motion.div>

      {/* Decorative ghost numeral */}
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 text-[20rem] font-serif italic
                   text-[#1C1917]/[0.03] leading-none select-none pointer-events-none"
        style={{ y: accentY }}
      >
        iii
      </motion.div>

      <div className="relative max-w-7xl mx-auto">
        <GalleryHeader sectionSmooth={sectionSmooth} />

        {/* Layout: full-width banner + 2-column below */}
        <motion.div className="space-y-4" style={{ y: photosY }}>
          <ParallaxPhoto
            src={photos[0].src}
            alt={photos[0].alt}
            label={photos[0].label}
            location={photos[0].location}
            className="h-[320px] sm:h-[460px] lg:h-[560px]"
            revealOffset={["start 95%", "start 10%"]}
            parallaxRange={["-12%", "12%"]}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ParallaxPhoto
              src={photos[1].src}
              alt={photos[1].alt}
              label={photos[1].label}
              location={photos[1].location}
              className="h-[280px] sm:h-[360px]"
              revealOffset={["start 95%", "start 18%"]}
              parallaxRange={["-10%", "10%"]}
            />
            <ParallaxPhoto
              src={photos[2].src}
              alt={photos[2].alt}
              label={photos[2].label}
              location={photos[2].location}
              className="h-[280px] sm:h-[360px]"
              revealOffset={["start 95%", "start 18%"]}
              parallaxRange={["-10%", "10%"]}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
