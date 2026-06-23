import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Chrome, Download, Shield, Sparkles } from "lucide-react";
import { BlurDemo } from "./BlurDemo";

const extensionUrl = "https://chromewebstore.google.com/detail/pfngjkakgncabcfjdknjacpnbidjlldm?utm_source=item-share-cb";
const macDownloadUrl = "/downloads/ScreenPrivacyBlurMac.dmg";
const demoEmbedUrl = "https://www.youtube.com/embed/pLqxd8KaClQ";

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
              <span>Privacy-First Chrome Extension + macOS App</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight">
              <span className="text-gradient">Screen Privacy</span>
              <br />
              <span className="text-foreground">Blur</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Protect sensitive information during video calls, screen sharing, and recordings with customizable blur overlays for browser tabs and desktop apps.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start">
              <Button asChild variant="hero" size="xl" className="group">
                <a href={extensionUrl} target="_blank" rel="noopener noreferrer">
                  <Chrome className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Add to Chrome - Free
                </a>
              </Button>
              <Button asChild variant="glass" size="xl" className="group">
                <a href={macDownloadUrl} download>
                  <Download className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
                  Download DMG
                </a>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="glass" size="xl">
                    <Sparkles className="w-5 h-5" />
                    Watch Demo
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[calc(100vw-2rem)] max-w-5xl border-border/70 bg-background/95 p-0 shadow-elevated">
                  <DialogTitle className="sr-only">Screen Privacy Blur demo</DialogTitle>
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
                    <iframe
                      className="h-full w-full"
                      src={demoEmbedUrl}
                      title="Screen Privacy Blur demo"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </DialogContent>
              </Dialog>
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
