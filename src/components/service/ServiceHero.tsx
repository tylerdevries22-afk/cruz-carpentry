import Image from "next/image";
import Link from "next/link";
import { PHONE, PHONE_HREF } from "@/lib/constants";
import { PhoneIcon } from "@/components/ui/PhoneIcon";
import type { Service } from "@/lib/services";

/**
 * Full-bleed detail-page hero. The H1 paints immediately with a paint-time CSS
 * rise (`.hero-rise`) so it isn't gated by JS hydration (LCP-friendly).
 */
export function ServiceHero({ service }: { service: Service }) {
  return (
    <section
      className="relative flex min-h-[78vh] flex-col justify-end overflow-hidden"
      aria-label={`${service.shortTitle} — overview`}
    >
      <Image
        src={service.heroImage}
        alt={service.title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Legibility gradients — darkness pooled bottom-left under the text and a
          gentle top wash for the nav, leaving the photo clear through the middle */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_75%_at_25%_92%,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0)_62%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40" />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="absolute inset-x-0 top-0 z-10 px-6 pt-24 sm:pt-28"
      >
        <ol className="mx-auto flex max-w-6xl items-center gap-2 text-xs tracking-wide text-white/75">
          <li>
            <Link
              href="/#top"
              className="rounded-sm transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-white/40">
            /
          </li>
          <li>
            <Link
              href="/#services"
              className="rounded-sm transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              What We Build
            </Link>
          </li>
          <li aria-hidden="true" className="text-white/40">
            /
          </li>
          <li aria-current="page" className="text-white/90">
            {service.shortTitle}
          </li>
        </ol>
      </nav>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-24">
        <span className="mb-5 inline-block rounded-full bg-[#B45309] px-3 py-1 text-[0.7rem] font-semibold tracking-wider text-white">
          {service.num}
        </span>
        <h1
          className="hero-rise max-w-3xl font-serif leading-[0.95] tracking-[-0.02em] text-white"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
        >
          {service.title}
        </h1>
        <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-white/85">
          {service.tagline}
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#B45309] px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-black/30 transition-colors duration-200 hover:bg-[#92400E] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
          >
            <PhoneIcon className="h-4 w-4" />
            Call for a Free Quote · {PHONE}
          </a>
          <a
            href="#estimate"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
          >
            Request an Estimate
          </a>
        </div>
      </div>
    </section>
  );
}
