"use client";

import { useRef } from "react";
import { useScroll, useSpring, MotionValue } from "framer-motion";
import { SCRUB_SPRING } from "@/lib/constants";

export interface ScrollScrub {
  containerRef: React.RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
}

export function useScrollScrub(): ScrollScrub {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, SCRUB_SPRING);

  return { containerRef, progress };
}
