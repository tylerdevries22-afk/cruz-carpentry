import Link from "next/link";
import { TrustStrip } from "@/components/ui/TrustStrip";

/**
 * Slim trust + CTA band immediately after the hero, so a decision-ready visitor
 * has a conversion path without scrolling the full page. Dark to flow out of the
 * hero video.
 */
export function ProofBand() {
  return (
    <section className="border-b border-white/5 bg-[#1C1917] px-6 py-7">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 sm:flex-row sm:justify-between">
        <TrustStrip tone="dark" className="justify-center sm:justify-start" />
        <Link
          href="/contact"
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-[#B45309] px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-[#92400E] active:bg-[#92400E] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]"
        >
          Get a Free Quote
        </Link>
      </div>
    </section>
  );
}
