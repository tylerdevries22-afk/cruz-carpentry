"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { chapters } from "@/config/woodMotionConfig";

interface ProgressBarProps {
  progress: MotionValue<number>;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const scaleX = useTransform(progress, [0, 1], [0, 1]);

  const activeLabel = useTransform(progress, (v) => {
    const active = chapters.findLast((c) => v >= c.start);
    return active?.label ?? chapters[0].label;
  });

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 pb-6 px-6 sm:px-12">
      {/* Label */}
      <motion.p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-2 font-light">
        {activeLabel}
      </motion.p>

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
