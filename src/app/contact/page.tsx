import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { EstimateForm } from "@/components/EstimateForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { PhoneIcon } from "@/components/ui/PhoneIcon";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { buildBusinessNode, BUSINESS_ID } from "@/lib/jsonld";
import { PHONE, PHONE_HREF, SITE_URL } from "@/lib/constants";
import { SERVICE_CITIES } from "@/lib/locations";

const DESCRIPTION =
  "Get in touch with Cruz Carpentry for a free, no-obligation estimate on custom carpentry across the Colorado Front Range. Call (720) 280-0812 or request a quote online.";

export const metadata: Metadata = {
  title: "Contact",
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact · Cruz Carpentry",
    description: DESCRIPTION,
    url: "/contact",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      ...buildBusinessNode(),
      contactPoint: {
        "@type": "ContactPoint",
        telephone: PHONE_HREF.replace("tel:", ""),
        contactType: "sales",
        areaServed: "US-CO",
        availableLanguage: "English",
      },
    },
    {
      "@type": "ContactPage",
      name: "Contact Cruz Carpentry",
      url: `${SITE_URL}/contact`,
      about: { "@id": BUSINESS_ID },
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Nav />
      <main id="main" tabIndex={-1}>
        <PageHeader
          eyebrow="Contact"
          title={
            <>
              Let&apos;s talk about <em className="italic">your project</em>
            </>
          }
          sub="Free, no-obligation estimates across the Colorado Front Range. Call us, or send a few details and we'll reach out to schedule."
        />

        {/* Contact info band */}
        <section className="bg-[#FAF7F2] px-6 py-20 sm:py-24">
          <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-3">
            <Reveal>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">
                  Call
                </p>
                <a
                  href={PHONE_HREF}
                  className="inline-flex items-center gap-2 font-serif text-2xl text-[#1C1917] transition-colors hover:text-[#B45309] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F2] rounded-sm"
                >
                  <PhoneIcon className="h-5 w-5 text-[#B45309]" />
                  {PHONE}
                </a>
                <p className="mt-2 text-sm font-light text-[#57534E]">
                  Talk to us directly about your project.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">
                  Estimates
                </p>
                <p className="font-serif text-2xl text-[#1C1917]">By appointment</p>
                <p className="mt-2 text-sm font-light text-[#57534E]">
                  Free, no-obligation estimates. We&apos;ll come to you, measure, and
                  talk through what you have in mind.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">
                  Service Area
                </p>
                <p className="font-serif text-2xl text-[#1C1917]">
                  Colorado Front Range
                </p>
                <p className="mt-2 text-sm font-light text-[#57534E]">
                  {SERVICE_CITIES.slice(0, 6).join(", ")}, and surrounding
                  communities.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <EstimateForm />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
