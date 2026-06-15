import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, LifeBuoy, Loader2, Mail, Shield, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { submitSupportRequest } from "@/lib/support";

const topics = [
  "Setup help",
  "Smart Auto Blur Pro",
  "Billing",
  "Bug report",
  "Feature request",
  "Other",
];

const Support = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const company = String(formData.get("company") || "").trim();

    setStatus("sending");
    setError("");

    try {
      await submitSupportRequest({
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        topic: String(formData.get("topic") || "").trim(),
        message: String(formData.get("message") || "").trim(),
        company,
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
      });

      form.reset();
      setStatus("sent");
    } catch (requestError) {
      setStatus("error");
      setError(requestError instanceof Error ? requestError.message : "Support request could not be sent.");
    }
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background px-4 py-8 text-foreground">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="mx-auto max-w-6xl">
        <nav className="mb-10 flex items-center justify-between">
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

        <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-8 pt-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-4 py-2 text-sm text-muted-foreground backdrop-blur-xl">
              <LifeBuoy className="h-4 w-4 text-primary" />
              Support
            </div>

            <div className="space-y-5">
              <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
                Get help with <span className="text-gradient">Screen Privacy Blur</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Send setup questions, billing issues, bug reports, or Smart Auto Blur feedback. We route every request
                into the support inbox so the team can reply by email.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border/70 bg-card/60 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="font-medium">Email follow-up</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Use the address you want us to reply to.
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/60 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="font-medium">Useful details help</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Include browser version, extension version, and reproduction steps when relevant.
                </p>
              </div>
            </div>
          </div>

          <section className="glass rounded-2xl border border-border/70 p-5 shadow-elevated md:p-8" aria-labelledby="support-form-title">
            <div className="mb-6 space-y-2">
              <h2 id="support-form-title" className="font-display text-2xl font-semibold">Send a request</h2>
              <p className="text-sm text-muted-foreground">Fields are sent securely through our support backend.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="hidden" aria-hidden="true">
                Company
                <input name="company" tabIndex={-1} autoComplete="off" />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium">
                  <span>Name</span>
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={120}
                    className="h-11 w-full rounded-lg border border-border bg-background/70 px-3 text-sm outline-none transition-colors focus:border-primary"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium">
                  <span>Email</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    className="h-11 w-full rounded-lg border border-border bg-background/70 px-3 text-sm outline-none transition-colors focus:border-primary"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm font-medium">
                <span>Topic</span>
                <select
                  name="topic"
                  required
                  className="h-11 w-full rounded-lg border border-border bg-background/70 px-3 text-sm outline-none transition-colors focus:border-primary"
                  defaultValue={topics[0]}
                >
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm font-medium">
                <span>Message</span>
                <textarea
                  name="message"
                  required
                  maxLength={5000}
                  rows={7}
                  placeholder="Describe what happened and include the page, browser version, and steps to reproduce when relevant."
                  className="w-full resize-y rounded-lg border border-border bg-background/70 px-3 py-3 text-sm leading-relaxed outline-none transition-colors focus:border-primary"
                />
              </label>

              <Button type="submit" variant="hero" size="xl" className="w-full" disabled={status === "sending"}>
                {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <LifeBuoy className="h-5 w-5" />}
                {status === "sending" ? "Sending..." : "Send request"}
              </Button>

              {status === "sent" ? (
                <p className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Request sent. We will reply to the email address you provided.
                </p>
              ) : null}

              {status === "error" ? (
                <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error || "Could not send the request. Please try again in a moment."}
                </p>
              ) : null}
            </form>
          </section>
        </section>
      </div>
    </main>
  );
};

export default Support;
