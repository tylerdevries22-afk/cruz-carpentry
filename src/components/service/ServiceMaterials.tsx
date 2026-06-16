import { Reveal } from "@/components/ui/Reveal";
import type { Service } from "@/lib/services";

export function ServiceMaterials({ service }: { service: Service }) {
  return (
    <section className="bg-[#1C1917] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#CA8A04]">
            Materials &amp; Joinery
          </p>
          <h2 className="max-w-2xl font-serif text-4xl leading-tight text-white sm:text-5xl">
            Built from the <em className="italic">right stuff</em>
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-[#A8A29E]">
            The materials and methods we reach for on a project like this.
          </p>
        </Reveal>

        <Reveal>
          <ul className="mt-12 grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {service.materials.map((item) => (
              <li key={item} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-px w-5 shrink-0 bg-[#CA8A04]"
                />
                <span className="text-[0.9375rem] font-light leading-relaxed text-[#D6CCBA]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
