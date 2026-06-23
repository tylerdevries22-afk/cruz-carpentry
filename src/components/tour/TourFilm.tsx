"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { TourRoom } from "@/lib/tour";
import { buildTimeline } from "@/lib/tour-film";
import { SERVICES } from "@/lib/services";
import { ServiceDetailOverlay } from "@/components/tour/ServiceDetailOverlay";

/** px of scroll per second of film — controls scrub speed / page length. */
const PX_PER_SEC = 90;
/** only seek when the eased target differs by more than this (s). */
const SEEK_EPS = 0.01;
/** ms of scroll-silence before the gentle snap settles on a room. */
const SNAP_IDLE_MS = 360;
/** easing time-constant (s) for converging the film time on the scroll target —
 *  smaller = tighter, more 1:1 tracking of the scroll. */
const EASE_TAU = 0.06;
/** only "click into place" when already within this of a room centre (s). */
const SNAP_MAX_DIST = 0.9;
/** safety: forget an in-flight seek whose `seeked` event never arrived (ms). */
const SEEK_TIMEOUT_MS = 350;
/** seconds of extra scroll after the film ends that holds the last frame, so the
 *  final build (room 16, the garage) finishes assembling and its heading dwells on
 *  screen before the page releases to the CTA instead of whipping out of view. */
const END_HOLD = 4;
/** every build's heading + buttons stay on screen for this many seconds of film —
 *  identical for all 16 so they read for the same length of time. */
const HEADER_SPAN = 7;
/** the opening "scroll to begin" title shows only for this first sliver of scroll;
 *  the instant you scroll past it the first build's heading takes over, so the
 *  Interior & Exterior Doors heading is up as soon as the animation starts. */
const OPENING_TITLE_S = 0.5;

const DESKTOP_SRC = "/tour-film/master.mp4";
const MOBILE_SRC = "/tour-film/master-mobile.mp4";
const POSTER = "/tour-film/poster.jpg";

/** room.num ↔ service.num — so each build's button opens its real detail page. */
const SLUG_BY_NUM: Record<string, string> = Object.fromEntries(
  SERVICES.map((s) => [s.num, s.slug]),
);

