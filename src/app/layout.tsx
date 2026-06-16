import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const TITLE = "Cruz Carpentry — Built by Hand. Built to Last.";
const DESCRIPTION =
  "Custom carpentry & fine millwork for the Colorado Front Range — cabinetry, built-ins, staircases, trim, mantels & more. Licensed & insured. Call (720) 280-0812 for a free estimate.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · Cruz Carpentry" },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  keywords: [
    "custom carpentry",
    "finish carpentry",
    "custom cabinetry",
    "built-in shelving",
    "staircases and railings",
    "wainscoting",
    "fireplace mantels",
    "Colorado Front Range",
    "Denver carpenter",
    "millwork",
  ],
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Cruz Carpentry",
    title: TITLE,
    description:
      "Custom carpentry & fine millwork across the Colorado Front Range. Call for a free estimate.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "Custom carpentry & fine millwork across the Colorado Front Range.",
  },
};

export const viewport: Viewport = {
  themeColor: "#1C1917",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-scroll-behavior tells Next 16 the smooth-scroll is intentional (for
    // in-page anchor jumps) and to disable it during route transitions, so it
    // never fights the scroll-linked animations. See globals.css `html`.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bodoni.variable} ${jost.variable}`}
    >
      <body>
        {/* Prioritize the hero poster (LCP) so it paints before the video loads. */}
        <link
          rel="preload"
          as="image"
          href="/images/hero-poster.webp"
          type="image/webp"
          fetchPriority="high"
        />
        {children}
      </body>
    </html>
  );
}
