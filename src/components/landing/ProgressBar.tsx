"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { chapters } from "@/config/woodMotionConfig";
import { EASE } from "@/lib/constants";

interface ProgressBarProps {
  progress: MotionValue<number>;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const scaleX = useTransform(progress, [0, 1], [0, 1]);

  // The label only changes 6 times across the whole scroll, so derive the active
  // chapter from a value-change event (with an index guard) instead of scanning
  // every animation frame, and cross-fade it on change rather than hard-cutting.
  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    let idx = 0;
    for (let i = 0; i < chapters.length; i++) {
      if (v >= chapters[i].start) idx = i;
    }
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 pb-6 px-6 sm:px-12">
      {/* Label — cross-faded on chapter change */}
      <div className="mb-2 h-3.5">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="text-white/65 text-[10px] tracking-[0.2em] uppercase font-light"
          >
            {chapters[activeIndex].label}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Track */}
      <div className="relative h-px bg-white/15 w-full max-w-xs">
        <motion.div
          className="absolute left-0 top-0 h-full bg-[#CA8A04]"
          style={{ scaleX, transformOrigin: "left" }}
        />
      </div>
    </div>
  );
}