/** staggered reveal for the per-room header — replays each time a room enters. */
const REVEAL_GROUP = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};
const REVEAL_ITEM = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export function TourFilm({ rooms }: { rooms: TourRoom[] }) {
  const reduced = useReducedMotion() ?? false;
  const timeline = useMemo(() => buildTimeline(rooms), [rooms]);
  const { total, rooms: marks } = timeline;

  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null); // gold fill, written directly
  const rafRef = useRef<number | null>(null);
  const snapTimer = useRef<number | null>(null);
  const snappingUntil = useRef(0);
  const seeking = useRef(false); // throttle: one in-flight seek at a time
  const seekStartedAt = useRef(0);

  // These drive low-frequency UI (header copy, active orb). They are only set
  // when they actually change, so the component re-renders ~16×/film, not 60×/s.
  const [activeRoom, setActiveRoom] = useState(0); // index into marks
  const [inRoom, setInRoom] = useState(false); // currently within a room segment?
  const [atOpening, setAtOpening] = useState(true);
  const [open, setOpen] = useState<{ slug: string; label: string } | null>(null);
  const [mediaReady, setMediaReady] = useState(false); // false until the film can scrub
  const [loadPct, setLoadPct] = useState(0); // mobile blob download progress (0–1)
  const [scrubBlocked, setScrubBlocked] = useState(false); // scrubbing couldn't init (e.g. iOS Low Power Mode) → tap-to-play fallback
  const usesMobileSrcRef = useRef(false); // chose the lean mobile master (read in the fallback render)

  // Track is the film length plus END_HOLD of "hold on the last frame" scroll.
  const trackHeightPx = (total + END_HOLD) * PX_PER_SEC;

  // Source strategy. Desktop streams the full-quality master directly — it buffers
  // fast on broadband and seeks against the byte-range as it goes. Phones (and
  // data-saver) instead fetch the lean ~10MB master as a BLOB and play from an
  // object URL: the whole file is local before scrubbing starts, so every seek is
  // instant with no network stall, and it sidesteps iOS Safari ignoring `preload`
  // until the element is activated. If the fetch fails we fall back to streaming
  // the same file directly. Done after mount so the big file never blocks first
  // paint nor ships to a phone.
  useEffect(() => {
    if (reduced) return;
    const v = videoRef.current;
    if (!v) return;
    const coarse = window.matchMedia("(max-width: 768px)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const useMobile = coarse || !!conn?.saveData;
    usesMobileSrcRef.current = useMobile;
    if (!useMobile) {
      v.src = DESKTOP_SRC;
      return;
    }
    let objUrl: string | null = null;
    let aborted = false;
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch(MOBILE_SRC, { signal: ctrl.signal });
        if (!res.ok || !res.body) throw new Error("fetch failed");
        const len = Number(res.headers.get("Content-Length")) || 0;
        const reader = res.body.getReader();
        const chunks: BlobPart[] = [];
        let received = 0;
        let lastPct = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            received += value.length;
            if (len) {
              const pct = received / len;
              if (pct - lastPct >= 0.02) {
                lastPct = pct;
                setLoadPct(pct);
              }
            }
          }
        }
        if (aborted) return;
        setLoadPct(1);
        objUrl = URL.createObjectURL(new Blob(chunks, { type: "video/mp4" }));
        v.src = objUrl;
      } catch {
        if (!aborted) v.src = MOBILE_SRC; // stream directly if the blob fetch fails
      }
    })();
    return () => {
      aborted = true;
      ctrl.abort();
      if (objUrl) URL.revokeObjectURL(objUrl);
    };
  }, [reduced]);

  // iOS/Safari refuses to render `currentTime` seeks (and largely ignores
  // `preload`) until the <video> has been activated by a play() call — which is
  // why a scroll-scrubbed film sits frozen on the poster on a phone. Activate it
  // muted (permitted inline) on `canplay`, and again on the first touch/pointer
  // gesture as a fallback for stricter setups (Low Power Mode), then pause so the
  // scroll loop owns playback. Idempotent via the `unlocked` flag.
  useEffect(() => {
    if (reduced) return;
    const v = videoRef.current;
    if (!v) return;
    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      const p = v.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          v.pause();
          unlocked = true;
        }).catch(() => {
          /* autoplay blocked — the gesture fallback will retry */
        });
      } else {
        try {
          v.pause();
        } catch {
          /* no-op */
        }
        unlocked = true;
      }
    };
    // Clear the loader as soon as the film has frames — driven by the media
    // events, NOT the rAF loop, so it never hangs if rAF is slow to start.
    const onReady = () => setMediaReady(true);
    v.addEventListener("canplay", unlock);
    v.addEventListener("loadeddata", onReady);
    v.addEventListener("canplay", onReady);
    window.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("pointerdown", unlock, { passive: true });
    return () => {
      v.removeEventListener("canplay", unlock);
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("canplay", onReady);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("pointerdown", unlock);
    };
  }, [reduced]);

  // Drive a single <video> from scroll position via rAF. Three things keep this
  // buttery: (1) a short keyframe interval, so seeks decode only a few frames;
  // (2) we throttle to ONE in-flight seek and ease toward the target with a
  // frame-rate-independent time-constant; (3) the progress bar is written straight
  // to the DOM — no per-frame React state.
  useEffect(() => {
    if (reduced || scrubBlocked) return;
    const v = videoRef.current;
    if (!v) return;
    let running = true;
    let shown = 0; // eased video time we are converging toward
    let last = 0; // previous rAF timestamp for dt easing (0 = uninitialised)

    // `requestVideoFrameCallback` fires when a seeked frame is actually painted —
    // a more accurate "seek done" signal than the `seeked` event. Use it when
    // present; the `seeked` listener + timeout below remain the fallback.
    const vrf = v as HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: () => void) => number;
    };
    const onSeeked = () => { seeking.current = false; };
    v.addEventListener("seeked", onSeeked);

    // Watchdog: if the film has data and the viewer has scrolled into it but the
    // frame never advances (e.g. iOS Low Power Mode blocking playback init), give
    // up on scrubbing and fall back to a tap-to-play video.
    let scrubProven = false;
    let stuckSince = 0;

    const tick = (now: number) => {
      if (!running) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      const track = trackRef.current;
      if (track) {
        const rect = track.getBoundingClientRect();
        const scrolled = Math.min(Math.max(-rect.top, 0), trackHeightPx);
        // Seconds of scroll (px ÷ px-per-sec). Past the film's length the extra
        // END_HOLD scroll keeps videoTarget pinned to the last frame, so the final
        // build holds on screen instead of scrolling away into the CTA.
        const scrollTime = scrolled / PX_PER_SEC;
        const videoTarget = Math.min(scrollTime, total);

        // Frame-rate-independent exponential easing — fast flicks glide and a
        // 120 Hz display behaves the same as 60 Hz.
        const k = 1 - Math.exp(-dt / EASE_TAU);
        shown += (videoTarget - shown) * k;
        if (Math.abs(videoTarget - shown) < 0.004) shown = videoTarget;

        // Drop a stuck seek whose `seeked` never fired, so we never deadlock.
        if (seeking.current && now - seekStartedAt.current > SEEK_TIMEOUT_MS) seeking.current = false;

        // One seek in flight at a time — prevents the seek backlog that stutters.
        if (!seeking.current && v.readyState >= 2 && Math.abs(v.currentTime - shown) > SEEK_EPS) {
          seeking.current = true;
          seekStartedAt.current = now;
          try {
            v.currentTime = Math.min(shown, total - 0.05);
            vrf.requestVideoFrameCallback?.(() => { seeking.current = false; });
          } catch { seeking.current = false; }
        }

        // Hide the loader the moment the film has frames to scrub. Setting the
        // same value is a no-op once ready (React bails on equal state).
        if (v.readyState >= 2) setMediaReady(true);

        // Watchdog: once the viewer has scrolled past ~1s of film, the frame must
        // start advancing. If it doesn't within 3s despite having data, scrubbing
        // is blocked (Low Power Mode etc.) → drop to the tap-to-play fallback.
        if (!scrubProven) {
          if (v.currentTime > 0.25) {
            scrubProven = true;
          } else if (videoTarget > 1 && v.readyState >= 2) {
            if (!stuckSince) stuckSince = now;
            else if (now - stuckSince > 3000) setScrubBlocked(true);
          } else {
            stuckSince = 0;
          }
        }

        // Progress = film progress (not scroll), so the bar fills exactly when the
        // film ends and holds at 100% through END_HOLD.
        if (progressRef.current) {
          progressRef.current.style.width = `${(total > 0 ? Math.min(shown / total, 1) : 0) * 100}%`;
        }

        // Header/orb state is synced to the DISPLAYED frame (`shown`), not the raw
        // scroll position — so each build's heading appears exactly when its footage
        // is on screen, and all 16 stay in lockstep. The generous trailing margin
        // holds the heading + buttons through the finished-piece reveal.
        let nearest = 0;
        let best = Infinity;
        for (let kk = 0; kk < marks.length; kk++) {
          const d = Math.abs(marks[kk].midTime - shown);
          if (d < best) { best = d; nearest = kk; }
        }
        const m = marks[nearest];
        // Uniform HEADER_SPAN window for every build so all 16 read for the same
        // length of time. The first build is pinned to the start of the scroll
        // (over the opening door footage) so its heading appears the instant you
        // begin; the last build's window runs past the film end into END_HOLD
        // (shown clamps at `total`), so the garage finishes assembling with its
        // heading still up.
        const within =
          nearest === 0
            ? shown >= OPENING_TITLE_S && shown <= OPENING_TITLE_S + HEADER_SPAN
            : Math.abs(shown - m.midTime) <= HEADER_SPAN / 2;
        setActiveRoom((prev) => (prev !== nearest ? nearest : prev));
        setInRoom((prev) => (prev !== within ? within : prev));
        setAtOpening((prev) => {
          const next = shown < OPENING_TITLE_S;
          return prev !== next ? next : prev;
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      v.removeEventListener("seeked", onSeeked);
    };
  }, [reduced, scrubBlocked, trackHeightPx, total, marks]);

  // Smoothly scroll the page so the film reaches a given global time.
  const scrollToTime = useCallback(
    (t: number) => {
      const track = trackRef.current;
      if (!track) return;
      const top = window.scrollY + track.getBoundingClientRect().top;
      snappingUntil.current = Date.now() + 700;
      window.scrollTo({ top: top + t * PX_PER_SEC, behavior: "smooth" });
    },
    [],
  );

  // Gentle snap: after scrolling stops, *click into place* only when we are
  // already essentially on a room — it never yanks the viewer across a travel
  // connector. Skipped entirely for touch/coarse pointers, where momentum
  // scrolling would make any snap feel like a fight.
  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onScroll = () => {
      if (snapTimer.current) window.clearTimeout(snapTimer.current);
      snapTimer.current = window.setTimeout(() => {
        if (Date.now() < snappingUntil.current) return;
        const track = trackRef.current;
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const scrolled = Math.min(Math.max(-rect.top, 0), trackHeightPx);
        if (scrolled <= 0 || scrolled >= trackHeightPx) return;
        const t = Math.min(scrolled / PX_PER_SEC, total);
        let nearest = marks[0];
        let best = Infinity;
        for (const mm of marks) {
          const d = Math.abs(mm.midTime - t);
          if (d < best) { best = d; nearest = mm; }
        }
        const dist = Math.abs(nearest.midTime - t);
        if (dist > 0.06 && dist < SNAP_MAX_DIST) scrollToTime(nearest.midTime);
      }, SNAP_IDLE_MS);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (snapTimer.current) window.clearTimeout(snapTimer.current);
    };
  }, [reduced, marks, total, trackHeightPx, scrollToTime]);

  // ---- Reduced motion OR scrubbing blocked: play the film with controls ----
  // Low Power Mode (and some locked-down setups) can stop iOS from initialising a
  // scroll-scrubbed video; rather than leave a frozen poster, the watchdog drops
  // here so the visitor gets a normal tap-to-play walkthrough instead.
  if (reduced || scrubBlocked) {
    const fallbackSrc = usesMobileSrcRef.current ? MOBILE_SRC : DESKTOP_SRC;
    return (
      <section className="px-6 py-[12vh]">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#CA8A04]">
            Cruz Carpentry · the tour
          </p>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.05] text-[#efe7da]">
            A walk through the work
          </h1>
          <p className="mt-3 text-sm text-[#b9ad9a]">
            {scrubBlocked
              ? "Tap play to watch the full walkthrough."
              : "The full walkthrough, at your own pace."}
          </p>
          <video
            className="mt-8 w-full rounded-2xl border border-[#2a241c]"
            src={fallbackSrc}
            poster={POSTER}
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
  const show = inRoom && !atOpening; // header visible within a room, hidden on travel

  return (
    <section aria-label="Cruz Carpentry video tour">
      <div ref={trackRef} style={{ height: `${trackHeightPx}px` }} className="relative">
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black">
          {/* single continuous film — scrubbed by scroll */}
          <video
            ref={videoRef}
            poster={POSTER}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            className="tour-kenburns absolute inset-0 h-full w-full object-cover [will-change:transform]"
          />

          {/* Loader over the poster until the film can scrub — most visible on a
              phone while the lean master downloads as a blob. Sits above the
              scrims/title (z-[25]) but below the nav so the brand stays put. */}
          {!mediaReady && (
            <div className="absolute inset-0 z-[25] flex flex-col items-center justify-center gap-4 bg-black/45">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/25 border-t-[#CA8A04]" />
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-white/70">
                {loadPct > 0 ? `Loading the tour · ${Math.round(loadPct * 100)}%` : "Loading the tour"}
              </p>
            </div>
          )}

          {/* always-on cinematic scrims: top keeps the nav legible over bright
              frames, bottom anchors the rail + copy, the inset vignette gives the
              whole stage depth and consistency frame-to-frame */}
          <div className="pointer-events-none absolute inset-0 z-[5]">
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/55 to-transparent" />
            <div className="absolute inset-0 [box-shadow:inset_0_0_180px_50px_rgba(0,0,0,0.45)]" />
          </div>

          {/* opening title — only over the opening segment */}
          <div
            className="pointer-events-none absolute inset-x-0 top-[16svh] z-10 px-6 text-center transition-opacity duration-700"
            style={{ opacity: atOpening ? 1 : 0 }}
          >
            <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#CA8A04] sm:text-xs">
              Cruz Carpentry · the tour
            </p>
            <h1 className="font-serif text-[clamp(2rem,6vw,4rem)] leading-[1.04] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]">
              A walk through the work
            </h1>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/70 sm:text-sm">
              scroll to begin
            </p>
          </div>

          {/* animated scroll cue — fades out with the opening title */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-[15svh] z-10 flex justify-center transition-opacity duration-700"
            style={{ opacity: atOpening ? 1 : 0 }}
          >
            <span className="flex h-9 w-[22px] justify-center rounded-full border border-white/50 pt-1.5">
              <span className="h-2 w-[2px] animate-bounce rounded-full bg-white/80" />
            </span>
          </div>

          {/* auto-revealing room header + details — fades in within a room,
              out during the travel connectors */}
          {room && (
            <div
              className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/45 to-transparent px-[clamp(1.25rem,7vw,5rem)] pb-[clamp(5.5rem,16svh,9rem)] pt-[10vh] transition-opacity duration-500 ease-out"
              style={{ opacity: show ? 1 : 0 }}
            >
              <motion.div
                key={activeRoom}
                initial="hidden"
                animate={show ? "show" : "hidden"}
                variants={REVEAL_GROUP}
              >
                <motion.div
                  variants={REVEAL_ITEM}
                  className="text-[0.72rem] uppercase tracking-[0.24em] text-[#CA8A04] sm:text-[0.8rem]"
                >
                  {room.num} · {room.zone}
                </motion.div>
                <motion.h2
                  variants={REVEAL_ITEM}
                  className="mt-2 font-serif text-[clamp(1.65rem,5.2vw,3rem)] leading-[1.08] text-[#efe7da] drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]"
                >
                  {room.title}
                </motion.h2>
                <motion.p
                  variants={REVEAL_ITEM}
                  className="mt-2 max-w-[44ch] text-sm leading-relaxed text-[#cabfae] sm:text-base"
                >
                  {room.caption}
                </motion.p>
                <motion.div variants={REVEAL_ITEM} className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      const slug = SLUG_BY_NUM[room.num];
                      if (slug) setOpen({ slug, label: `${room.num} · ${room.title}` });
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-[#B45309] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#92400E] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-7 sm:py-3.5 sm:text-base"
                  >
                    Explore this build &rarr;
                  </button>
                  <Link
                    href="/estimate"
                    className="inline-flex items-center gap-2 rounded-full border border-white/35 px-5 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-base"
                  >
                    Request an estimate
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          )}

          {/* orb timeline rail */}
          <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4 pt-10 sm:px-5 sm:pb-5">
            {/* current build label — always visible (hover tooltips don't exist on touch) */}
            {room && (
              <div
                className="mx-auto mb-3 max-w-5xl px-1 transition-opacity duration-300"
                style={{ opacity: atOpening ? 0 : 1 }}
              >
                <p className="truncate text-center text-[0.7rem] uppercase tracking-[0.2em] text-white/75 sm:text-left sm:text-xs">
                  <span className="text-[#CA8A04]">{room.num}</span> / {marks.length} · {room.title}
                </p>
              </div>
            )}
            <div className="relative mx-auto h-7 max-w-5xl sm:h-9">
              <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-white/20" />
              <div
                ref={progressRef}
                className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-[#CA8A04]"
                style={{ width: "0%" }}
              />
              {marks.map((m, i) => {
                const isActive = i === activeRoom;
                return (
                  <button
                    key={m.room.num}
                    type="button"
                    onClick={() => scrollToTime(m.midTime)}
                    aria-label={`Jump to ${m.room.title}`}
                    className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2 p-2 focus:outline-none"
                    style={{ left: `${m.fraction * 100}%` }}
                  >
                    {isActive && (
                      <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-[#CA8A04]/60" />
                    )}
                    <span
                      className={`relative block rounded-full ring-2 ring-black/30 transition-all ${
                        isActive
                          ? "h-3 w-3 bg-[#CA8A04] shadow-[0_0_12px_3px_rgba(202,138,4,0.8)] sm:h-3.5 sm:w-3.5"
                          : "h-2 w-2 bg-white/55 group-hover:bg-[#CA8A04] sm:h-2.5 sm:w-2.5"
                      }`}
                    />
                    <span className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-full border border-[#3a3024] bg-[#14100b]/95 px-2.5 py-1 text-[0.7rem] text-[#efe7da] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
                      {m.room.num} · {m.room.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ServiceDetailOverlay
        slug={open?.slug ?? null}
        label={open?.label}
        onClose={() => setOpen(null)}
      />
    </section>
  );
}
