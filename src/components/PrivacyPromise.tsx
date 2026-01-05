import { ShieldCheck, Eye, Server, Lock } from "lucide-react";

const promises = [
  {
    icon: Eye,
    title: "No Data Collection",
    description: "We never see, collect, or store any of your screen content or browsing activity.",
  },
  {
    icon: Server,
    title: "Local Processing Only",
    description: "Everything runs in your browser. No servers, no cloud, no external connections.",
  },
  {
    icon: Lock,
    title: "Open Source",
    description: "Our code is transparent. Review it yourself and verify our privacy claims.",
  },
];

export const PrivacyPromise = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="container max-w-5xl mx-auto">
        <div className="relative rounded-3xl glass p-8 md:p-12 overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold font-display">Our Privacy Promise</h2>
                <p className="text-muted-foreground">Your privacy is not just a feature—it's our foundation.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {promises.map((promise) => (
                <div key={promise.title} className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <promise.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold font-display">{promise.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{promise.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
