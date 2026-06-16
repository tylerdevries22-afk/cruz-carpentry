"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { PHONE, PHONE_HREF, EASE } from "@/lib/constants";
import { PhoneIcon } from "@/components/ui/PhoneIcon";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#FAF7F2]/90 backdrop-blur-md shadow-sm border-b border-[#E8DDD4]"
          : "bg-transparent"
      }`}
      initial={reduced ? false : { y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <nav
        className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo — links home (and back to top from any route) */}
        <Link
          href="/#top"
          aria-label="Cruz Carpentry — back to home"
          className={`text-2xl tracking-tight transition-colors duration-300 select-none rounded-sm
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            scrolled
              ? "text-[#1C1917] focus-visible:ring-[#B45309] focus-visible:ring-offset-[#FAF7F2]"
              : "text-white focus-visible:ring-white focus-visible:ring-offset-transparent"
          }`}
        >
          <span className="font-serif italic">Cruz</span>
          <span className="font-serif font-medium"> Carpentry</span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-4 sm:gap-5">
          <a
            href={PHONE_HREF}
            className={`hidden sm:flex items-center gap-2 text-sm transition-colors duration-300 cursor-pointer rounded-sm
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              scrolled
                ? "text-[#57534E] hover:text-[#1C1917] focus-visible:ring-[#B45309] focus-visible:ring-offset-[#FAF7F2]"
                : "text-white/80 hover:text-white focus-visible:ring-white focus-visible:ring-offset-transparent"
            }`}
          >
            <PhoneIcon className="w-3.5 h-3.5" />
            {PHONE}
          </a>
          <a
            href={PHONE_HREF}
            className="bg-[#B45309] hover:bg-[#92400E] text-white px-5 py-2 text-sm
                       font-medium rounded-full transition-colors duration-200 cursor-pointer
                       whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2"
          >
            Call Now
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
