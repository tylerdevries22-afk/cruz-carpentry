// Reusable trust row. Only safe, owner-verifiable claims — no fabricated review
// counts, project totals, or years in business.
const ITEMS = [
  "Built by Hand",
  "Licensed & Insured",
  "Free Estimates",
  "Colorado Front Range",
];

export function TrustStrip({
  className = "",
  tone = "light",
}: {
  className?: string;
  /** "light" = dark text on light bg; "dark" = light text on dark bg. */
  tone?: "light" | "dark";
}) {
  const text = tone === "dark" ? "text-white/70" : "text-[#57534E]";
  const dot = tone === "dark" ? "bg-white/30" : "bg-[#CA8A04]/60";

  return (
    <ul
      className={`flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[0.18em] ${text} ${className}`}
    >
      {ITEMS.map((item, i) => (
        <li key={item} className="flex items-center gap-5">
          {i > 0 ? (
            <span aria-hidden="true" className={`h-1 w-1 rounded-full ${dot}`} />
          ) : null}
          {item}
        </li>
      ))}
    </ul>
  );
}
