"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "@/app/actions/admin";

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">
      <path d="M22 12h-6l-2 3h-4l-2-3H2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" strokeLinejoin="round" />
    </svg>
  );
}
function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
  );
}
function SlidersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" aria-hidden="true">
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
      <path d="M1 14h6M9 8h6M17 16h6" />
    </svg>
  );
}

function HammerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round" aria-hidden="true">
      <path d="M14 6l5 5-3 3-5-5 3-3z" />
      <path d="M11 9L4 16a2 2 0 102.8 2.8L14 12" strokeLinecap="round" />
      <path d="M12.5 4.5l5 5 2-2-5-5-2 2z" />
    </svg>
  );
}

const NAV = [
  { href: "/admin", label: "Leads", Icon: InboxIcon },
  { href: "/admin/jobs", label: "Jobs", Icon: HammerIcon },
  { href: "/admin/applications", label: "Applications", Icon: BriefcaseIcon },
  { href: "/admin/rates", label: "Rate editor", Icon: SlidersIcon },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Admin">
      {NAV.map(({ href, label, Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] ${
              active ? "bg-[#B45309] text-white" : "text-[#57534E] hover:bg-[#F0E8DC]"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SignOut({ className }: { className?: string }) {
  return (
    <form action={adminLogout} className={className}>
      <button className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#57534E] transition-colors hover:bg-[#F0E8DC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]">
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Sign out
      </button>
    </form>
  );
}

const Brand = () => (
  <Link href="/admin" className="block px-3.5 py-1">
    <span className="font-serif text-xl text-[#1C1917]">
      <em className="italic">Cruz</em> Admin
    </span>
  </Link>
);

/**
 * App shell for the authed admin pages: a persistent left sidebar on desktop,
 * and a top bar with a hamburger → slide-in side drawer on mobile. Replaces the
 * old top pill links. (Not used on /admin/login.)
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Lock scroll + Esc-to-close while the drawer is open. (Navigating between
  // admin pages remounts this shell, so the drawer resets closed on its own.)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] lg:flex">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E7DFD3] bg-[#FAF7F2]/95 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-lg border border-[#D6CCBC] text-[#1C1917] transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-2 border-r border-[#E7DFD3] bg-white px-3 py-6 lg:flex">
        <div className="mb-4">
          <Brand />
        </div>
        <NavLinks pathname={pathname} />
        <div className="border-t border-[#F0E8DC] pt-2">
          <SignOut />
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[82vw] flex-col gap-2 bg-white px-3 py-5 shadow-2xl">
            <div className="mb-2 flex items-center justify-between">
              <Brand />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-lg text-[#57534E] hover:bg-[#F0E8DC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            <div className="border-t border-[#F0E8DC] pt-2">
              <SignOut />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main id="admin-main" className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:py-10">
        {children}
      </main>
    </div>
  );
}
