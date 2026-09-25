import {
  AppWindow,
  Download,
  Layers,
  Lock,
  Monitor,
  MousePointer2,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackInstallClick } from "@/lib/analytics";

const macDownloadUrl = "/downloads/ScreenPrivacyBlurMac.dmg";

const capabilities = [
  {
    icon: Layers,
    title: "Manual Overlay Blur",
    description: "Place blur areas exactly where sensitive data appears on your desktop.",
  },
  {
    icon: AppWindow,
    title: "Window Attachment",
    description: "Attach overlays to a visible app window so they stay with the right context.",
  },
  {
    icon: Lock,
    title: "Locked Mode",
    description: "Keep overlays click-through while you present, record, or switch tasks.",
  },
];

export const MacDesktopApp = () => {
  return (
    <section className="relative overflow-hidden px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground">
              <Monitor className="h-4 w-4 text-primary" />
              <span>macOS desktop app</span>
            </div>

            <div className="space-y-5">
              <h2 className="font-display text-3xl font-bold leading-tight md:text-4xl">
                Protect more than your browser with
                <span className="text-gradient"> desktop blur overlays</span>
              </h2>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Screen Privacy Blur for macOS brings the same local-first workflow to your desktop. Add
                adjustable Overlay Blur regions over apps, documents, dashboards, or meeting windows before
                sharing your screen.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {capabilities.map((capability) => (
                <div key={capability.title} className="rounded-2xl glass p-5 transition-all duration-300 hover:shadow-glow">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <capability.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 font-display text-base font-semibold">{capability.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{capability.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild variant="hero" size="xl" className="group">
                <a
                  href={macDownloadUrl}
                  download
                  onClick={() => trackInstallClick({ target: "macos", placement: "mac_section", targetUrl: macDownloadUrl })}
                >
                  <Download className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
                  Download DMG
                </a>
              </Button>
              <p className="text-sm text-muted-foreground">
                DMG installer. Runs locally; no account required.
              </p>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-3xl border border-border/60 bg-secondary/40 p-4 shadow-elevated md:min-h-[440px] md:p-6">
            <div className="absolute inset-x-0 top-0 flex h-12 items-center gap-2 border-b border-border/60 bg-background/70 px-5">
              <span className="h-3 w-3 rounded-full bg-destructive/80" />
              <span className="h-3 w-3 rounded-full bg-primary/70" />
              <span className="h-3 w-3 rounded-full bg-accent/70" />
              <span className="ml-3 text-xs font-medium text-muted-foreground">Screen Privacy Blur Mac</span>
            </div>

            <div className="mt-14 grid h-[calc(100%-3.5rem)] grid-cols-[1fr_auto] gap-4">
              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-5">
                <div className="space-y-4">
                  <div className="h-4 w-32 rounded bg-muted" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="h-24 rounded-xl bg-muted/70" />
                    <div className="h-24 rounded-xl bg-muted/50" />
                  </div>
                  <div className="h-3 w-3/4 rounded bg-muted/80" />
                  <div className="h-3 w-1/2 rounded bg-muted/60" />
                </div>

                <div className="absolute left-10 top-24 h-24 w-44 rounded-2xl border border-primary/70 bg-primary/20 backdrop-blur-md shadow-glow" />
                <div className="absolute bottom-16 right-8 h-28 w-28 rounded-full border border-primary/70 bg-primary/20 backdrop-blur-md shadow-glow" />
              </div>

              <div className="hidden w-24 flex-col gap-3 rounded-2xl border border-border/60 bg-background/70 p-3 sm:flex">
                <div className="flex h-10 items-center justify-center rounded-xl bg-primary/10">
                  <MousePointer2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex h-10 items-center justify-center rounded-xl bg-secondary">
                  <SlidersHorizontal className="h-5 w-5 text-primary" />
                </div>
                <div className="mt-auto space-y-2">
                  <div className="h-2 rounded bg-primary/70" />
                  <div className="h-2 rounded bg-muted" />
                  <div className="h-2 rounded bg-muted" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
