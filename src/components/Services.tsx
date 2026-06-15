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

const services = [
  {
    num: "01",
    title: "Custom Cabinetry — Kitchen & Bath",
    description:
      "Kitchen, bath, and pantry cabinetry built to endure — islands, vanities, and custom storage finished with the precision of a true craftsman.",
    Icon: CabinetIcon,
  },
  {
    num: "02",
    title: "Built-In Shelving & Entertainment Centers",
    description:
      "Floor-to-ceiling built-ins, floating shelves, and media walls designed around your room, your TV, and your home office.",
    Icon: BookshelfIcon,
  },
  {
    num: "03",
    title: "Staircases & Railings",
    description:
      "Custom stairs, newel posts, and railings — from hand-set iron balusters to modern cable rail and reclaimed-wood treads.",
    Icon: StairsIcon,
  },
  {
    num: "04",
    title: "Trim, Molding & Wainscoting",
    description:
      "Crown molding, baseboards, casings, wall paneling, and wainscoting that give a room its finished, architectural soul.",
    Icon: MoldingIcon,
  },
  {
    num: "05",
    title: "Custom Closets & Wardrobes",
    description:
      "Walk-in suites and reach-in systems with drawers, shelving, and hanging tailored to every inch of your space.",
    Icon: ClosetIcon,
  },
  {
    num: "06",
    title: "Mudrooms, Lockers & Benches",
    description:
      "Hardworking entryways — built-in lockers, cubbies, hooks, and storage benches that keep daily life in order.",
    Icon: LockerIcon,
  },
  {
    num: "07",
    title: "Exposed Beams & Wood Ceilings",
    description:
      "Beam wraps, coffered and plank ceilings, and range-hood surrounds that bring warmth and character overhead.",
    Icon: BeamIcon,
  },
  {
    num: "08",
    title: "Fireplace Mantels & Surrounds",
    description:
      "Timber mantels and custom surrounds that turn the fireplace into the natural heart of the room.",
    Icon: MantelIcon,
  },
  {
    num: "09",
    title: "Interior & Barn Doors",
    description:
      "Door hanging, crisp cased openings, and sliding barn doors that shape how your home flows together.",
    Icon: DoorIcon,
  },
  {
    num: "10",
    title: "Custom Woodwork & Specialty Builds",
    description:
      "Built-in bunk beds, window seats, feature walls, and one-off pieces — if you can dream it in wood, we can build it.",
    Icon: SquareIcon,
  },
];

// Scroll-driven card — every transform is tied live to scroll progress
function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 96%", "start 38%"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 48, damping: 20 });

  const xDir = index % 2 === 0 ? -38 : 38;
  const x = useTransform(smooth, [0, 1], [xDir, 0]);
  const y = useTransform(smooth, [0, 1], [42, 0]);
  const opacity = useTransform(smooth, [0, 0.6], [0, 1]);
  const scale = useTransform(smooth, [0, 1], [0.95, 1]);
  const blurVal = useTransform(smooth, [0, 0.7], [4, 0]);
  const blurFilter = useTransform(blurVal, (b) => `blur(${b}px)`);

  // Gold number clips in left-to-right
  const numClip = useTransform(smooth, [0, 0.75], [
    "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
    "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  ]);

  // Divider line draws in
  const lineScaleX = useTransform(smooth, [0.15, 0.85], [0, 1]);

  // Icon + content fade slightly behind card
  const contentOpacity = useTransform(smooth, [0.3, 0.8], [0, 1]);
  const contentY = useTransform(smooth, [0.3, 1], [16, 0]);

  if (reduced) {
    return (
      <div className="bg-white border border-[#E8DDD4] rounded-2xl p-8">
        <p className="text-[#CA8A04] font-serif italic text-4xl mb-4">{service.num}</p>
        <div className="w-10 h-10 mb-4 text-[#CA8A04]"><service.Icon /></div>
        <h3 className="font-serif text-xl text-[#1C1917] mb-3">{service.title}</h3>
        <p className="text-[#78716C] text-sm leading-relaxed font-light">{service.description}</p>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, y, opacity, scale, filter: blurFilter }}
      className="group relative bg-white border border-[#E8DDD4] rounded-2xl p-8
                 hover:shadow-2xl hover:border-[#CA8A04]/30 transition-[border-color,box-shadow]
                 duration-500 cursor-default overflow-hidden"
    >
      {/* Subtle wood texture on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700 pointer-events-none">
        <Image src="/wood/wood_texture.jpg" alt="" fill className="object-cover" />
      </div>

      {/* Number — clips in scroll-driven */}
      <motion.p
        className="font-serif italic text-[4rem] leading-none text-[#CA8A04] mb-2 select-none"
        style={{ clipPath: numClip }}
      >
        {service.num}
      </motion.p>

      {/* Divider line — draws in scroll-driven */}
      <motion.div
        className="h-px bg-[#E8DDD4] mb-6 origin-left"
        style={{ scaleX: lineScaleX }}
      />

      {/* Icon + content */}
      <motion.div style={{ opacity: contentOpacity, y: contentY }}>
        <div className="w-10 h-10 mb-5 text-[#CA8A04] group-hover:scale-110 transition-transform duration-300">
          <service.Icon />
        </div>
        <h3 className="font-serif text-[1.2rem] text-[#1C1917] mb-3 leading-snug">
          {service.title}
        </h3>
        <p className="text-[#78716C] text-[0.9375rem] leading-relaxed font-light">
          {service.description}
        </p>
      </motion.div>
    </motion.div>
  );
}

// Section header — scroll-driven
function SectionHeader({ sectionProgress }: { sectionProgress: ReturnType<typeof useSpring> }) {
  const y = useTransform(sectionProgress, [0, 0.3], [50, 0]);
  const opacity = useTransform(sectionProgress, [0, 0.25], [0, 1]);
  const labelClip = useTransform(sectionProgress, [0, 0.2],
    ["polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
     "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"]
  );

  return (
    <motion.div className="max-w-2xl mb-20" style={{ y, opacity }}>
      <motion.p
        className="text-[#CA8A04] text-xs font-semibold tracking-[0.25em] uppercase mb-5"
        style={{ clipPath: labelClip }}
      >
        What We Build
      </motion.p>
      <h2 className="font-serif text-5xl sm:text-6xl text-[#1C1917] leading-tight">
        Craftsmanship in
        <br />
        <em className="italic">every detail</em>
      </h2>
      <p className="text-[#78716C] text-lg font-light leading-relaxed mt-6">
        From a single fireplace mantel to a whole home of custom millwork — these
        are the things we shape in wood for homes across the Colorado Front Range.
      </p>
    </motion.div>
  );
}

export function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section ref={sectionRef} className="relative bg-[#FAF7F2] py-28 sm:py-36 px-6 overflow-hidden">

      {/* Parallax wood grain background */}
      <motion.div className="absolute inset-x-0 inset-y-[-10%] h-[120%] pointer-events-none"
        style={{ y: bgY, opacity: bgOpacity }}
      >
        <Image src="/wood/wood_grain.jpg" alt="" fill className="object-cover" />
      </motion.div>

      {/* Decorative ghost text */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 text-[18rem] font-serif italic
                   text-[#1C1917]/[0.025] leading-none select-none pointer-events-none"
        style={{ y: decoY }}
      >
        craft
      </motion.div>

      <div className="relative max-w-7xl mx-auto">
        <SectionHeader sectionProgress={sectionSmooth} />

        <motion.div style={{ y: gridY }}>
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
