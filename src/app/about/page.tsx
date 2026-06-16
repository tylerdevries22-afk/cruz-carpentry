import type { Metadata } from "next";
import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { EstimateForm } from "@/components/EstimateForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { TrustStrip } from "@/components/ui/TrustStrip";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceProcess } from "@/components/service/ServiceProcess";
import { REVEAL_STAGGER } from "@/lib/constants";

const DESCRIPTION =
  "Cruz Carpentry is a custom carpentry and fine-millwork shop serving the Colorado Front Range — built by hand, in solid wood, to last.";

export const metadata: Metadata = {
  title: "About",
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About · Cruz Carpentry",
    description: DESCRIPTION,
    url: "/about",
    type: "website",
  },
};

const VALUES = [
  {
    title: "Built by hand",
    body: "Every piece is drawn for your space and built by hand in solid wood — real joinery, not flat-pack parts. It's the difference you feel every time you open a drawer.",
  },
  {
    title: "Fit to the millimeter",
    body: "Walls are never truly square. We scribe, level, and shim so the finished line reads perfectly straight and the build looks like it was framed in with the house.",
  },
  {
    title: "Built to last",
    body: "We build the way good carpentry is supposed to age — tighter and more solid with use, not loose and creaky. The kind of work that outlasts the trends around it.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1}>
        <PageHeader
          eyebrow="About Cruz Carpentry"
          title={
            <>
              Built by hand, on the <em className="italic">Front Range</em>
            </>
          }
          sub="Custom carpentry and fine millwork for Colorado homes — the cabinetry, staircases, built-ins, and one-off pieces that make a house unmistakably yours."
        />

        {/* Story */}
        <section className="bg-[#FAF7F2] px-6 py-24 sm:py-32">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="/gallery/cruz-38.webp"
                  alt="A Cruz Carpentry craftsman at work on site"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div>
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">
                  Our Story
                </p>
                <h2 className="mb-6 font-serif text-3xl leading-tight text-[#1C1917] sm:text-4xl">
                  Carpentry the way it&apos;s <em className="italic">meant to be done</em>
                </h2>
                <div className="space-y-4 text-[#57534E] font-light leading-relaxed">
                  <p>
                    Cruz Carpentry is a custom carpentry and millwork shop serving
                    homes across the Colorado Front Range. We build the things that
                    make a house feel like it was made for the people in it —
                    kitchens and cabinetry, staircases and railings, built-ins,
                    beams, closets, saunas, and the one-off pieces no catalog has a
                    page for.
                  </p>
                  <p>
                    Every project starts the same way: on-site, listening to how you
                    live in the space, then drawing and building it by hand in solid
                    wood. No shortcuts hidden behind the finish — just honest joinery,
                    a careful fit, and work that&apos;s built to last.
                  </p>
                  <p>
                    From a single fireplace mantel to a whole home of millwork, the
                    goal never changes: craftsmanship you&apos;ll still be glad you
                    chose decades from now.
                  </p>
                </div>
                <TrustStrip className="mt-8 justify-start" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Values */}
        <section className="bg-[#F0E8DC] px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">
                What Sets Us Apart
              </p>
              <h2 className="max-w-2xl font-serif text-4xl leading-tight text-[#1C1917] sm:text-5xl">
                The details you <em className="italic">feel</em>
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={Math.min(i, 5) * REVEAL_STAGGER}>
                  <div className="h-full rounded-2xl border border-[#E8DDD4] bg-white p-8">
                    <h3 className="mb-3 font-serif text-xl leading-snug text-[#1C1917]">
                      {v.title}
                    </h3>
                    <p className="text-[0.9375rem] font-light leading-relaxed text-[#57534E]">
                      {v.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <ServiceProcess />
        <EstimateForm />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
