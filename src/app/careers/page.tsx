import type { Metadata } from "next";
import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/ui/Reveal";
import { CareerApplication } from "@/components/careers/CareerApplication";
import { ROLES } from "@/lib/careers-schema";

const IMG = "https://nkarcozbgtgtcqfhytrx.supabase.co/storage/v1/object/public/what-we-build/general/real-photos";

const DESCRIPTION =
  "Join the craft at Cruz Carpentry. We hire finish carpenters, cabinet makers, installers, and apprentices across the Colorado Front Range. Apply in a few minutes.";

export const metadata: Metadata = {
  title: "Careers — Join the Craft",
  description: DESCRIPTION,
  alternates: { canonical: "/careers" },
  openGraph: { title: "Careers · Cruz Carpentry", description: DESCRIPTION, url: "/careers", type: "website" },
};

// NOTE: roles, values, benefits, and FAQ copy below are intentionally honest and
// generic — owner should confirm/edit specifics (pay ranges, exact benefits)
// before treating them as commitments.
const VALUES = [
  { title: "Precision", body: "Reveals you can run a finger along. We sweat the joinery, the scribe, the last 1/32\"." },
  { title: "Ownership", body: "You sign your work. Everyone here is trusted to make the call and stand behind it." },
  { title: "Mentorship", body: "Apprentices learn from leads on real installs — not by watching from the corner." },
  { title: "Built to last", body: "We build pieces meant to outlive us. That standard shapes how we hire, too." },
];

const BENEFITS = [
  { title: "Pay for your skill", body: "Compensation that reflects experience — and we talk about it openly." },
  { title: "Paid time off", body: "Time to rest and recharge so the work stays sharp." },
  { title: "Tools & training", body: "Support for the gear and skills that make you better at the craft." },
  { title: "A real growth path", body: "Apprentice → finish carpenter → lead. Progression you can see." },
  { title: "Safety first", body: "A clean, organized shop and a culture that looks out for each other." },
  { title: "Work worth doing", body: "High-end custom millwork for homes across the Front Range." },
];

const FAQ = [
  { q: "Do I need formal experience?", a: "Not necessarily. We hire across levels — from apprentices with the right attitude to seasoned finish carpenters. Show us how you think about craft." },
  { q: "What should I upload?", a: "A resume is required; a cover letter is optional. Photos of work you're proud of help a lot — they tell us more than a resume can." },
  { q: "Where are you located?", a: "We serve the Colorado Front Range. Tell us your city and commute so we can plan around it." },
  { q: "Do you take apprentices?", a: "Yes. If you're early in the trade and serious about learning, choose “Apprentice” and tell us why." },
  { q: "What happens after I apply?", a: "A real person reads every application. If your craft looks like a fit, we'll reach out — usually within about a week." },
  { q: "Can I save and come back?", a: "Yes — the form saves your progress on this device, so you can finish later." },
];

export default async function CareersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const defaultRole = role && (ROLES as readonly string[]).includes(role) ? role : "";

  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="bg-[#FAF7F2]">
        {/* Hero */}
        <section className="relative flex min-h-[78svh] items-center overflow-hidden">
          <Image src={`${IMG}/wood_grain_g2.jpg`} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_30%_50%,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.78)_100%)]" />
          <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-28 sm:py-36">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#E7B763]">Careers · Cruz Carpentry</p>
            <h1 className="max-w-3xl font-serif text-5xl leading-[1.02] tracking-[-0.02em] text-white sm:text-6xl md:text-7xl">
              Build things that
              <br />
              <em className="italic">outlast us.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-white/80">
              We&apos;re a custom carpentry shop on the Colorado Front Range building heirloom-grade
              millwork. If you take pride in clean joinery and finished work you&apos;d sign your name to,
              we&apos;d like to meet you.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#apply" className="inline-flex items-center gap-2 rounded-full bg-[#B45309] px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-black/30 transition-colors hover:bg-[#92400E] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40">
                Apply now
              </a>
              <a href="#roles" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10">
                See roles we hire for
              </a>
            </div>
          </div>
        </section>

        {/* Invitation */}
        <section className="px-6 py-20 sm:py-28">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">The invitation</p>
            <p className="font-serif text-3xl leading-snug text-[#1C1917] sm:text-4xl">
              This isn&apos;t a production line. It&apos;s a small crew of people who care about the
              cut, the grain, and the joint nobody else will ever see.
            </p>
          </Reveal>
        </section>

        {/* Craft & values */}
        <section className="bg-[#F5EEE2] px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mb-12 max-w-xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">Our craft</p>
              <h2 className="font-serif text-4xl text-[#1C1917] sm:text-5xl">What we hire for</h2>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v, i) => (
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
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">In the shop</p>
              <h2 className="font-serif text-4xl text-[#1C1917] sm:text-5xl">The work you&apos;d be doing</h2>
            </Reveal>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { src: "wood_measure_g2.jpg", cap: "Measure twice" },
                { src: "wood_cut_g2.jpg", cap: "Clean cuts" },
                { src: "wood_sand_g2.jpg", cap: "Refine the surface" },
                { src: "wood_assemble_g2.jpg", cap: "Build to last" },
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
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#E7B763]">Why Cruz</p>
              <h2 className="font-serif text-4xl text-white sm:text-5xl">What you get</h2>
            </Reveal>
            <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map((b, i) => (
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
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">Open to</p>
              <h2 className="font-serif text-4xl text-[#1C1917] sm:text-5xl">Roles we hire for</h2>
              <p className="mt-4 text-[0.95rem] font-light leading-relaxed text-[#57534E]">
                Pick the closest fit and it&apos;ll be pre-selected on your application — or choose
                “General” if you&apos;re not sure. We read every one.
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
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">Apply</p>
              <h2 className="font-serif text-4xl text-[#1C1917] sm:text-5xl">Introduce yourself</h2>
              <p className="mx-auto mt-4 max-w-md text-[0.95rem] font-light leading-relaxed text-[#57534E]">
                Five quick steps — about three minutes. Your progress saves as you go.
              </p>
            </Reveal>
            <CareerApplication defaultRole={defaultRole} />
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <Reveal className="mb-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">Good to know</p>
              <h2 className="font-serif text-4xl text-[#1C1917] sm:text-5xl">Questions</h2>
            </Reveal>
            <div className="divide-y divide-[#E7DFD3] border-y border-[#E7DFD3]">
              {FAQ.map((f) => (
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
              A real person reads every application.{" "}
              <a href="#apply" className="font-medium text-[#B45309] hover:underline">Start yours →</a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
