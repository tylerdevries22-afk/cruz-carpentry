import { Reveal } from "@/components/ui/Reveal";

// Shared, honest 4-step process — no invented lead times or guarantees.
const STEPS = [
  {
    n: "01",
    title: "Consult",
    body: "We start on-site — listening to how you live in the space, taking careful measurements, and understanding what you want it to become.",
  },
  {
    n: "02",
    title: "Design",
    body: "We turn it into clear drawings and material selections, so you can see and sign off on every detail before a board is cut.",
  },
  {
    n: "03",
    title: "Build",
    body: "Each piece is crafted by hand with the joinery the job calls for — measured twice, built once, and checked at every step.",
  },
  {
    n: "04",
    title: "Install",
    body: "We fit, scribe, and finish on-site so the final result looks like it was always part of the home.",
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

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.05}>
              <div>
                <span className="font-serif text-2xl italic text-[#CA8A04]">
                  {step.n}
                </span>
                <div className="my-4 h-px w-10 bg-[#CA8A04]/50" />
                <h3 className="mb-3 font-serif text-xl text-[#1C1917]">
                  {step.title}
                </h3>
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
