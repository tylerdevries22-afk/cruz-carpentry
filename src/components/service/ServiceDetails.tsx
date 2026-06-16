import { Reveal } from "@/components/ui/Reveal";
import { REVEAL_STAGGER } from "@/lib/constants";
import type { Service } from "@/lib/services";

export function ServiceDetails({ service }: { service: Service }) {
  return (
    <section className="bg-[#FAF7F2] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">
            The Details
          </p>
          <h2 className="max-w-2xl font-serif text-4xl leading-tight text-[#1C1917] sm:text-5xl">
            Where the <em className="italic">craftsmanship</em> shows
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {service.details.map((detail, i) => (
            <Reveal key={detail.title} delay={Math.min(i, 5) * REVEAL_STAGGER}>
              <div className="h-full rounded-2xl border border-[#E8DDD4] bg-white p-8">
                <div className="mb-6 h-10 w-10 text-[#B45309]">
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M24 4 L29 19 L44 24 L29 29 L24 44 L19 29 L4 24 L19 19 Z" />
                  </svg>
                </div>
                <h3 className="mb-3 font-serif text-xl leading-snug text-[#1C1917]">
                  {detail.title}
                </h3>
                <p className="text-[0.9375rem] font-light leading-relaxed text-[#57534E]">
                  {detail.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
