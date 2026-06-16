"use client";

import { useState } from "react";
import { useTransform, useMotionValueEvent, MotionValue } from "framer-motion";
import { motion } from "framer-motion";
import { useScrollScrub } from "@/hooks/useScrollScrub";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { WoodChapter } from "./WoodChapter";
import { ProgressBar } from "./ProgressBar";
import { chapters, SCROLL_HEIGHT, CROSSFADE, Chapter } from "@/config/woodMotionConfig";

// Wrapper so useTransform is called at component top level, not inside a map
function ChapterLayer({
  chapter,
  progress,
}: {
  chapter: Chapter;
  progress: MotionValue<number>;
}) {
  // Overlapping cross-fade: fade IN before this chapter's start and OUT after
  // its end, so a neighbor is always rising while this one falls and the summed
  // opacity stays ≥1 across every boundary — no black dip. The first chapter
  // clamps opaque at progress 0, the last at progress 1.
  const chapterOpacity = useTransform(
    progress,
    [chapter.start - CROSSFADE, chapter.start, chapter.end, chapter.end + CROSSFADE],
    [0, 1, 1, 0],
    { clamp: true }
  );

  return (
    <WoodChapter
      chapter={chapter}
      progress={progress}
      chapterOpacity={chapterOpacity}
    />
  );
}

function ChapterDot({
  chapter,
  progress,
}: {
  chapter: Chapter;
  progress: MotionValue<number>;
}) {
  const dotOpacity = useTransform(
    progress,
    [chapter.start, chapter.start + 0.05, chapter.end - 0.05, chapter.end],
    [0.25, 1, 1, 0.25]
  );
  const dotScale = useTransform(
    progress,
    [chapter.start, chapter.start + 0.05, chapter.end - 0.05, chapter.end],
    [0.7, 1.4, 1.4, 0.7]
  );

  return (
    <div className="relative w-2 h-2" title={chapter.label}>
      <motion.div
        className="w-2 h-2 rounded-full bg-white"
        style={{ opacity: dotOpacity, scale: dotScale }}
      />
    </div>
  );
}

export function ScrollWoodStory() {
  const reduced = useReducedMotion();
  // Branch BEFORE creating any scroll hooks, so reduced-motion visitors pay zero
  // for the scrub spring / per-frame listener (the motion lives in the child).
  if (reduced) {
    return <ReducedMotionFallback />;
  }
  return <ScrollWoodStoryMotion />;
}

function ScrollWoodStoryMotion() {
  const { containerRef, progress } = useScrollScrub();

  // Window the mounted chapters to the active one ±1, so at most ~3 full-viewport
  // images decode/hold GPU memory at a time instead of all 7. active±1 always
  // covers both chapters visible during an overlapping cross-fade (the incoming
  // chapter starts fading in only CROSSFADE before its start, well inside the
  // previous chapter's active window).
  const [active, setActive] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    let idx = 0;
    for (let i = 0; i < chapters.length; i++) {
      if (v >= chapters[i].start) idx = i;
    }
    setActive((prev) => (prev === idx ? prev : idx));
  });

  return (
    <div id="process" ref={containerRef} style={{ height: SCROLL_HEIGHT }} className="relative">
      {/* Sticky viewport */}
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-black">

        {/* Cinematic chapter layers — windowed to the active chapter ±1 */}
        {chapters.map((chapter, i) =>
          Math.abs(i - active) <= 1 ? (
            <ChapterLayer key={chapter.id} chapter={chapter} progress={progress} />
          ) : null,
        )}

        {/* Progress bar — bottom left */}
        <ProgressBar progress={progress} />

        {/* Chapter progress dots — decorative status only (hidden from AT; the
            title-on-div was unreliable and the headline text conveys the stage). */}
        <div aria-hidden="true" className="absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
          {chapters.map((chapter) => (
            <ChapterDot key={chapter.id} chapter={chapter} progress={progress} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ReducedMotionFallback() {
  return (
    <section id="process" className="bg-[#1C1917] py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[#CA8A04] text-xs font-semibold tracking-[0.25em] uppercase mb-6">
          The Process
        </p>
        <h2 className="font-serif text-5xl text-white mb-8 leading-tight">
          From raw wood to
          <br />
          <em className="italic text-[#FEF3C7]">finished masterpiece</em>
        </h2>
        <p className="text-white/60 text-lg font-light max-w-xl mx-auto">
          Selected, measured, cut, sanded, assembled, and finished — every piece
          built with patience and pride.
        </p>
      </div>
    </section>
  );
}
