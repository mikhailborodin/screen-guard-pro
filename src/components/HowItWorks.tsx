import { CircleDot, MousePointer2, Settings, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: CircleDot,
    step: "01",
    title: "Install Extension",
    description: "Add Screen Privacy Blur to Chrome with one click. No account needed.",
  },
  {
    icon: MousePointer2,
    step: "02",
    title: "Click to Create",
    description: "Click the extension icon and draw a blur area over sensitive content.",
  },
  {
    icon: Settings,
    step: "03",
    title: "Customize",
    description: "Adjust blur intensity, color, and opacity to your preference.",
  },
  {
    icon: CheckCircle2,
    step: "04",
    title: "Share Securely",
    description: "Start your meeting or recording. Your private data stays hidden.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold font-display">
            Get Started in
            <span className="text-gradient"> Seconds</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Privacy protection should be simple. Here's how easy it is.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden lg:block" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="relative group">
                <div className="text-center space-y-4">
                  {/* Step number with icon */}
                  <div className="relative inline-flex">
                    <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center group-hover:shadow-glow transition-all duration-500 group-hover:scale-105">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold font-display">
                      {step.step}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold font-display">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>

                {/* Arrow for larger screens */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-4 text-primary/30">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
