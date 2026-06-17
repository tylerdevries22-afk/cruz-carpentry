import Link from "next/link";
import Image from "next/image";
import { GALLERY_PHOTOS } from "@/components/gallery/photos";
import { Reveal } from "@/components/ui/Reveal";
import type { CopyTree } from "@/lib/content/copy";
import { renderCopy } from "@/lib/content/render";

// A curated set of strong, finished projects (1-based cruz-NN).
const FEATURED = [34, 32, 30, 41, 35, 40, 29, 24];

export function FeaturedWork({ content }: { content: CopyTree["home"]["featured"] }) {
  const photos = FEATURED.map((n) => GALLERY_PHOTOS[n - 1]).filter(Boolean);

  return (
    <section id="featured-work" className="bg-[#F0E8DC] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#B45309]">
                {content.eyebrow}
              </p>
              <h2 className="font-serif text-5xl leading-tight text-[#1C1917] sm:text-6xl">
                {renderCopy(content.heading)}
              </h2>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 self-start rounded-sm text-sm font-medium text-[#B45309] transition-colors hover:text-[#92400E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F0E8DC] sm:self-auto"
            >
              {content.viewAll}
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((p, i) => (
            // Real per-tile cascade (capped) instead of the prior i%4 column
            // delay, which was sub-perceptual and misordered the 2-col layout.
            <Reveal key={p.thumb} delay={Math.min(i, 7) * 0.07}>
              <Link
                href="/gallery"
                aria-label={`${p.alt} — view the full gallery`}
                className="group relative block aspect-square overflow-hidden rounded-lg bg-[#E5D9C9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F0E8DC]"
              >
                <Image
                  src={p.thumb}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
                {/* Opacity-faded solid overlay (GPU-composited) rather than an
                    animated background-color, and timed to match the zoom. */}
                <div className="absolute inset-0 bg-[#1C1917] opacity-0 transition-opacity duration-500 group-hover:opacity-20" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
