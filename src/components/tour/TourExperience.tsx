"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import type { TourRoom } from "@/lib/tour";

/** Glowing gold beacon placed on the built piece in each frame. */
function Hotspot({
  room,
  onOpen,
}: {
  room: TourRoom;
  onOpen: (room: TourRoom) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(room)}
      aria-label={`Watch ${room.title} come together`}
      className="group/hs absolute z-20 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
      style={{ left: `${room.hotspot.x}%`, top: `${room.hotspot.y}%` }}
    >
      <span className="tour-ping absolute h-4 w-4 rounded-full border-2 border-[#CA8A04]/70" />
      <span className="tour-ping tour-ping-2 absolute h-4 w-4 rounded-full border-2 border-[#CA8A04]/70" />
      <span
        className="relative h-[15px] w-[15px] rounded-full transition-transform duration-300 group-hover/hs:scale-125"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #ffd97a, #CA8A04 60%, #B45309)",
          boxShadow:
            "0 0 14px 3px rgba(202,138,4,.85), 0 0 30px 8px rgba(180,83,9,.35)",
        }}
      />
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#3a3024] bg-[#14100b]/95 px-2.5 py-1 text-[0.72rem] text-[#efe7da] opacity-0 transition-opacity group-hover/hs:opacity-100 group-focus-visible/hs:opacity-100">
        {room.title}
      </span>
    </button>
  );
}

function RoomFrame({
  room,
  priority,
  onOpen,
}: {
  room: TourRoom;
  priority: boolean;
  onOpen: (room: TourRoom) => void;
}) {
  return (
    <figure className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#2a241c] bg-[#0d0b08]">
      <Image
        src={`/tour-frames/${room.num}_est.webp`}
        alt={room.title}
        fill
        sizes="(min-width: 760px) 50vw, 100vw"
        className="object-cover"
        priority={priority}
      />
      {/* legibility gradient */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
      <Hotspot room={room} onOpen={onOpen} />
      <figcaption className="absolute bottom-4 left-5 z-10 drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)]">
        <div className="font-serif text-2xl leading-none text-[#CA8A04]">{room.num}</div>
        <div className="mt-1 font-serif text-lg text-[#efe7da]">{room.title}</div>
      </figcaption>
    </figure>
  );
}

/** Fullscreen stage: plays the assemble clip, then reveals caption + CTA. */
function Stage({
  room,
  reduced,
  onClose,
}: {
  room: TourRoom;
  reduced: boolean;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [showDetail, setShowDetail] = useState(reduced);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    const reveal = () => setShowDetail(true);
    v.currentTime = 0;
    v.play().catch(reveal); // autoplay blocked → still reveal details
    // safety net in case 'ended' never fires
    const t = window.setTimeout(reveal, 6500);
    v.addEventListener("ended", reveal);
    return () => {
      window.clearTimeout(t);
      v.removeEventListener("ended", reveal);
    };
  }, [reduced]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${room.title} — build detail`}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <video
        ref={videoRef}
        src={`/tour-clips/${room.num}.mp4`}
        poster={`/tour-frames/${room.num}_est.webp`}
        muted
        playsInline
        controls={reduced}
        preload="auto"
        className="h-full w-full object-cover"
      />

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/35 text-xl text-white transition-colors hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        &times;
      </button>

      <div
        className={`absolute inset-x-0 bottom-0 z-[5] bg-gradient-to-t from-black/90 via-black/55 to-transparent px-[8vw] pb-[6vh] pt-[7vh] transition-all duration-700 ${
          showDetail ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="text-[0.8rem] uppercase tracking-[0.24em] text-[#CA8A04]">
          {room.num} · {room.zone}
        </div>
        <h2 className="mt-2 font-serif text-3xl text-[#efe7da] sm:text-5xl">{room.title}</h2>
        <p className="mt-2 max-w-[42ch] leading-relaxed text-[#a89a86]">{room.caption}</p>
        <Link
          href={`/estimate`}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#B45309] px-7 py-3.5 font-semibold text-white transition-colors hover:bg-[#92400E] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Request an estimate &rarr;
        </Link>
      </div>
    </div>
  );
}

export function TourExperience({ rooms }: { rooms: TourRoom[] }) {
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState<TourRoom | null>(null);
  const open = useCallback((room: TourRoom) => setActive(room), []);
  const close = useCallback(() => setActive(null), []);

  return (
    <>
      <header className="px-6 pb-8 pt-[14vh] text-center sm:pt-[16vh]">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#CA8A04]">
          Cruz Carpentry · the tour
        </p>
        <h1 className="font-serif text-[clamp(2.4rem,6vw,4rem)] leading-[1.02] text-[#efe7da]">
          A walk through the work
        </h1>
        <p className="mx-auto mt-5 max-w-[48ch] font-light leading-relaxed text-[#a89a86]">
          Every room carries a glowing marker on the piece we built. Tap it — the
          build comes together full-screen, then the details.
        </p>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 pb-[16vh] sm:grid-cols-2">
        {rooms.map((room, i) => (
          <RoomFrame key={room.num} room={room} priority={i < 2} onOpen={open} />
        ))}
      </div>

      {active && <Stage room={active} reduced={reduced} onClose={close} />}
    </>
  );
}
