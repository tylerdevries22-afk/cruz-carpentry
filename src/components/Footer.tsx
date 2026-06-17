import Link from "next/link";
import { PHONE, PHONE_HREF } from "@/lib/constants";
import { PhoneIcon } from "@/components/ui/PhoneIcon";
import { getResolvedServicesOrdered } from "@/lib/content/source";
import { SERVICE_CITIES } from "@/lib/locations";

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Our Process", href: "/#process" },
  { label: "Careers", href: "/careers" },
  { label: "FAQ", href: "/faq" },
  { label: "Service Areas", href: "/service-areas" },
  { label: "Contact", href: "/contact" },
];

const headingClass =
  "mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#CA8A04]";
const linkClass =
  "text-sm font-light text-white/65 transition-colors hover:text-white rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CA8A04]";

export async function Footer() {
  const year = new Date().getFullYear();
  const services = await getResolvedServicesOrdered();

  return (
    <footer className="bg-[#1C1917] border-t border-white/5">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 pt-16 pb-12 sm:grid-cols-2 lg:grid-cols-12">
        {/* Brand */}
        <div className="lg:col-span-4">
          <p className="mb-1 font-serif text-3xl text-white">
            <em>Cruz</em> Carpentry
          </p>
          <p className="mb-6 text-xs font-light uppercase tracking-[0.2em] text-white/60">
            Custom Millwork · Colorado Front Range
          </p>
          <a
            href={PHONE_HREF}
            className="inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-[#CA8A04]/40 px-6 py-3 text-sm font-medium text-[#CA8A04] transition-all hover:border-[#CA8A04] hover:bg-[#CA8A04]/10 active:bg-[#CA8A04]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CA8A04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]"
          >
            <PhoneIcon className="h-3.5 w-3.5" />
            {PHONE}
          </a>
          <p className="mt-6 text-xs font-light text-white/50">
            Licensed &amp; Insured · Free Estimates
          </p>
        </div>

        {/* What We Build */}
        <div className="lg:col-span-5">
          <p className={headingClass}>What We Build</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className={linkClass}>
                  {s.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="lg:col-span-3">
          <p className={headingClass}>Company</p>
          <ul className="space-y-2.5">
            {COMPANY_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className={`${headingClass} mt-8`}>Serving</p>
          <p className="text-xs font-light leading-relaxed text-white/50">
            {SERVICE_CITIES.slice(0, 8).join(" · ")} &amp; more
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row">
          <p className="text-xs font-light text-white/55">
            &copy; {year} Cruz Carpentry. All rights reserved.
          </p>
          <p className="text-xs font-light text-white/55">
            Licensed &amp; Insured · Colorado Front Range
          </p>
        </div>
      </div>
    </footer>
  );
}
