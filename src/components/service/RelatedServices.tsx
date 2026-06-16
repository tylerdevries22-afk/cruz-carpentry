import Link from "next/link";
import Image from "next/image";
import { SERVICES_ORDERED, type Service } from "@/lib/services";

/**
 * "More of what we build" — 4 sibling service cards at the bottom of each
 * detail page, for internal linking and to keep visitors in the catalog.
 * Walks the catalog in display order so "related" follows the grouped layout.
 */
export function RelatedServices({ current }: { current: Service }) {
  const idx = SERVICES_ORDERED.findIndex((s) => s.slug === current.slug);
  const related = [1, 2, 3, 4].map(
    (offset) => SERVICES_ORDERED[(idx + offset) % SERVICES_ORDERED.length],
  );

  return (
    <section className="bg-[#1C1917] px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#CA8A04]">
          More of What We Build
        </p>
        <h2 className="max-w-2xl font-serif text-3xl leading-tight text-white sm:text-4xl">
          Explore the rest of <em className="italic">the shop</em>
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CA8A04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                <Image
                  src={s.cardImage}
                  alt={s.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
              <h3 className="mt-3 font-serif text-lg text-white/90 transition-colors group-hover:text-[#CA8A04]">
                {s.shortTitle}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
