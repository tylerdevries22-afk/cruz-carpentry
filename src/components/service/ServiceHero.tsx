import Link from "next/link";
import { PHONE, PHONE_HREF } from "@/lib/constants";
import { PhoneIcon } from "@/components/ui/PhoneIcon";
import { ServiceGallery } from "@/components/service/ServiceGallery";
import { cardCarouselImages, type Service } from "@/lib/services";

const TRUST = ["Licensed & insured", "Free on-site estimate", "Colorado Front Range"];

/**
 * Gallery-led service hero. Leads with the category's AI design photos (an
 * Airbnb-style gallery), with the brand title, tagline, and a clean action row.
 * The H1 stays server-rendered (paint-time `.hero-rise`) so it's LCP-friendly.
 */
export function ServiceHero({ service }: { service: Service }) {
  const images = cardCarouselImages(service, 12);

  return (
    <section className="bg-[#FAF7F2] px-6 pt-24 sm:pt-28" aria-label={`${service.shortTitle} — overview`}>
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-xs tracking-wide text-[#8A7F73]">
            <li>
              <Link href="/" className="rounded-sm transition-colors hover:text-[#B45309] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#C2B6A6]">/</li>
            <li>
              <Link href="/services" className="rounded-sm transition-colors hover:text-[#B45309] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]">
                What We Build
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#C2B6A6]">/</li>
            <li aria-current="page" className="text-[#57534E]">{service.shortTitle}</li>
          </ol>
        </nav>

        {/* Title block + desktop actions */}
        <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-[#B45309] px-2.5 py-1 text-[0.7rem] font-semibold tracking-wider text-white">
                {service.num}
              </span>
              <span className="h-7 w-7 text-[#B45309]" aria-hidden="true">
                <service.Icon />
              </span>
            </div>
            <h1
              className="hero-rise font-serif leading-[0.98] tracking-[-0.02em] text-[#1C1917]"
              style={{ fontSize: "clamp(2.25rem, 5.5vw, 4.25rem)" }}
            >
              {service.title}
            </h1>
            <p className="mt-5 text-lg font-light leading-relaxed text-[#57534E]">
              {service.tagline}
            </p>
          </div>

          <div className="hidden shrink-0 gap-3 lg:flex lg:items-center">
            <a
              href={PHONE_HREF}
              className="inline-flex min-h-[44px] items-center justify-center gap-2.5 rounded-full bg-[#B45309] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#92400E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2"
            >
              <PhoneIcon className="h-4 w-4" />
              Call · {PHONE}
            </a>
            <a
              href="#estimate"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#D6CCBA] bg-white px-6 py-3 text-sm font-medium text-[#1C1917] transition-colors hover:bg-[#F5EEE2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2"
            >
              Request an Estimate
            </a>
          </div>
        </div>

        {/* AI design-photo gallery — shown first */}
        <div className="mt-8">
          <ServiceGallery images={images} title={service.shortTitle} />
        </div>

        {/* Mobile actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:hidden">
          <a
            href={PHONE_HREF}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2.5 rounded-full bg-[#B45309] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#92400E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2"
          >
            <PhoneIcon className="h-4 w-4" />
            Call for a Free Quote
          </a>
          <a
            href="#estimate"
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full border border-[#D6CCBA] bg-white px-6 py-3 text-sm font-medium text-[#1C1917] transition-colors hover:bg-[#F5EEE2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2"
          >
            Request an Estimate
          </a>
        </div>

        {/* Trust strip */}
        <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#E7DFD3] pt-5 text-sm text-[#57534E]">
          {TRUST.map((t) => (
            <li key={t} className="flex items-center gap-2">
              <svg className="h-4 w-4 text-[#B45309]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
