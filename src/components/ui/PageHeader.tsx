import type { ReactNode } from "react";

/**
 * Dark page header used by the content pages (/about, /contact, /faq,
 * /service-areas, /gallery). The dark background keeps the transparent fixed
 * nav legible on pages that don't open with a photographic hero.
 */
export function PageHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden bg-[#1C1917] px-6 pb-20 pt-36 text-center sm:pb-24 sm:pt-44">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_40%,rgba(202,138,4,0.10)_0%,transparent_70%)]" />
      <div className="relative mx-auto max-w-3xl">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#CA8A04]">
          {eyebrow}
        </p>
        <h1
          className="font-serif leading-[0.98] tracking-[-0.02em] text-white"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.25rem)" }}
        >
          {title}
        </h1>
        {sub ? (
          <p className="mx-auto mt-6 max-w-xl text-lg font-light leading-relaxed text-[#A8A29E]">
            {sub}
          </p>
        ) : null}
      </div>
    </header>
  );
}
