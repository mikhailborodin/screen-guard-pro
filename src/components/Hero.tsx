import { Button } from "@/components/ui/button";
import { Chrome, Shield, Sparkles } from "lucide-react";
import { BlurDemo } from "./BlurDemo";

const extensionUrl = "https://chromewebstore.google.com/detail/pfngjkakgncabcfjdknjacpnbidjlldm?utm_source=item-share-cb";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="container relative z-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>Privacy-First Chrome Extension</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight">
              <span className="text-gradient">Screen Privacy</span>
              <br />
              <span className="text-foreground">Blur</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Protect your sensitive information during video calls, screen sharing, and recordings with customizable blur overlays.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild variant="hero" size="xl" className="group">
                <a href={extensionUrl} target="_blank" rel="noopener noreferrer">
                  <Chrome className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Add to Chrome - Free
                </a>
              </Button>
              <Button variant="glass" size="xl">
                <Sparkles className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>No data collection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Local processing</span>
              </div>
            </div>
          </div>

          {/* Right demo */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <BlurDemo />
          </div>
        </div>
      </div>
    </section>
  );
};
