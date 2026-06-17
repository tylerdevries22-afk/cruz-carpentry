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
import { getResolvedCopy } from "@/lib/content/source";
import { renderCopy } from "@/lib/content/render";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = (await getResolvedCopy()).about;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/about" },
    openGraph: {
      title: `${seo.title} · Cruz Carpentry`,
      description: seo.description,
      url: "/about",
      type: "website",
    },
  };
}

export default async function AboutPage() {
  const copy = (await getResolvedCopy()).about;
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1}>
        <PageHeader
          eyebrow={copy.header.eyebrow}
          title={renderCopy(copy.header.title)}
          sub={copy.header.sub}
        />

        {/* Story */}
        <section className="bg-[#FAF7F2] px-6 py-24 sm:py-32">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="https://nkarcozbgtgtcqfhytrx.supabase.co/storage/v1/object/public/what-we-build/general/real-photos/cruz-38.webp"
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
                  {copy.story.eyebrow}
                </p>
                <h2 className="mb-6 font-serif text-3xl leading-tight text-[#1C1917] sm:text-4xl">
                  {renderCopy(copy.story.heading)}
                </h2>
                <div className="space-y-4 text-[#57534E] font-light leading-relaxed">
                  {copy.story.paragraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                <TrustStrip className="mt-8 justify-start" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Featured on HGTV */}
        <section id="hgtv" className="scroll-mt-24 bg-[#1C1917] px-6 py-20 sm:py-28">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#CA8A04]">
              {copy.hgtv.eyebrow}
            </p>
            <p className="font-sans text-6xl font-extrabold leading-none tracking-tight text-[#5BB04A] sm:text-7xl">
              {copy.hgtv.brand}
            </p>
            <h2 className="mt-8 font-serif text-2xl leading-snug text-white sm:text-3xl">
              {renderCopy(copy.hgtv.heading)}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-white/70">
              {copy.hgtv.body}
            </p>
          </Reveal>
        </section>

        {/* Values */}
        <section className="bg-[#F0E8DC] px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">
                {copy.values.eyebrow}
              </p>
              <h2 className="max-w-2xl font-serif text-4xl leading-tight text-[#1C1917] sm:text-5xl">
                {renderCopy(copy.values.heading)}
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {copy.values.items.map((v, i) => (
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
