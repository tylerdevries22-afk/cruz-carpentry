import type { ComponentType } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { REVEAL_STAGGER } from "@/lib/constants";

function ConsultIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 01-8.5 8.5 9.3 9.3 0 01-4-.9L3 20l1.9-5.5a8.38 8.38 0 01-.9-4A8.5 8.5 0 0112.5 2 8.38 8.38 0 0121 10.5z" strokeLinejoin="round" />
    </svg>
  );
}
function DesignIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
      <path d="M12 19l7-7 3 3-7 7-3-3z" strokeLinejoin="round" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" strokeLinejoin="round" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  );
}
function BuildIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinejoin="round" />
    </svg>
  );
}
function InstallIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
      <path d="M3 10.5L12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9.5V21h14V9.5" strokeLinejoin="round" />
      <path d="M9.5 14.5l2 2 3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Shared, honest 4-step process — no invented lead times or guarantees.
const STEPS: { n: string; title: string; body: string; Icon: ComponentType }[] = [
  {
    n: "01",
    title: "Consult",
    body: "We start on-site — listening to how you live in the space, taking careful measurements, and understanding what you want it to become.",
    Icon: ConsultIcon,
  },
  {
    n: "02",
    title: "Design",
    body: "We turn it into clear drawings and material selections, so you can see and sign off on every detail before a board is cut.",
    Icon: DesignIcon,
  },
  {
    n: "03",
    title: "Build",
    body: "Each piece is crafted by hand with the joinery the job calls for — measured twice, built once, and checked at every step.",
    Icon: BuildIcon,
  },
  {
    n: "04",
    title: "Install",
    body: "We fit, scribe, and finish on-site so the final result looks like it was always part of the home.",
    Icon: InstallIcon,
  },
];

export function ServiceProcess() {
  return (
    <section className="bg-[#F0E8DC] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">
            How We Work
          </p>
          <h2 className="max-w-2xl font-serif text-4xl leading-tight text-[#1C1917] sm:text-5xl">
            From first visit to <em className="italic">final fit</em>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={Math.min(i, 5) * REVEAL_STAGGER}>
              <div className="group h-full rounded-2xl border border-[#E2D6C4] bg-[#FAF7F2] p-7 transition-colors hover:border-[#CA8A04]/40">
                <div className="mb-5 flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#B45309]/10 text-[#B45309] transition-transform duration-300 group-hover:scale-110">
                    <span className="h-6 w-6">
                      <step.Icon />
                    </span>
                  </span>
                  <span className="font-serif text-2xl italic text-[#CA8A04]/70">{step.n}</span>
                </div>
                <h3 className="mb-2.5 font-serif text-xl text-[#1C1917]">{step.title}</h3>
                <p className="text-[0.9375rem] font-light leading-relaxed text-[#57534E]">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
