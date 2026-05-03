import { SmoothScroll } from "@/components/smooth-scroll";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Pipeline } from "@/components/landing/pipeline";
import { Models } from "@/components/landing/models";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <SmoothScroll>
      <Navbar />
      <main className="relative">
        <Hero />
        <Features />
        <Pipeline />
        <Models />
        <CTA />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
