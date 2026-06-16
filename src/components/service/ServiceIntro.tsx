import { Reveal } from "@/components/ui/Reveal";
import type { Service } from "@/lib/services";

export function ServiceIntro({ service }: { service: Service }) {
  return (
    <section className="bg-[#FAF7F2] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">
            The Craft
          </p>
          <p className="font-serif text-2xl leading-relaxed text-[#1C1917] sm:text-[1.9rem] sm:leading-relaxed">
            {service.intro}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
