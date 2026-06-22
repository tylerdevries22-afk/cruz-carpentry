"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Segmented switch between the two home experiences: the cinematic Tour (at `/`)
 * and the Classic home (at `/classic`). Shown in the nav (desktop) and the mobile
 * menu. `tone="light"` is for dark/transparent backgrounds (over the hero video,
 * inside the dark mobile drawer); `tone="dark"` is for the solid scrolled nav.
 */
export function HomeToggle({
  tone = "dark",
  size = "md",
  onNavigate,
  className = "",
}: {
  tone?: "light" | "dark";
  size?: "sm" | "md";
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const isTour = pathname === "/";
  const isClassic = pathname === "/classic";

  const wrap =
    tone === "light" ? "border-white/40 bg-white/10" : "border-[#E8DDD4] bg-[#FAF7F2]";
  const sizing = size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1 text-xs";
  const item = `rounded-full ${sizing} font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1`;
  const active = tone === "light" ? "bg-white text-[#1C1917]" : "bg-[#1C1917] text-white";
  const inactive =
    tone === "light"
      ? "text-white/85 hover:text-white focus-visible:ring-white focus-visible:ring-offset-transparent"
      : "text-[#57534E] hover:text-[#1C1917] focus-visible:ring-[#B45309] focus-visible:ring-offset-[#FAF7F2]";

  return (
    <div
      role="group"
      aria-label="Switch between the Tour and Classic home"
      className={`inline-flex items-center rounded-full border p-0.5 ${wrap} ${className}`}
    >
      <Link
        href="/"
        onClick={onNavigate}
        aria-current={isTour ? "page" : undefined}
        className={`${item} ${isTour ? active : inactive}`}
      >
        Tour
      </Link>
      <Link
        href="/classic"
        onClick={onNavigate}
        aria-current={isClassic ? "page" : undefined}
        className={`${item} ${isClassic ? active : inactive}`}
      >
        Classic
      </Link>
    </div>
  );
}
