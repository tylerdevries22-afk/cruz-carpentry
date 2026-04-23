"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PHONE, PHONE_HREF, EASE } from "@/lib/constants";
import { PhoneIcon } from "@/components/ui/PhoneIcon";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

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
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <nav
        className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div
          className={`text-2xl tracking-tight transition-colors duration-300 select-none ${
            scrolled ? "text-[#1C1917]" : "text-white"
          }`}
        >
          <span className="font-serif italic">Cruz</span>
          <span className="font-serif font-medium"> Carpentry</span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4 sm:gap-5">
          <a
            href={PHONE_HREF}
            className={`hidden sm:flex items-center gap-2 text-sm transition-colors duration-300 cursor-pointer ${
              scrolled
                ? "text-[#78716C] hover:text-[#1C1917]"
                : "text-white/75 hover:text-white"
            }`}
          >
            <PhoneIcon className="w-3.5 h-3.5" />
            {PHONE}
          </a>
          <a
            href={PHONE_HREF}
            className="bg-[#CA8A04] hover:bg-[#B45309] text-white px-5 py-2 text-sm
                       font-medium rounded-full transition-colors duration-200 cursor-pointer
                       whitespace-nowrap"
          >
            Call Now
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
