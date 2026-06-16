import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { REVEAL_STAGGER } from "@/lib/constants";
import type { Service } from "@/lib/services";

/**
 * "Styles we build" — illustrative design examples for a service (AI-generated),
 * shown only when `service.showcase` is set. The heading + caption make clear
 * these are example styles, not photographed past projects.
 */
export function ServiceShowcase({ service }: { service: Service }) {
  if (!service.showcase || service.showcase.length === 0) return null;

  return (
    <section className="bg-[#F0E8DC] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">
            Styles We Build
          </p>
          <h2 className="max-w-2xl font-serif text-4xl leading-tight text-[#1C1917] sm:text-5xl">
            A range of <em className="italic">designs</em>
          </h2>
          <p className="mt-5 max-w-xl text-[0.9375rem] font-light leading-relaxed text-[#57534E]">
            Representative examples of the styles we build — yours is designed to
            your room, taste, and the way you live.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {service.showcase.map((item, i) => (
            <Reveal key={item.image} delay={(i % 4) * REVEAL_STAGGER}>
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#E5D9C9]">
                  <Image
                    src={item.image}
                    alt={item.caption}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-sm font-light text-[#57534E]">
                  {item.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
