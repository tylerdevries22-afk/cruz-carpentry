import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { TourFilm } from "@/components/tour/TourFilm";
import { TOUR_ROOMS } from "@/lib/tour";

const DESCRIPTION =
  "A cinematic walk through Cruz Carpentry's work — tap the glowing marker on each build and watch it come together, room by room, across the Colorado Front Range.";

export const metadata: Metadata = {
  title: "The Tour",
  description: DESCRIPTION,
  alternates: { canonical: "/tour" },
  openGraph: {
    title: "The Tour · Cruz Carpentry",
    description: DESCRIPTION,
    url: "/tour",
    type: "website",
  },
};

export default function TourPage() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="bg-[#16130f]">
        <TourFilm rooms={TOUR_ROOMS} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
