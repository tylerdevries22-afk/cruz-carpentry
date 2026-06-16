"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { PHONE, PHONE_HREF, EASE } from "@/lib/constants";
import { PhoneIcon } from "@/components/ui/PhoneIcon";
import { MobileMenu, type NavLinkItem } from "@/components/MobileMenu";

// Primary navigation. "What We Build" goes to the crawlable /services hub; the
// rest are root-relative anchors so they work from any page (home or a service
// detail page) — navigating home and scrolling to the section.
const NAV_LINKS: NavLinkItem[] = [
  { label: "What We Build", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Estimate", href: "/estimate" },
  { label: "Contact", href: "/contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Text-shadow keeps the transparent-state white text/icons legible over bright
  // hero-video frames (WCAG 1.4.3 / 1.4.11), removed once the nav goes solid.
  const overHero = !scrolled
    ? "[text-shadow:0_1px_4px_rgba(0,0,0,0.55)]"
    : "";

  return (
    <>
      {/* Skip link — first focusable element so keyboard/SR users can bypass the nav */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-[#1C1917] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to content
      </a>

      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#FAF7F2]/90 backdrop-blur-md shadow-sm border-b border-[#E8DDD4]"
            : "bg-gradient-to-b from-black/30 to-transparent"
        }`}
        initial={reduced ? false : { y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <nav
          className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/#top"
            aria-label="Cruz Carpentry — back to home"
            className={`text-2xl tracking-tight transition-colors duration-300 select-none rounded-sm
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              scrolled
                ? "text-[#1C1917] focus-visible:ring-[#B45309] focus-visible:ring-offset-[#FAF7F2]"
                : `text-white focus-visible:ring-white focus-visible:ring-offset-transparent ${overHero}`
            }`}
          >
            <span className="font-serif italic">Cruz</span>
            <span className="font-serif font-medium"> Carpentry</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7 lg:gap-9">
            <ul className="flex items-center gap-7 lg:gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm transition-colors duration-300 rounded-sm
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      scrolled
                        ? "text-[#57534E] hover:text-[#1C1917] focus-visible:ring-[#B45309] focus-visible:ring-offset-[#FAF7F2]"
                        : `text-white/85 hover:text-white focus-visible:ring-white focus-visible:ring-offset-transparent ${overHero}`
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={PHONE_HREF}
              className="bg-[#B45309] hover:bg-[#92400E] active:bg-[#92400E] text-white px-5 py-2.5 text-sm
                         font-medium rounded-full transition-colors duration-200 cursor-pointer
                         whitespace-nowrap inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2"
            >
              <PhoneIcon className="w-3.5 h-3.5" />
              {PHONE}
            </a>
          </div>

          {/* Mobile actions — phone + hamburger (top right) */}
          <div className="flex md:hidden items-center gap-1">
            <a
              href={PHONE_HREF}
              aria-label={`Call ${PHONE}`}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                scrolled
                  ? "text-[#B45309] hover:bg-[#B45309]/10 focus-visible:ring-[#B45309] focus-visible:ring-offset-[#FAF7F2]"
                  : `text-white hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-transparent ${overHero}`
              }`}
            >
              <PhoneIcon className="w-5 h-5" />
            </a>
            <button
              ref={hamburgerRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={`flex h-11 w-11 items-center justify-center rounded-md transition-colors
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                scrolled
                  ? "text-[#1C1917] hover:bg-[#1C1917]/5 focus-visible:ring-[#B45309] focus-visible:ring-offset-[#FAF7F2]"
                  : `text-white hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-transparent ${overHero}`
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-6 h-6" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={NAV_LINKS}
        triggerRef={hamburgerRef}
      />
    </>
  );
}
