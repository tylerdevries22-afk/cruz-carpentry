"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { PHONE, PHONE_HREF, EASE } from "@/lib/constants";
import { PhoneIcon } from "@/components/ui/PhoneIcon";

export function CTA() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 55, damping: 20 });

  // Background wood parallax
  const bgY = useTransform(smooth, [0, 1], ["-10%", "10%"]);
  const bgOpacity = useTransform(smooth, [0, 0.2, 0.8, 1], [0, 0.08, 0.08, 0]);

  // Content reveal driven by scroll
  const { scrollYProgress: reveal } = useScroll({
    target: ref,
    offset: ["start 80%", "start 30%"],
  });
  const revealSmooth = useSpring(reveal, { stiffness: 65, damping: 18 });

  const y = useTransform(revealSmooth, [0, 1], [60, 0]);
  const opacity = useTransform(revealSmooth, [0, 0.5], [0, 1]);

  // Label clip-path draws in
  const labelClip = useTransform(revealSmooth, [0, 0.4],
    ["polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
     "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"]
  );

  // Gold line draws in
  const lineScaleX = useTransform(revealSmooth, [0.1, 0.6], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative bg-[#1C1917] py-28 sm:py-40 px-6 overflow-hidden"
    >
      {/* Parallax wood dark texture */}
      <motion.div
        className="absolute inset-x-0 inset-y-[-10%] h-[120%] pointer-events-none"
        style={{ y: bgY, opacity: bgOpacity }}
      >
        <Image src="/wood/wood_dark.jpg" alt="" fill className="object-cover" />
      </motion.div>

      {/* Warm radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(202,138,4,0.07)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        className="relative z-10 max-w-3xl mx-auto text-center"
        style={{ y, opacity }}
      >
        {/* Label */}
        <motion.p
          className="text-[#CA8A04] text-xs font-semibold tracking-[0.28em] uppercase mb-5"
          style={{ clipPath: labelClip }}
        >
          Get Started
        </motion.p>

        {/* Gold line */}
        <motion.div
          className="w-12 h-px bg-[#CA8A04] mx-auto mb-8 origin-left"
          style={{ scaleX: lineScaleX }}
        />

        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
          Ready to Build
          <br />
          <em className="italic text-[#FEF3C7]">Something Beautiful?</em>
        </h2>

        <p className="text-white/50 text-lg font-light leading-relaxed mb-12 max-w-lg mx-auto">
          Every project starts with a conversation. Call us today for a free
          in-home consultation and estimate.
        </p>

        <a
          href={PHONE_HREF}
          className="inline-flex items-center gap-3 bg-[#CA8A04] hover:bg-[#B45309]
                     text-white px-10 py-5 rounded-full text-lg font-medium
                     transition-colors duration-200 cursor-pointer shadow-2xl shadow-black/40"
        >
          <PhoneIcon />
          {PHONE}
        </a>

        <p className="text-white/30 text-sm mt-8 font-light tracking-wider">
          Serving the Colorado Front Range &middot; Free estimates
        </p>
      </motion.div>
    </section>
  );
}
