"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { EASE } from "@/lib/constants";

const services = [
  {
    num: "01",
    title: "Custom Cabinetry — Kitchen & Bath",
    description:
      "Kitchen, bath, and pantry cabinetry built to endure — islands, vanities, and custom storage finished with the precision of a true craftsman.",
    image: "/gallery/cruz-34.webp",
    Icon: CabinetIcon,
  },
  {
    num: "02",
    title: "Built-In Shelving & Entertainment Centers",
    description:
      "Floor-to-ceiling built-ins, floating shelves, and media walls designed around your room, your TV, and your home office.",
    image: "/gallery/cruz-10.webp",
    Icon: BookshelfIcon,
  },
  {
    num: "03",
    title: "Staircases & Railings",
    description:
      "Custom stairs, newel posts, and railings — from hand-set iron balusters to modern cable rail and reclaimed-wood treads.",
    image: "/gallery/cruz-30.webp",
    Icon: StairsIcon,
  },
  {
    num: "04",
    title: "Trim, Molding & Wainscoting",
    description:
      "Crown molding, baseboards, casings, wall paneling, and wainscoting that give a room its finished, architectural soul.",
    image: "/gallery/cruz-37.webp",
    Icon: MoldingIcon,
  },
  {
    num: "05",
    title: "Custom Closets & Wardrobes",
    description:
      "Walk-in suites and reach-in systems with drawers, shelving, and hanging tailored to every inch of your space.",
    image: "/gallery/cruz-29.webp",
    Icon: ClosetIcon,
  },
  {
    num: "06",
    title: "Mudrooms, Lockers & Benches",
    description:
      "Hardworking entryways — built-in lockers, cubbies, hooks, and storage benches that keep daily life in order.",
    image: "/gallery/cruz-17.webp",
    Icon: LockerIcon,
  },
  {
    num: "07",
    title: "Exposed Beams & Wood Ceilings",
    description:
      "Beam wraps, coffered and plank ceilings, and range-hood surrounds that bring warmth and character overhead.",
    image: "/gallery/cruz-35.webp",
    Icon: BeamIcon,
  },
  {
    num: "08",
    title: "Fireplace Mantels & Surrounds",
    description:
      "Timber mantels and custom surrounds that turn the fireplace into the natural heart of the room.",
    image: "/gallery/cruz-40.webp",
    Icon: MantelIcon,
  },
  {
    num: "09",
    title: "Interior & Barn Doors",
    description:
      "Door hanging, crisp cased openings, and sliding barn doors that shape how your home flows together.",
    image: "/gallery/cruz-20.webp",
    Icon: DoorIcon,
  },
  {
    num: "10",
    title: "Custom Woodwork & Specialty Builds",
    description:
      "Built-in bunk beds, window seats, feature walls, and one-off pieces — if you can dream it in wood, we can build it.",
    image: "/gallery/cruz-25.webp",
    Icon: SquareIcon,
  },
  {
    num: "11",
    title: "Custom Cedar Saunas",
    description:
      "Cedar saunas built for your space — tiered benches, tight tongue-and-groove paneling, and heater surrounds crafted to take the heat and last for years.",
    image: "/images/sauna.webp",
    Icon: SaunaIcon,
  },
];

