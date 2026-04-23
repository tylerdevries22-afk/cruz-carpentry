"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { Chapter } from "@/config/woodMotionConfig";

interface WoodChapterProps {
  chapter: Chapter;
  progress: MotionValue<number>;
  chapterOpacity: MotionValue<number>;
}

export function WoodChapter({ chapter, progress, chapterOpacity }: WoodChapterProps) {
  const localProgress = useTransform(
    progress,
    [chapter.start, chapter.end],
    [0, 1],
    { clamp: true }
  );

  const scale = useTransform(localProgress, [0, 1], chapter.scale);

  const brightness = useTransform(
    localProgress,
    [0, 0.5, 1],
    [chapter.filters.brightness * 0.82, chapter.filters.brightness, chapter.filters.brightness]
  );

  const filterStyle = useTransform(brightness, (b) =>
    `brightness(${b}) contrast(${chapter.filters.contrast}) saturate(${chapter.filters.saturate}) sepia(${chapter.filters.sepia})`
  );

  const overlayOpacity = useTransform(
    localProgress,
    [0, 0.6, 1],
    [chapter.overlayOpacity + 0.15, chapter.overlayOpacity, chapter.overlayOpacity]
  );

  const textY = useTransform(localProgress, [0, 0.25, 0.75, 1], [36, 0, 0, -18]);
  const textOpacity = useTransform(localProgress, [0, 0.2, 0.72, 1], [0, 1, 1, 0]);
  const labelOpacity = useTransform(localProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <motion.div className="absolute inset-0 overflow-hidden" style={{ opacity: chapterOpacity }}>
      {/* Photo with scale + CSS filter */}
      <motion.div className="absolute inset-0" style={{ scale, filter: filterStyle }}>
        <Image
          src={chapter.image}
          alt={chapter.headline}
          fill
          className="object-cover"
          priority={chapter.id === "raw" || chapter.id === "grain"}
          sizes="100vw"
        />
      </motion.div>

      {/* Vignette */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: overlayOpacity,
          background: "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.9) 100%)",
        }}
      />

      {/* Edge gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25 pointer-events-none" />

      {/* Chapter label */}
      <motion.p
        className="absolute top-8 left-8 sm:top-12 sm:left-12 text-[#CA8A04] text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase"
        style={{ opacity: labelOpacity }}
      >
        {chapter.label}
      </motion.p>

      {/* Main headline */}
      <motion.div
        className="absolute bottom-20 sm:bottom-24 left-0 right-0 px-8 sm:px-16 text-center"
        style={{ y: textY, opacity: textOpacity }}
      >
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-4 drop-shadow-2xl">
          {chapter.headline}
        </h2>
        <p className="text-white/60 text-base sm:text-lg font-light tracking-wide">
          {chapter.sub}
        </p>
      </motion.div>

      {/* Stage-specific overlays */}
      {chapter.id === "measure" && <MeasureOverlay localProgress={localProgress} />}
      {chapter.id === "cut" && <SawdustOverlay localProgress={localProgress} />}
      {chapter.id === "finish" && <FinishCTA localProgress={localProgress} />}
    </motion.div>
  );
}

function MeasureOverlay({ localProgress }: { localProgress: MotionValue<number> }) {
  const opacity = useTransform(localProgress, [0.2, 0.5, 0.85, 1], [0, 0.85, 0.85, 0]);
  const pathLength = useTransform(localProgress, [0.2, 0.65], [0, 1], { clamp: true });

  return (
    <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <motion.line
          x1="220" y1="420" x2="1700" y2="420"
          stroke="#CA8A04" strokeWidth="1.5" strokeDasharray="14 8"
          style={{ pathLength }}
        />
        <motion.line
          x1="220" y1="660" x2="1700" y2="660"
          stroke="#CA8A04" strokeWidth="1.5" strokeDasharray="14 8"
          style={{ pathLength }}
        />
        {Array.from({ length: 13 }).map((_, i) => (
          <line
            key={i}
            x1={220 + i * 120} y1="408" x2={220 + i * 120} y2="432"
            stroke="#CA8A04" strokeWidth="1.5"
          />
        ))}
        <text x="960" y="395" textAnchor="middle" fill="#CA8A04" fontSize="20" fontFamily="monospace" opacity="0.95">
          96&#34; — 2438mm
        </text>
        <path d="M 220 406 L 220 434 L 250 434" stroke="#CA8A04" strokeWidth="2" fill="none" />
        <path d="M 1700 406 L 1700 434 L 1670 434" stroke="#CA8A04" strokeWidth="2" fill="none" />
      </svg>
    </motion.div>
  );
}

function SawdustOverlay({ localProgress }: { localProgress: MotionValue<number> }) {
  const opacity = useTransform(localProgress, [0.05, 0.35, 0.8, 1], [0, 0.7, 0.7, 0]);
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none mix-blend-screen"
      style={{ opacity }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(1.5px 1.5px at 12% 22%, rgba(215,175,105,0.95) 0%, transparent 100%),
            radial-gradient(1px 1px at 34% 58%, rgba(195,155,85,0.85) 0%, transparent 100%),
            radial-gradient(2px 2px at 56% 33%, rgba(225,185,115,0.9) 0%, transparent 100%),
            radial-gradient(1px 1px at 71% 72%, rgba(205,165,95,0.8) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 84% 44%, rgba(215,175,105,0.85) 0%, transparent 100%),
            radial-gradient(1px 1px at 23% 81%, rgba(195,155,85,0.75) 0%, transparent 100%),
            radial-gradient(2px 2px at 47% 14%, rgba(225,185,115,0.9) 0%, transparent 100%),
            radial-gradient(1px 1px at 79% 19%, rgba(205,165,95,0.8) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 9% 52%, rgba(215,175,105,0.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 91% 77%, rgba(195,155,85,0.9) 0%, transparent 100%),
            radial-gradient(1px 1px at 63% 89%, rgba(225,185,115,0.85) 0%, transparent 100%),
            radial-gradient(2px 2px at 41% 46%, rgba(205,165,95,0.65) 0%, transparent 100%),
            radial-gradient(1px 1px at 18% 37%, rgba(215,175,105,0.8) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 67% 63%, rgba(195,155,85,0.75) 0%, transparent 100%),
            radial-gradient(1px 1px at 88% 31%, rgba(225,185,115,0.7) 0%, transparent 100%)
          `,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(108deg, transparent 35%, rgba(215,175,100,0.06) 50%, transparent 65%)",
        }}
      />
    </motion.div>
  );
}

function FinishCTA({ localProgress }: { localProgress: MotionValue<number> }) {
  const opacity = useTransform(localProgress, [0.45, 0.75], [0, 1]);
  const y = useTransform(localProgress, [0.45, 0.75], [28, 0]);
  const warmGlow = useTransform(localProgress, [0, 1], [0, 0.18]);

  return (
    <>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: warmGlow,
          background: "radial-gradient(ellipse at 50% 55%, rgba(202,138,4,0.35) 0%, transparent 65%)",
          mixBlendMode: "overlay",
        }}
      />
      <motion.div
        className="absolute bottom-10 left-0 right-0 flex justify-center z-10"
        style={{ opacity, y }}
      >
        <a
          href="tel:+17202800812"
          className="inline-flex items-center gap-3 bg-[#CA8A04] hover:bg-[#B45309] text-white px-10 py-4 rounded-full text-base font-medium transition-colors duration-200 cursor-pointer shadow-2xl"
        >
          <PhoneIcon />
          Call for a Free Quote · (720) 280-0812
        </a>
      </motion.div>
    </>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.08 6.08l1.91-1.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
