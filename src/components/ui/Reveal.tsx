"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, REVEAL_DURATION, REVEAL_Y } from "@/lib/constants";

/**
 * One-shot in-view fade/rise — the site's canonical scroll reveal, extracted so
 * every section shares one timing. Slow-luxury defaults come from the shared
 * REVEAL_* tokens; the slight negative bottom margin lets it begin lifting a
 * touch before it's centered so the arrival reads as a drift, not a pop.
 * Renders a plain wrapper under reduced motion so content is always visible.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = REVEAL_Y,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -8% 0px" }}
      transition={{ duration: REVEAL_DURATION, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
