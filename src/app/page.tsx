import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { LandingPage } from "@/components/landing/LandingPage";
import { Services } from "@/components/Services";
import { Gallery } from "@/components/gallery/Gallery";
import { EstimateForm } from "@/components/EstimateForm";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

// Revalidate the page (and its Supabase-backed gallery) at most once a minute,
// so the marketing site is served as cached HTML between refreshes.
export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LandingPage />
        <Services />
        <Gallery />
        <EstimateForm />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
