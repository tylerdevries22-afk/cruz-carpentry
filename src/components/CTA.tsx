"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PHONE, PHONE_HREF, SCRUB_SPRING } from "@/lib/constants";
import { PhoneIcon } from "@/components/ui/PhoneIcon";

export function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, SCRUB_SPRING);

  // Background wood parallax — deeper travel + a wider opacity plateau so the
  // dark section "breathes in" rather than snapping at the light→dark seam.
  const bgY = useTransform(smooth, [0, 1], ["-18%", "18%"]);
  const bgOpacity = useTransform(smooth, [0, 0.15, 0.85, 1], [0, 0.08, 0.08, 0]);

  // Content reveal driven by scroll
  const { scrollYProgress: reveal } = useScroll({
    target: ref,
    offset: ["start 80%", "start 30%"],
  });
  const revealSmooth = useSpring(reveal, SCRUB_SPRING);

  const y = useTransform(revealSmooth, [0, 1], [60, 0]);
  const opacity = useTransform(revealSmooth, [0, 0.65], [0, 1]);

  // Gold line draws in (transform:scaleX — GPU-composited)
  const lineScaleX = useTransform(revealSmooth, [0.1, 0.55], [0, 1]);

  return (
    <section
      ref={ref}
      id="contact"
      className="relative bg-[#1C1917] py-28 sm:py-40 px-6 overflow-hidden"
    >
      {/* Parallax wood dark texture */}
      <motion.div
        className="absolute inset-x-0 inset-y-[-10%] h-[120%] pointer-events-none"
        style={{ y: reduced ? 0 : bgY, opacity: reduced ? 0.08 : bgOpacity }}
      >
        <Image src="https://nkarcozbgtgtcqfhytrx.supabase.co/storage/v1/object/public/what-we-build/general/real-photos/wood_dark.jpg" alt="" fill className="object-cover" sizes="100vw" />
      </motion.div>

      {/* Warm radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(202,138,4,0.07)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        className="relative z-10 max-w-3xl mx-auto text-center"
        style={reduced ? undefined : { y, opacity }}
      >
        {/* Label rides the container's y/opacity (was a per-frame clip-path
            wipe — not GPU-compositable, repainted every scroll frame). */}
        <p className="text-[#CA8A04] text-xs font-semibold tracking-[0.28em] uppercase mb-5">
          Get Started
        </p>

        {/* Gold line */}
        <motion.div
          className="w-12 h-px bg-[#CA8A04] mx-auto mb-8 origin-left"
          style={reduced ? undefined : { scaleX: lineScaleX }}
        />

        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
          Ready to Build
          <br />
          <em className="italic text-[#FEF3C7]">Something Beautiful?</em>
        </h2>

        <p className="text-white/60 text-lg font-light leading-relaxed mb-12 max-w-lg mx-auto">
          Every project starts with a conversation. Call us today for a free
          in-home consultation and estimate.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/estimate"
            className="inline-flex items-center justify-center bg-[#B45309] hover:bg-[#92400E]
                       text-white px-10 py-5 rounded-full text-lg font-medium
                       transition-colors duration-200 shadow-2xl shadow-black/40
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]"
          >
            Request a Free Estimate
          </Link>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-3 border border-white/30 bg-white/5
                       text-white px-10 py-5 rounded-full text-lg font-medium
                       transition-colors duration-200 cursor-pointer hover:bg-white/15
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]"
          >
            <PhoneIcon />
            {PHONE}
          </a>
        </div>

        <p className="text-white/60 text-sm mt-8 font-light tracking-wider">
          Serving the Colorado Front Range &middot; Free estimates
        </p>
      </motion.div>
    </section>
  );
}
