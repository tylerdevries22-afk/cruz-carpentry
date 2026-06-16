import { PHONE, PHONE_HREF } from "@/lib/constants";
import { PhoneIcon } from "@/components/ui/PhoneIcon";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1C1917] border-t border-white/5">
      {/* Brand bar */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        {/* Identity */}
        <div>
          <p className="font-serif text-3xl text-white mb-1">
            <em>Cruz</em> Carpentry
          </p>
          <p className="text-white/60 text-xs tracking-[0.2em] uppercase font-light">
            Custom Millwork · Colorado Front Range
          </p>
        </div>

        {/* CTA */}
        <a
          href={PHONE_HREF}
          className="inline-flex min-h-[44px] items-center gap-2.5 border border-[#CA8A04]/40 hover:border-[#CA8A04]
                     text-[#CA8A04] hover:bg-[#CA8A04]/10 active:bg-[#CA8A04]/10 px-6 py-3.5 rounded-full text-sm font-medium
                     transition-all duration-200 cursor-pointer whitespace-nowrap focus:outline-none
                     focus-visible:ring-2 focus-visible:ring-[#CA8A04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]"
        >
          <PhoneIcon className="w-3.5 h-3.5" />
          {PHONE}
        </a>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/55 text-xs font-light">
            &copy; {year} Cruz Carpentry. All rights reserved.
          </p>
          <p className="text-white/55 text-xs font-light">
            Licensed &amp; Insured · Colorado
          </p>
        </div>
      </div>
    </footer>
  );
}
