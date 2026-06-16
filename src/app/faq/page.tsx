import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { EstimateForm } from "@/components/EstimateForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/JsonLd";

const DESCRIPTION =
  "Answers to common questions about working with Cruz Carpentry — estimates, timelines, materials, service area, and how a custom carpentry project comes together.";

export const metadata: Metadata = {
  title: "FAQ",
  description: DESCRIPTION,
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ · Cruz Carpentry",
    description: DESCRIPTION,
    url: "/faq",
    type: "website",
  },
};

const FAQS = [
  {
    q: "Do you offer free estimates?",
    a: "Yes — every estimate is free and no-obligation. We come to you, take a look at the space, and talk through what you have in mind before anyone commits to anything.",
  },
  {
    q: "What areas do you serve?",
    a: "The Colorado Front Range — Denver, Boulder, Fort Collins, Loveland, Longmont, Greeley, Castle Rock, and the surrounding communities. If you're nearby, just ask.",
  },
  {
    q: "How does a project work, start to finish?",
    a: "Four steps: we consult on-site, design and select materials together so you approve every detail, build it by hand, then fit and finish it on-site so it looks like it was always part of the home.",
  },
  {
    q: "How long does a custom project take?",
    a: "It depends on the scope — a single mantel is quick, a whole kitchen or a home of millwork takes longer. We give you a realistic timeline once the design is set, and we keep you posted as we build.",
  },
  {
    q: "Painted or stained — which should I choose?",
    a: "Both hold up beautifully when they're done right. Painted finishes give you any color and a furniture-smooth surface; stained and oiled wood shows the grain and ages with character. We'll walk you through the trade-offs for your project.",
  },
  {
    q: "Do you handle countertops, plumbing, and electrical?",
    a: "We build and install the woodwork, and we coordinate closely with your countertop fabricator and licensed plumbers and electricians so everything lands flush, safe, and on schedule.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes — Cruz Carpentry is licensed and insured, and all work is built to local building code and inspected where required.",
  },
  {
    q: "Do you offer payment plans or financing?",
    a: "Ask us about payment options when we put your estimate together — we'll let you know what's available for your project.",
  },
  {
    q: "Can you match my existing cabinetry or trim?",
    a: "Yes. We match species, profile, and finish so a new island, built-in, or run of trim blends seamlessly with what's already there.",
  },
  {
    q: "How do I get started?",
    a: "Call us at (720) 280-0812 or request a free estimate online with a few details about your project, and we'll reach out to schedule a visit.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Nav />
      <main id="main" tabIndex={-1}>
        <PageHeader
          eyebrow="Questions & Answers"
          title={
            <>
              Good to <em className="italic">know</em>
            </>
          }
          sub="The questions we hear most often, before you ever pick up the phone."
        />

        <section className="bg-white px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <div className="border-y border-[#E8DDD4]">
                {FAQS.map((item) => (
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

        <EstimateForm />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
