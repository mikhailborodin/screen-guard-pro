import { useLocation } from "react-router-dom";
import { FAQSection } from "@/components/FAQSection";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { MacDesktopApp } from "@/components/MacDesktopApp";
import { PrivacyPromise } from "@/components/PrivacyPromise";
import { CTA } from "@/components/CTA";
import { MarketingSection } from "@/components/MarketingSection";
import { localeFromPath } from "@/data/locales.mjs";
import { comparisonHtml, pricingHtml, stepsHtml, compatibilityHtml, reviewsHtml } from "@/data/marketing.mjs";
import { marketingStyles } from "@/data/marketingStyles.mjs";
import { Footer } from "@/components/Footer";

const Index = () => {
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  return (
    <main className="min-h-screen bg-background">
      <style>{marketingStyles}</style>
      <Navbar />
      <Hero />
      <MarketingSection html={compatibilityHtml(locale)} />
      <MarketingSection html={comparisonHtml(locale)} />
      <Features />
      <MarketingSection html={pricingHtml(locale)} />
      <section id="mac-desktop">
        <MacDesktopApp />
      </section>
      <MarketingSection html={stepsHtml(locale)} />
      <PrivacyPromise />
      <MarketingSection html={reviewsHtml(locale)} />
      <FAQSection />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
