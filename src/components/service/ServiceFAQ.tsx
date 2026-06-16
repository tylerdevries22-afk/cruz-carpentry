import { Reveal } from "@/components/ui/Reveal";
import type { Service } from "@/lib/services";

/**
 * Native <details> accordion — accessible and works with zero client JS.
 */
export function ServiceFAQ({ service }: { service: Service }) {
  return (
    <section className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">
            Common Questions
          </p>
          <h2 className="font-serif text-4xl leading-tight text-[#1C1917] sm:text-5xl">
            Good to <em className="italic">know</em>
          </h2>
        </Reveal>

        <Reveal>
          <div className="mt-12 border-y border-[#E8DDD4]">
            {service.faq.map((item) => (
              <details
                key={item.q}
                className="group border-b border-[#E8DDD4] last:border-b-0"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-serif text-lg text-[#1C1917] rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2 focus-visible:ring-offset-white [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="relative h-5 w-5 shrink-0 text-[#B45309] transition-transform duration-300 group-open:rotate-45"
                  >
                    <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 bg-current" />
                  </span>
                </summary>
                <p className="pb-5 text-[0.9375rem] font-light leading-relaxed text-[#57534E]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
