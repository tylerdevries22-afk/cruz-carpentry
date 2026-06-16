import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PhoneIcon } from "@/components/ui/PhoneIcon";
import { PHONE, PHONE_HREF } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main
        id="main"
        tabIndex={-1}
        className="flex min-h-[100svh] flex-col items-center justify-center bg-[#1C1917] px-6 py-32 text-center"
      >
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#CA8A04]">
          404 — Not Found
        </p>
        <h1 className="mb-5 font-serif text-4xl leading-tight text-white sm:text-5xl">
          This page got <em className="italic">away from us</em>
        </h1>
        <p className="mb-10 max-w-md text-lg font-light text-white/60">
          The page you&apos;re looking for doesn&apos;t exist or has moved — but
          we&apos;re still here to build what you have in mind.
        </p>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <a
            href={PHONE_HREF}
            className="inline-flex min-h-[44px] items-center justify-center gap-2.5 rounded-full bg-[#B45309] px-7 py-3.5 text-sm font-medium text-white shadow-lg transition-colors hover:bg-[#92400E] active:bg-[#92400E] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]"
          >
            <PhoneIcon className="h-4 w-4" />
            Call · {PHONE}
          </a>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10 active:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]"
          >
            Back home
          </Link>
          <Link
            href="/services"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10 active:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]"
          >
            See what we build
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
