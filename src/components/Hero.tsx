"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { PHONE, PHONE_HREF, EASE } from "@/lib/constants";
import { PhoneIcon } from "@/components/ui/PhoneIcon";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

const riseUp = {
  hidden: { y: 32, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: EASE } },
};

const fadein = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: EASE } },
};

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return; // honor reduced motion — leave the poster shown
    // Defer video load/play until after the page loads so the video bytes don't
    // compete with the LCP poster for bandwidth on first paint.
    const start = () => v.play().catch(() => {/* blocked — poster shown */});
    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
      return () => window.removeEventListener("load", start);
    }
  }, [reduced]);

  // Track hero scrolling out of viewport
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });

  // Content floats up and fades as user scrolls away
  const contentY = useTransform(smooth, [0, 1], [0, -90]);
  const contentOpacity = useTransform(smooth, [0, 0.65], [1, 0]);

  // Video subtly zooms as hero exits (parallax depth)
  const videoScale = useTransform(smooth, [0, 1], [1, 1.1]);

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center"
      aria-label="Hero"
    >
      {/* Video wrapper — scale drives parallax depth on scroll-out */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: reduced ? 1 : videoScale, willChange: "transform" }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="none"
          poster="/images/hero-poster.webp"
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Dual-layer gradient — radial centers darkness on text, linear darkens bottom */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,rgba(0,0,0,0.52)_0%,rgba(0,0,0,0.18)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/78" />

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center text-white px-6 w-full max-w-6xl mx-auto"
        variants={container}
        initial={reduced ? false : "hidden"}
        animate="show"
        style={{ y: reduced ? undefined : contentY, opacity: reduced ? undefined : contentOpacity }}
      >
        {/* Star badge */}
        <motion.div
          variants={fadein}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 mb-8"
        >
          <Stars />
          <span className="text-white/85 text-xs font-light tracking-widest uppercase">
            5.0 · Google Reviews
          </span>
        </motion.div>

        {/* Business name (LCP) — a plain <h1> that paints immediately with a
            paint-time CSS rise, so LCP isn't gated by JS hydration. */}
        <h1
          className="font-serif leading-[0.9] tracking-[-0.02em] mb-5 hero-rise"
          style={{ fontSize: "clamp(3.25rem, 9.5vw, 9rem)" }}
        >
          <em className="italic text-white">Cruz</em>
          <span className="text-white"> Carpentry</span>
        </h1>

        {/* Gold divider */}
        <motion.div
          variants={fadein}
          className="w-14 h-px bg-[#CA8A04] mb-6"
        />

        {/* Tagline */}
        <motion.p
          variants={riseUp}
          className="font-serif italic text-2xl sm:text-3xl text-white/90 mb-4 leading-snug"
        >
          Built by Hand. Built to Last.
        </motion.p>

        {/* Specialty line */}
        <motion.p
          variants={fadein}
          className="text-[11px] tracking-[0.28em] uppercase text-white/70 mb-10 font-light"
        >
          Custom Carpentry &amp; Fine Millwork &nbsp;·&nbsp; Colorado
        </motion.p>

        {/* CTA */}
        <motion.a
          variants={riseUp}
          href={PHONE_HREF}
          className="inline-flex items-center gap-3 bg-[#B45309] hover:bg-[#92400E]
                     text-white px-8 py-3.5 rounded-full text-sm font-medium
                     transition-colors duration-200 cursor-pointer shadow-lg shadow-black/30
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
        >
          <PhoneIcon className="w-4 h-4" />
          Call for a Free Quote &middot; {PHONE}
        </motion.a>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-white/45 text-[9px] tracking-[0.3em] uppercase">Scroll</span>
        {reduced ? (
          <div className="w-px h-8 bg-gradient-to-b from-white/45 to-transparent" />
        ) : (
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-white/45 to-transparent"
            animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
        )}
      </div>
    </section>
  );
}

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-3 h-3 text-[#FBBF24] fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}
