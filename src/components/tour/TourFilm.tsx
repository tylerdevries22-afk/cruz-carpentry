"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import type { TourRoom } from "@/lib/tour";
import { buildTimeline } from "@/lib/tour-film";

/** px of scroll per second of film — controls scrub speed / page length. */
const PX_PER_SEC = 90;
/** only seek when the target differs by more than this (s). */
const SEEK_EPS = 0.02;
/** ms of scroll-silence before the hybrid snap settles on a room. */
const SNAP_IDLE_MS = 220;

export function TourFilm({ rooms }: { rooms: TourRoom[] }) {
  const reduced = useReducedMotion() ?? false;
  const timeline = useMemo(() => buildTimeline(rooms), [rooms]);
  const { total, rooms: marks } = timeline;

  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const snapTimer = useRef<number | null>(null);
  const snappingUntil = useRef(0);

  const [activeRoom, setActiveRoom] = useState(0); // index into marks
  const [inRoom, setInRoom] = useState(false); // currently within a room segment?
  const [atOpening, setAtOpening] = useState(true);
  const [progress, setProgress] = useState(0); // 0..1 over whole film

  const trackHeightPx = total * PX_PER_SEC;

  // Drive a single <video> from scroll position via rAF (no clip swapping → no flash).
  useEffect(() => {
    if (reduced) return;
    let running = true;
    const tick = () => {
      if (!running) return;
      const track = trackRef.current;
      const v = videoRef.current;
      if (track && v) {
        const rect = track.getBoundingClientRect();
        const scrolled = Math.min(Math.max(-rect.top, 0), trackHeightPx);
        const p = trackHeightPx > 0 ? scrolled / trackHeightPx : 0;
        const t = p * total;

        if (v.readyState >= 1 && Math.abs(v.currentTime - t) > SEEK_EPS) {
          try { v.currentTime = Math.min(t, total - 0.05); } catch { /* not seekable yet */ }
        }

        // active room = nearest mark; inRoom = within its segment span
        let nearest = 0;
        let best = Infinity;
        for (let k = 0; k < marks.length; k++) {
          const d = Math.abs(marks[k].midTime - t);
          if (d < best) { best = d; nearest = k; }
        }
        const m = marks[nearest];
        const within = t >= m.startTime - 0.15 && t <= m.endTime + 0.15;
        setActiveRoom((prev) => (prev !== nearest ? nearest : prev));
        setInRoom((prev) => (prev !== within ? within : prev));
        setAtOpening((prev) => {
          const next = t < (marks[0]?.startTime ?? 0) - 0.3;
          return prev !== next ? next : prev;
        });
        setProgress(p);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced, trackHeightPx, total, marks]);

  // Smoothly scroll the page so the film reaches a given global time.
  const scrollToTime = useCallback(
    (t: number) => {
      const track = trackRef.current;
      if (!track) return;
      const top = window.scrollY + track.getBoundingClientRect().top;
      snappingUntil.current = Date.now() + 900;
      window.scrollTo({ top: top + (t / total) * trackHeightPx, behavior: "smooth" });
    },
    [total, trackHeightPx],
  );

  // Hybrid snap: after scrolling stops, settle on the nearest room centre.
  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      if (snapTimer.current) window.clearTimeout(snapTimer.current);
      snapTimer.current = window.setTimeout(() => {
        if (Date.now() < snappingUntil.current) return;
        const track = trackRef.current;
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const scrolled = Math.min(Math.max(-rect.top, 0), trackHeightPx);
        if (scrolled <= 0 || scrolled >= trackHeightPx) return;
        const t = (scrolled / trackHeightPx) * total;
        let nearest = marks[0];
        let best = Infinity;
        for (const mm of marks) {
          const d = Math.abs(mm.midTime - t);
          if (d < best) { best = d; nearest = mm; }
        }
        if (Math.abs(nearest.midTime - t) > 0.3) scrollToTime(nearest.midTime);
      }, SNAP_IDLE_MS);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (snapTimer.current) window.clearTimeout(snapTimer.current);
    };
  }, [reduced, marks, total, trackHeightPx, scrollToTime]);

  // ---- Reduced motion: play the master film with controls ----
  if (reduced) {
    return (
      <section className="px-6 py-[12vh]">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#CA8A04]">
            Cruz Carpentry · the tour
          </p>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.05] text-[#efe7da]">
            A walk through the work
          </h1>
          <video
            className="mt-8 w-full rounded-2xl border border-[#2a241c]"
            src="/tour-film/master.mp4"
            poster="/tour-film/poster.jpg"
            controls
            playsInline
            preload="metadata"
          />
          <Link
            href="/estimate"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#B45309] px-7 py-3.5 font-semibold text-white hover:bg-[#92400E]"
          >
            Request an estimate &rarr;
          </Link>
        </div>
      </section>
    );
  }

  const room = marks[activeRoom]?.room;

  return (
    <section aria-label="Cruz Carpentry video tour">
      <div ref={trackRef} style={{ height: `${trackHeightPx}px` }} className="relative">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          {/* single continuous film — scrubbed by scroll */}
          <video
            ref={videoRef}
            src="/tour-film/master.mp4"
            poster="/tour-film/poster.jpg"
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* opening title — only over the opening segment */}
          <div
            className="pointer-events-none absolute inset-x-0 top-[18vh] z-10 text-center transition-opacity duration-500"
            style={{ opacity: atOpening ? 1 : 0 }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#CA8A04]">
              Cruz Carpentry · the tour
            </p>
            <h1 className="font-serif text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.04] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.8)]">
              A walk through the work
            </h1>
            <p className="mt-4 text-sm uppercase tracking-[0.18em] text-white/70">
              scroll to begin
            </p>
          </div>

          {/* auto-revealing room header + details — fades in within a room,
              out during the travel connectors */}
          {room && (
            <div
              className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/45 to-transparent px-[7vw] pb-[16vh] pt-[10vh] transition-all duration-500"
              style={{
                opacity: inRoom && !atOpening ? 1 : 0,
                transform: inRoom && !atOpening ? "translateY(0)" : "translateY(24px)",
              }}
            >
              <div className="text-[0.8rem] uppercase tracking-[0.24em] text-[#CA8A04]">
                {room.num} · {room.zone}
              </div>
              <h2 className="mt-2 font-serif text-3xl text-[#efe7da] sm:text-5xl drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)]">
                {room.title}
              </h2>
              <p className="mt-2 max-w-[42ch] leading-relaxed text-[#cabfae]">
                {room.caption}
              </p>
              <Link
                href="/estimate"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#B45309] px-7 py-3.5 font-semibold text-white transition-colors hover:bg-[#92400E] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Request an estimate &rarr;
              </Link>
            </div>
          )}

          {/* orb timeline rail */}
          <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-5 pt-10">
            <div className="relative mx-auto h-9 max-w-5xl">
              <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-white/20" />
              <div
                className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-[#CA8A04]"
                style={{ width: `${progress * 100}%` }}
              />
              {marks.map((m, i) => {
                const isActive = i === activeRoom;
                return (
                  <button
                    key={m.room.num}
                    type="button"
                    onClick={() => scrollToTime(m.midTime)}
                    aria-label={`Jump to ${m.room.title}`}
                    className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2 p-1.5 focus:outline-none"
                    style={{ left: `${m.fraction * 100}%` }}
                  >
                    {isActive && (
                      <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-[#CA8A04]/60" />
                    )}
                    <span
                      className={`relative block rounded-full ring-2 ring-black/30 transition-all ${
                        isActive
                          ? "h-3.5 w-3.5 bg-[#CA8A04] shadow-[0_0_12px_3px_rgba(202,138,4,0.8)]"
                          : "h-2.5 w-2.5 bg-white/55 group-hover:bg-[#CA8A04]"
                      }`}
                    />
                    <span className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#3a3024] bg-[#14100b]/95 px-2.5 py-1 text-[0.7rem] text-[#efe7da] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      {m.room.num} · {m.room.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
