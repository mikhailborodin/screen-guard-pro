import { ArrowLeft, CheckCircle2, Shield } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

import { Footer } from "@/components/Footer";
import type { GrowthPage as GrowthPageContent } from "@/data/growthPages";

import { installActionsHtml } from "@/data/conversion.mjs";
import { faqsForPage } from "@/data/faq.mjs";
import { comparisonTableHtml } from "@/data/marketing.mjs";
import { marketingStyles } from "@/data/marketingStyles.mjs";
import { FAQSection } from "@/components/FAQSection";
import { MarketingSection } from "@/components/MarketingSection";

type GrowthPageProps = {
  page: GrowthPageContent;
};

const GrowthPage = ({ page }: GrowthPageProps) => {
  const { pathname } = useLocation();
  const isUseCaseOrCompare = page.path.startsWith("/use-cases/") || page.path.startsWith("/compare/");
  return (
    <main className="min-h-screen bg-background text-foreground">
      <style>{marketingStyles}</style>
      <section className="relative isolate overflow-hidden px-4 py-8">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="mx-auto max-w-6xl">
          <nav className="mb-14 flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <span className="font-display font-semibold">Screen Privacy Blur</span>
            </div>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-4 py-2 text-sm text-muted-foreground backdrop-blur-xl">
                <Shield className="h-4 w-4 text-primary" />
                {page.eyebrow}
              </div>

              <div className="space-y-5">
                <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">{page.title}</h1>
                <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{page.description}</p>
              </div>

              <MarketingSection html={installActionsHtml(pathname, page.group === "Compare" ? "comparison_table" : "hero", "Add to Chrome — Free")} />
            </div>

            <div className="space-y-5">
              {page.sources?.map(source => <a key={source.url} href={source.url} className="block text-sm text-primary" target="_blank" rel="noopener noreferrer">Source: {source.label}</a>)}
              {page.sections.map((section) => (
                <article key={section.title} className="rounded-xl border border-border/70 bg-card/60 p-5">
                  <h2 className="font-display text-xl font-semibold">{section.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
                </article>
              ))}

              <div className="grid gap-3 sm:grid-cols-2">
                {page.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/50 p-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {isUseCaseOrCompare && <MarketingSection html={comparisonTableHtml(page)} />}
        </div>
      </section>
      {isUseCaseOrCompare && <FAQSection faqs={faqsForPage(page)} />}
      <Footer />
    </main>
  );
};

export default GrowthPage;
