"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import type { TourRoom } from "@/lib/tour";
import { buildTimeline } from "@/lib/tour-film";

/** px of scroll per second of film — controls scrub speed / page length. */
const PX_PER_SEC = 90;
/** how close (px) the active video must be seekable before we seek. */
const SEEK_EPS = 0.015;
/** ms of scroll-silence before the hybrid snap settles on a room. */
const SNAP_IDLE_MS = 220;

export function TourFilm({ rooms }: { rooms: TourRoom[] }) {
  const reduced = useReducedMotion() ?? false;
  const timeline = useMemo(() => buildTimeline(rooms), [rooms]);
  const { segments, offsets, total, rooms: marks } = timeline;

  const trackRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const snapTimer = useRef<number | null>(null);
  const snappingUntil = useRef(0);

  // active segment index drives which <video>s are mounted (a small window)
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [activeRoom, setActiveRoom] = useState(0); // index into marks
  const [progress, setProgress] = useState(0); // 0..1 over whole film
  const [openRoom, setOpenRoom] = useState<number | null>(null); // marks index

  const trackHeightPx = total * PX_PER_SEC;

  const segmentAtTime = useCallback(
    (t: number) => {
      // last segment whose offset <= t
      let i = 0;
      for (let k = 0; k < segments.length; k++) {
        if (offsets[k] <= t) i = k;
        else break;
      }
      return i;
    },
    [segments, offsets],
  );

  // Drive the film from scroll position via rAF (decoupled from scroll events).
  useEffect(() => {
    if (reduced) return;
    let running = true;

    const tick = () => {
      if (!running) return;
      const track = trackRef.current;
      if (track) {
        const rect = track.getBoundingClientRect();
        const scrolled = Math.min(
          Math.max(-rect.top, 0),
          trackHeightPx,
        );
        const p = trackHeightPx > 0 ? scrolled / trackHeightPx : 0;
        const t = p * total;

        const segIdx = segmentAtTime(t);
        const local = t - offsets[segIdx];

        if (segIdx !== activeRef.current) {
          activeRef.current = segIdx;
          setActive(segIdx);
        }

        const v = videoRefs.current[segIdx];
        if (v && v.readyState >= 1) {
          const target = Math.min(local, (segments[segIdx].duration || 0) - 0.05);
          if (Math.abs(v.currentTime - target) > SEEK_EPS) {
            try { v.currentTime = target; } catch { /* not seekable yet */ }
          }
        }

        // nearest room mark (for rail highlight)
        let nearest = 0;
        let best = Infinity;
        for (let k = 0; k < marks.length; k++) {
          const d = Math.abs(marks[k].midTime - t);
          if (d < best) { best = d; nearest = k; }
        }
        setActiveRoom((prev) => (prev !== nearest ? nearest : prev));
        setProgress(p);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced, trackHeightPx, total, offsets, segments, marks, segmentAtTime]);

  // Smoothly scroll the page so the film reaches a given global time.
  const scrollToTime = useCallback(
    (t: number, smooth = true) => {
      const track = trackRef.current;
      if (!track) return;
      const top = window.scrollY + track.getBoundingClientRect().top;
      const y = top + (t / total) * trackHeightPx;
      snappingUntil.current = Date.now() + 900;
      window.scrollTo({ top: y, behavior: smooth ? "smooth" : "auto" });
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
        if (openRoom !== null) return;
        const track = trackRef.current;
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const scrolled = Math.min(Math.max(-rect.top, 0), trackHeightPx);
        const t = (scrolled / trackHeightPx) * total;
        // only snap while inside the film
        if (scrolled <= 0 || scrolled >= trackHeightPx) return;
        let nearest = marks[0];
        let best = Infinity;
        for (const m of marks) {
          const d = Math.abs(m.midTime - t);
          if (d < best) { best = d; nearest = m; }
        }
        if (Math.abs(nearest.midTime - t) > 0.25) scrollToTime(nearest.midTime);
      }, SNAP_IDLE_MS);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (snapTimer.current) window.clearTimeout(snapTimer.current);
    };
  }, [reduced, marks, total, trackHeightPx, scrollToTime, openRoom]);

  const openMark = useCallback(
    (i: number) => {
      setOpenRoom(i);
      scrollToTime(marks[i].midTime);
    },
    [marks, scrollToTime],
  );

  // ---- Reduced motion: play the concatenated master film with controls ----
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
            poster="/tour-frames/01_est.webp"
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

  const windowHas = (i: number) => Math.abs(i - active) <= 1;

  return (
    <section aria-label="Cruz Carpentry video tour">
      {/* tall track gives the scroll runway; the stage pins inside it */}
      <div ref={trackRef} style={{ height: `${trackHeightPx}px` }} className="relative">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          {/* stacked segment videos — only a small window is mounted with a src */}
          {segments.map((seg, i) => (
            <video
              key={i}
              ref={(el) => { videoRefs.current[i] = el; }}
              src={windowHas(i) ? seg.src : undefined}
              muted
              playsInline
              preload={windowHas(i) ? "auto" : "none"}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-200"
              style={{ opacity: i === active ? 1 : 0 }}
            />
          ))}

          {/* opening title (fades out once past the opening segment) */}
          <div
            className="pointer-events-none absolute inset-x-0 top-[18vh] z-10 text-center transition-opacity duration-500"
            style={{ opacity: active === 0 ? 1 : 0 }}
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

          {/* current room label (top-left) */}
          {marks[activeRoom] && (
            <div className="pointer-events-none absolute left-6 top-6 z-10 transition-opacity duration-300"
                 style={{ opacity: active === 0 ? 0 : 1 }}>
              <div className="font-serif text-3xl leading-none text-[#CA8A04] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                {marks[activeRoom].room.num}
              </div>
              <div className="mt-1 font-serif text-lg text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                {marks[activeRoom].room.title}
              </div>
            </div>
          )}

          {/* detail overlay for an opened room */}
          {openRoom !== null && marks[openRoom] && (
            <div className="absolute inset-0 z-30 flex items-end bg-gradient-to-t from-black/90 via-black/40 to-transparent">
              <div className="w-full px-[8vw] pb-[14vh] pt-[7vh]">
                <div className="text-[0.8rem] uppercase tracking-[0.24em] text-[#CA8A04]">
                  {marks[openRoom].room.num} · {marks[openRoom].room.zone}
                </div>
                <h2 className="mt-2 font-serif text-3xl text-[#efe7da] sm:text-5xl">
                  {marks[openRoom].room.title}
                </h2>
                <p className="mt-2 max-w-[42ch] leading-relaxed text-[#a89a86]">
                  {marks[openRoom].room.caption}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href="/estimate"
                    className="inline-flex items-center gap-2 rounded-full bg-[#B45309] px-7 py-3.5 font-semibold text-white transition-colors hover:bg-[#92400E] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Request an estimate &rarr;
                  </Link>
                  <button
                    type="button"
                    onClick={() => setOpenRoom(null)}
                    className="rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Keep watching
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* orb timeline rail */}
          <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-5 pt-10 bg-gradient-to-t from-black/70 to-transparent">
            <div className="relative mx-auto h-9 max-w-5xl">
              {/* progress track */}
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
                    onClick={() => openMark(i)}
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
