import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { PrivacyPromise } from "@/components/PrivacyPromise";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <section id="features">
        <Features />
      </section>
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="privacy">
        <PrivacyPromise />
      </section>
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
