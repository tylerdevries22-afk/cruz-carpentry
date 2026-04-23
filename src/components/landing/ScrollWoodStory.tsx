"use client";

import { useTransform, MotionValue } from "framer-motion";
import { motion } from "framer-motion";
import { useScrollScrub } from "@/hooks/useScrollScrub";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { WoodChapter } from "./WoodChapter";
import { ProgressBar } from "./ProgressBar";
import { chapters, SCROLL_HEIGHT, Chapter } from "@/config/woodMotionConfig";

// Wrapper so useTransform is called at component top level, not inside a map
function ChapterLayer({
  chapter,
  progress,
}: {
  chapter: Chapter;
  progress: MotionValue<number>;
}) {
  const chapterOpacity = useTransform(
    progress,
    [chapter.start, chapter.start + 0.04, chapter.end - 0.04, chapter.end],
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
    [chapter.start, chapter.start + 0.03, chapter.end - 0.03, chapter.end],
    [0.25, 1, 1, 0.25]
  );
  const dotScale = useTransform(
    progress,
    [chapter.start, chapter.start + 0.03, chapter.end - 0.03, chapter.end],
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
  const { containerRef, progress } = useScrollScrub();
  const reduced = useReducedMotion();

  if (reduced) {
    return <ReducedMotionFallback />;
  }

  return (
    <div ref={containerRef} style={{ height: SCROLL_HEIGHT }} className="relative">
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden bg-black">

        {/* Cinematic chapter layers */}
        {chapters.map((chapter) => (
          <ChapterLayer key={chapter.id} chapter={chapter} progress={progress} />
        ))}

        {/* Progress bar — bottom left */}
        <ProgressBar progress={progress} />

        {/* Chapter navigation dots — right edge */}
        <div className="absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
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
    <section className="bg-[#1C1917] py-32 px-6">
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
