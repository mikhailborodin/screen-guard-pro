
import { useLocation } from "react-router-dom";
import { installActionsHtml } from "@/data/conversion.mjs";
import { MarketingSection } from "./MarketingSection";

export const CTA = () => {
  const { pathname } = useLocation();
  return (
    <section className="py-24 px-4 relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(173_80%_50%_/_0.1)_0%,transparent_60%)]" />
      
      <div className="container max-w-4xl mx-auto relative z-10">
        <div className="text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold font-display leading-tight">
            Start Protecting Your
            <br />
            <span className="text-gradient">Privacy Today</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Protect your screen before your next demo, call, or recording.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MarketingSection html={installActionsHtml(pathname, "footer")} />
          </div>

          <p className="text-sm text-muted-foreground">
            Works with Chrome, Brave, Edge, and all Chromium browsers
          </p>
        </div>
      </div>
    </section>
  );
};
