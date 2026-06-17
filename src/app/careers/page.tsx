import type { Metadata } from "next";
import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/ui/Reveal";
import { CareerApplication } from "@/components/careers/CareerApplication";
import { ROLES } from "@/lib/careers-schema";
import { getResolvedCopy } from "@/lib/content/source";
import { renderCopy } from "@/lib/content/render";

const IMG = "https://nkarcozbgtgtcqfhytrx.supabase.co/storage/v1/object/public/what-we-build/general/real-photos";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getResolvedCopy();
  const { seo } = copy.careers;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/careers" },
    openGraph: { title: seo.ogTitle, description: seo.description, url: "/careers", type: "website" },
  };
}

export default async function CareersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const defaultRole = role && (ROLES as readonly string[]).includes(role) ? role : "";

  const copy = await getResolvedCopy();
  const careers = copy.careers;

  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="bg-[#FAF7F2]">
        {/* Hero */}
        <section className="relative flex min-h-[78svh] items-center overflow-hidden">
          <Image src={`${IMG}/wood_grain_g2.jpg`} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_30%_50%,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.78)_100%)]" />
          <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-28 sm:py-36">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#E7B763]">{careers.hero.eyebrow}</p>
            <h1 className="max-w-3xl font-serif text-5xl leading-[1.02] tracking-[-0.02em] text-white sm:text-6xl md:text-7xl">
              {renderCopy(careers.hero.heading)}
            </h1>
            <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-white/80">
              {careers.hero.body}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#apply" className="inline-flex items-center gap-2 rounded-full bg-[#B45309] px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-black/30 transition-colors hover:bg-[#92400E] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40">
                {careers.hero.primaryCta}
              </a>
              <a href="#roles" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10">
                {careers.hero.secondaryCta}
              </a>
            </div>
          </div>
        </section>

        {/* Invitation */}
        <section className="px-6 py-20 sm:py-28">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">{careers.invitation.eyebrow}</p>
            <p className="font-serif text-3xl leading-snug text-[#1C1917] sm:text-4xl">
              {careers.invitation.body}
            </p>
          </Reveal>
        </section>

        {/* Craft & values */}
        <section className="bg-[#F5EEE2] px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mb-12 max-w-xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">{careers.craft.eyebrow}</p>
              <h2 className="font-serif text-4xl text-[#1C1917] sm:text-5xl">{careers.craft.heading}</h2>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {careers.values.map((v, i) => (
                <Reveal key={v.title} delay={Math.min(i, 3) * 0.08} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-[#E7DFD3] bg-white p-6">
                    <h3 className="font-serif text-xl text-[#1C1917]">{v.title}</h3>
                    <p className="mt-2.5 text-[0.95rem] font-light leading-relaxed text-[#57534E]">{v.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Life at the shop — photo band */}
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mb-10 max-w-xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">{careers.shop.eyebrow}</p>
              <h2 className="font-serif text-4xl text-[#1C1917] sm:text-5xl">{careers.shop.heading}</h2>
            </Reveal>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { src: "wood_measure_g2.jpg", cap: careers.photoCaptions[0] },
                { src: "wood_cut_g2.jpg", cap: careers.photoCaptions[1] },
                { src: "wood_sand_g2.jpg", cap: careers.photoCaptions[2] },
                { src: "wood_assemble_g2.jpg", cap: careers.photoCaptions[3] },
              ].map((p, i) => (
                <Reveal key={p.src} delay={Math.min(i, 3) * 0.07}>
                  <figure className="group relative aspect-[4/5] overflow-hidden rounded-2xl">
                    <Image src={`${IMG}/${p.src}`} alt={p.cap} fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-xs font-medium tracking-wide text-white">
                      {p.cap}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits & growth */}
        <section className="bg-[#1C1917] px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mb-12 max-w-xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#E7B763]">{careers.benefitsSection.eyebrow}</p>
              <h2 className="font-serif text-4xl text-white sm:text-5xl">{careers.benefitsSection.heading}</h2>
            </Reveal>
            <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {careers.benefits.map((b, i) => (
                <Reveal key={b.title} delay={Math.min(i, 5) * 0.06}>
                  <div className="border-l-2 border-[#B45309] pl-5">
                    <h3 className="font-serif text-xl text-white">{b.title}</h3>
                    <p className="mt-2 text-[0.95rem] font-light leading-relaxed text-white/65">{b.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Roles + general application */}
        <section id="roles" className="scroll-mt-24 px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal className="mb-10 max-w-xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">{careers.roles.eyebrow}</p>
              <h2 className="font-serif text-4xl text-[#1C1917] sm:text-5xl">{careers.roles.heading}</h2>
              <p className="mt-4 text-[0.95rem] font-light leading-relaxed text-[#57534E]">
                {careers.roles.body}
              </p>
            </Reveal>
            <div className="grid gap-3 sm:grid-cols-2">
              {ROLES.filter((r) => r !== "General / Not sure").map((r, i) => (
                <Reveal key={r} delay={Math.min(i, 6) * 0.05}>
                  <a
                    href={`/careers?role=${encodeURIComponent(r)}#apply`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-[#E7DFD3] bg-white p-5 transition-colors hover:border-[#CA8A04]/40 hover:shadow-md"
                  >
                    <span className="font-serif text-lg text-[#1C1917]">{r}</span>
                    <span className="text-sm font-medium text-[#B45309] transition-transform group-hover:translate-x-0.5">Apply →</span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Application form */}
        <section id="apply" className="scroll-mt-20 bg-[#F5EEE2] px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl">
            <Reveal className="mb-9 text-center">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">{careers.apply.eyebrow}</p>
              <h2 className="font-serif text-4xl text-[#1C1917] sm:text-5xl">{careers.apply.heading}</h2>
              <p className="mx-auto mt-4 max-w-md text-[0.95rem] font-light leading-relaxed text-[#57534E]">
                {careers.apply.body}
              </p>
            </Reveal>
            <CareerApplication defaultRole={defaultRole} />
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <Reveal className="mb-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">{careers.faqSection.eyebrow}</p>
              <h2 className="font-serif text-4xl text-[#1C1917] sm:text-5xl">{careers.faqSection.heading}</h2>
            </Reveal>
            <div className="divide-y divide-[#E7DFD3] border-y border-[#E7DFD3]">
              {careers.faq.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg text-[#1C1917] [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="shrink-0 text-[#B45309] transition-transform group-open:rotate-45" aria-hidden="true">＋</span>
                  </summary>
                  <p className="mt-3 text-[0.95rem] font-light leading-relaxed text-[#57534E]">{f.a}</p>
                </details>
              ))}
            </div>
            <p className="mt-10 text-center text-[0.95rem] font-light text-[#57534E]">
              {careers.closing}{" "}
              <a href="#apply" className="font-medium text-[#B45309] hover:underline">{careers.closingCta}</a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
