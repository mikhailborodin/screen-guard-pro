import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

import { seoPages } from "@/data/growthPages";

type GrowthHubProps = {
  group: "Use cases" | "Alternatives";
  title: string;
  description: string;
};

const GrowthHub = ({ group, title, description }: GrowthHubProps) => {
  const pages = seoPages.filter((page) => page.group === group);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="px-4 py-12 md:py-20">
        <div className="mx-auto max-w-5xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="mt-10 max-w-3xl space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-4 py-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              Screen Privacy Blur
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">{title}</h1>
            <p className="text-lg leading-relaxed text-muted-foreground">{description}</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {pages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="rounded-xl border border-border/70 bg-card/60 p-6 transition-colors hover:border-primary/70 hover:bg-secondary/50"
              >
                <p className="text-sm text-primary">{page.eyebrow}</p>
                <h2 className="mt-2 font-display text-2xl font-semibold">{page.title}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{page.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default GrowthHub;
