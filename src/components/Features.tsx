import { MousePointerClick, Move, Palette, Zap, Globe, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: MousePointerClick,
    title: "One-Click Creation",
    description: "Instantly create blur overlays with a single click. No complex setup required.",
  },
  {
    icon: Move,
    title: "Drag & Resize",
    description: "Freely position and resize blur areas to cover exactly what you need to hide.",
  },
  {
    icon: Palette,
    title: "Full Customization",
    description: "Adjust blur intensity, overlay color, and opacity to match your preferences.",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "See changes instantly as you adjust settings. No delays or refreshes needed.",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "Compatible with all websites including Zoom, Meet, Teams, and any web app.",
  },
  {
    icon: ShieldCheck,
    title: "100% Private",
    description: "All processing happens locally. Zero data collection. Zero tracking.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 px-4 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(173_80%_50%_/_0.05)_0%,transparent_70%)]" />

      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold font-display">
            Everything You Need for
            <span className="text-gradient"> Screen Privacy</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features designed to protect your sensitive information during any screen activity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl glass hover:shadow-glow transition-all duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-display mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
