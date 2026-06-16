import Link from "next/link";

/**
 * "As featured on HGTV" credibility badge → links to the About page's HGTV
 * story (#hgtv). The wordmark is set typographically in the network's green;
 * if a licensed official-logo asset is ever provided, swap the <span>HGTV</span>
 * for a next/image of it here (one place).
 */
export function HgtvBadge({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/about#hgtv"
      aria-label="As featured on HGTV — read about the project"
      className={`group inline-flex items-center gap-2.5 rounded-full border border-[#E0D7C8] bg-white py-2 pl-4 pr-3 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-[#CA8A04]/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F0E8DC] ${className}`}
    >
      <span className="text-[0.5625rem] font-semibold uppercase leading-none tracking-[0.18em] text-[#A8A29E]">
        As featured on
      </span>
      <span className="font-sans text-lg font-extrabold leading-none tracking-tight text-[#4E9D2D]">
        HGTV
      </span>
      <svg
        className="h-3.5 w-3.5 text-[#B45309] transition-transform duration-300 group-hover:translate-x-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </Link>
  );
}