// One-shot in-view reveal (a single IntersectionObserver per card, not a live
// scroll listener) — far cheaper than per-card useScroll, and disabled for
// reduced-motion users.
function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const reduced = useReducedMotion();
  const imageSizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px";

  const reveal = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 32, x: index % 2 === 0 ? -24 : 24 },
        whileInView: { opacity: 1, y: 0, x: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.6, ease: EASE, delay: (index % 2) * 0.05 },
      };

  return (
    <motion.div
      {...reveal}
      className="group relative bg-white border border-[#E8DDD4] rounded-2xl overflow-hidden
                 hover:shadow-2xl hover:border-[#CA8A04]/30 transition-[border-color,box-shadow]
                 duration-500"
    >
      {/* Representative project photo */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes={imageSizes}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 bg-[#B45309] text-white text-[0.7rem] font-semibold tracking-wider px-2.5 py-1 rounded-full">
          {service.num}
        </span>
      </div>

      {/* Content */}
      <div className="p-7 sm:p-8">
        <div className="h-px bg-[#E8DDD4] mb-6" />
        <div className="w-10 h-10 mb-5 text-[#B45309] group-hover:scale-110 transition-transform duration-300">
          <service.Icon />
        </div>
        <h3 className="font-serif text-[1.2rem] text-[#1C1917] mb-3 leading-snug">
          {service.title}
        </h3>
        <p className="text-[#57534E] text-[0.9375rem] leading-relaxed font-light">
          {service.description}
        </p>
      </div>
    </motion.div>
  );
}

// Section header — scroll-driven, static under reduced motion
function SectionHeader({
  sectionProgress,
  reduced,
}: {
  sectionProgress: ReturnType<typeof useSpring>;
  reduced: boolean;
}) {
  const y = useTransform(sectionProgress, [0, 0.3], [50, 0]);
  const opacity = useTransform(sectionProgress, [0, 0.25], [0, 1]);
  const labelClip = useTransform(sectionProgress, [0, 0.2],
    ["polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
     "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"]
  );

  return (
    <motion.div className="max-w-2xl mb-20" style={reduced ? undefined : { y, opacity }}>
      <motion.p
        className="text-[#B45309] text-xs font-semibold tracking-[0.25em] uppercase mb-5"
        style={reduced ? undefined : { clipPath: labelClip }}
      >
        What We Build
      </motion.p>
      <h2 className="font-serif text-5xl sm:text-6xl text-[#1C1917] leading-tight">
        Craftsmanship in
        <br />
        <em className="italic">every detail</em>
      </h2>
      <p className="text-[#57534E] text-lg font-light leading-relaxed mt-6">
        From a single fireplace mantel to a whole home of custom millwork — these
        are the things we shape in wood for homes across the Colorado Front Range.
      </p>
    </motion.div>
  );
}

export function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  // Background parallax + header drive
  const { scrollYProgress: sectionScroll } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const sectionSmooth = useSpring(sectionScroll, { stiffness: 50, damping: 20 });

  const bgY = useTransform(sectionSmooth, [0, 1], ["-10%", "10%"]);
  const bgOpacity = useTransform(sectionSmooth, [0, 0.15, 0.85, 1], [0, 0.055, 0.055, 0]);

  // Decorative large background number (parallaxes at different speed)
  const decoY = useTransform(sectionSmooth, [0, 1], ["-20%", "20%"]);

  // Continuous drift — cards keep moving as you scroll through the section
  const gridY = useTransform(sectionSmooth, [0, 1], ["4%", "-4%"]);

  return (
    <section id="services" ref={sectionRef} className="relative bg-[#FAF7F2] py-28 sm:py-36 px-6 overflow-hidden">

      {/* Parallax wood grain background */}
      <motion.div className="absolute inset-x-0 inset-y-[-10%] h-[120%] pointer-events-none"
        style={{ y: reduced ? 0 : bgY, opacity: reduced ? 0.04 : bgOpacity }}
      >
        <Image src="/wood/wood_grain.jpg" alt="" fill className="object-cover" sizes="100vw" />
      </motion.div>

      {/* Decorative ghost text */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 text-[18rem] font-serif italic
                   text-[#1C1917]/[0.025] leading-none select-none pointer-events-none"
        style={{ y: reduced ? 0 : decoY }}
      >
        craft
      </motion.div>

      <div className="relative max-w-7xl mx-auto">
        <SectionHeader sectionProgress={sectionSmooth} reduced={reduced} />

        <motion.div style={{ y: reduced ? 0 : gridY }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
            {services.map((service, i) => (
              <ServiceCard key={service.num} service={service} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Icons ─── */
function BookshelfIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="36" height="40" rx="2" />
      <line x1="6" y1="18" x2="42" y2="18" />
      <line x1="6" y1="30" x2="42" y2="30" />
      <rect x="10" y="33" width="8" height="7" rx="1" />
      <rect x="20" y="33" width="8" height="7" rx="1" />
      <rect x="10" y="21" width="11" height="7" rx="1" />
      <rect x="27" y="21" width="11" height="7" rx="1" />
      <rect x="10" y="8" width="5" height="8" rx="1" />
      <rect x="17" y="10" width="4" height="6" rx="1" />
      <rect x="23" y="7" width="15" height="9" rx="1" />
    </svg>
  );
}
function ClosetIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="40" height="40" rx="2" />
      <line x1="24" y1="4" x2="24" y2="44" />
      <line x1="8" y1="14" x2="20" y2="14" />
      <line x1="28" y1="14" x2="40" y2="14" />
      <circle cx="19.5" cy="24" r="1.75" fill="currentColor" stroke="none" />
      <circle cx="28.5" cy="24" r="1.75" fill="currentColor" stroke="none" />
      <line x1="8" y1="34" x2="20" y2="34" />
      <line x1="28" y1="34" x2="40" y2="34" />
    </svg>
  );
}
function CabinetIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="40" height="18" rx="2" />
      <rect x="4" y="26" width="40" height="18" rx="2" />
      <line x1="24" y1="4" x2="24" y2="22" />
      <line x1="24" y1="26" x2="24" y2="44" />
      <circle cx="19" cy="13" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="29" cy="13" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="19" cy="35" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="29" cy="35" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function StairsIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="5,43 5,35 16,35 16,27 27,27 27,19 38,19 38,11 44,11" />
      <line x1="9" y1="40" x2="44" y2="7" />
      <line x1="18" y1="35" x2="22" y2="30" />
      <line x1="29" y1="27" x2="33" y2="22" />
    </svg>
  );
}
function MoldingIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12 H42 V42" />
      <path d="M6 20 H35 V42" />
      <path d="M6 28 H28 V42" />
    </svg>
  );
}
function LockerIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="15" height="27" rx="1.5" />
      <rect x="27" y="6" width="15" height="27" rx="1.5" />
      <line x1="11" y1="13" x2="16" y2="13" />
      <line x1="32" y1="13" x2="37" y2="13" />
      <line x1="6" y1="40" x2="42" y2="40" />
      <line x1="10" y1="40" x2="10" y2="44" />
      <line x1="38" y1="40" x2="38" y2="44" />
    </svg>
  );
}
function BeamIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="7" width="38" height="34" rx="1.5" />
      <line x1="16" y1="7" x2="16" y2="41" />
      <line x1="24" y1="7" x2="24" y2="41" />
      <line x1="32" y1="7" x2="32" y2="41" />
    </svg>
  );
}
function MantelIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="15" x2="44" y2="15" />
      <path d="M9 15 V42 H39 V15" />
      <rect x="16" y="24" width="16" height="18" rx="1" />
    </svg>
  );
}
function DoorIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="9" x2="43" y2="9" />
      <rect x="11" y="11" width="26" height="33" rx="1" />
      <line x1="24" y1="11" x2="24" y2="44" />
      <line x1="11" y1="22" x2="37" y2="22" />
      <circle cx="31" cy="30" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function SquareIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 6 V42 H44" />
      <path d="M11 6 V13 H37" />
      <line x1="18" y1="42" x2="18" y2="37" />
      <line x1="25" y1="42" x2="25" y2="37" />
      <line x1="32" y1="42" x2="32" y2="37" />
    </svg>
  );
}
function SaunaIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      {/* steam */}
      <path d="M17 6c2 2.5 2 4.5 0 7s-2 4.5 0 7" />
      <path d="M24 5c2 2.5 2 4.5 0 7s-2 4.5 0 7" />
      <path d="M31 6c2 2.5 2 4.5 0 7s-2 4.5 0 7" />
      {/* tiered bench */}
      <path d="M8 30 H40" />
      <line x1="12" y1="30" x2="12" y2="36" />
      <line x1="36" y1="30" x2="36" y2="36" />
      <path d="M8 38 H30" />
      <line x1="12" y1="38" x2="12" y2="42" />
      <line x1="26" y1="38" x2="26" y2="42" />
    </svg>
  );
}
