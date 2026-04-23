import { PHONE, PHONE_HREF } from "@/lib/constants";

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
          <p className="text-white/35 text-xs tracking-[0.2em] uppercase font-light">
            Custom Millwork · Colorado Front Range
          </p>
        </div>

        {/* CTA */}
        <a
          href={PHONE_HREF}
          className="inline-flex items-center gap-2.5 border border-[#CA8A04]/40 hover:border-[#CA8A04]
                     text-[#CA8A04] hover:bg-[#CA8A04]/10 px-6 py-3 rounded-full text-sm font-medium
                     transition-all duration-200 cursor-pointer whitespace-nowrap"
        >
          <PhoneIcon />
          {PHONE}
        </a>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs font-light">
            &copy; {year} Cruz Carpentry. All rights reserved.
          </p>
          <p className="text-white/20 text-xs font-light">
            Licensed &amp; Insured · Colorado
          </p>
        </div>
      </div>
    </footer>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.08 6.08l1.91-1.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
