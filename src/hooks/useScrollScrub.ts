"use client";

import { useRef } from "react";
import { useScroll, useSpring, MotionValue } from "framer-motion";
import { springConfig } from "@/config/woodMotionConfig";

export interface ScrollScrub {
  containerRef: React.RefObject<HTMLDivElement | null>;
  rawProgress: MotionValue<number>;
  progress: MotionValue<number>;
}

export function useScrollScrub(): ScrollScrub {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, springConfig);

  return { containerRef, rawProgress: scrollYProgress, progress };
}
