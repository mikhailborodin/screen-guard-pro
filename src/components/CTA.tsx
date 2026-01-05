import { Button } from "@/components/ui/button";
import { Chrome, ArrowRight } from "lucide-react";

export const CTA = () => {
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
            Join thousands of professionals who trust Screen Privacy Blur for their screen sharing needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" className="group">
              <Chrome className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Add to Chrome - It's Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Works with Chrome, Brave, Edge, and all Chromium browsers
          </p>
        </div>
      </div>
    </section>
  );
};
