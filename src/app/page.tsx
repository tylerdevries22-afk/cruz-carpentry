import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { LandingPage } from "@/components/landing/LandingPage";
import { Services } from "@/components/Services";
import { Gallery } from "@/components/Gallery";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LandingPage />
        <Services />
        <Gallery />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
