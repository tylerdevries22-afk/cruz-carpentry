import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Services } from "@/components/Services";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "What We Build",
  description:
    "Custom carpentry services across the Colorado Front Range — cabinetry, staircases, built-ins, trim, closets, mudrooms, beams, mantels, doors, saunas, and wine cellars.",
  alternates: { canonical: "/services" },
};

export default function ServicesIndexPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Dark header — gives the transparent nav a legible backdrop */}
        <header className="relative overflow-hidden bg-[#1C1917] px-6 pb-24 pt-36 text-center sm:pb-28 sm:pt-44">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_40%,rgba(202,138,4,0.10)_0%,transparent_70%)]" />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#CA8A04]">
              What We Build
            </p>
            <h1
              className="font-serif leading-[0.95] tracking-[-0.02em] text-white"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              Custom carpentry, <em className="italic">end to end</em>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg font-light leading-relaxed text-[#A8A29E]">
              From a single fireplace mantel to a whole home of millwork — explore
              the {SERVICES.length} things we shape in wood for homes across the
              Colorado Front Range.
            </p>
          </div>
        </header>

        <Services showHeader={false} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
