import { TrustStrip } from "@/components/ui/TrustStrip";
import { HgtvBadge } from "@/components/ui/HgtvBadge";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Credibility band — the "As featured on HGTV" badge over the trust signals.
 * Sits between the cinematic wood story and the Services grid as a calm light
 * bridge into the catalog (it was previously a dark trust+CTA band wedged
 * directly under the hero, stacking three dark sections in a row).
 */
export function ProofBand() {
  return (
    <section className="border-y border-[#E8DDD4] bg-[#F0E8DC] px-6 py-12 sm:py-14">
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <HgtvBadge />
        <TrustStrip className="justify-center" />
      </Reveal>
    </section>
  );
}
