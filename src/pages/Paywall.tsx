import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Check, Chrome, Loader2, Sparkles, Wand2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type BillingInterval, createCheckoutSession } from "@/lib/billing";

const benefits = [
  "Automatically detects sensitive fields",
  "Blurs emails, passwords, phone numbers, card fields, API keys",
  "Works during screen sharing and recordings",
  "Manual blur remains free",
];

const plans: Array<{
  interval: BillingInterval;
  name: string;
  price: string;
  cadence: string;
  detail: string;
  badge?: string;
}> = [
  {
    interval: "month",
    name: "Monthly",
    price: "$5",
    cadence: "/month",
    detail: "Billed monthly. Cancel anytime.",
  },
  {
    interval: "year",
    name: "Yearly",
    price: "$48",
    cadence: "/year",
    detail: "$4/month, billed yearly. Save $12.",
    badge: "Save 20%",
  },
  {
    interval: "lifetime",
    name: "Lifetime",
    price: "$59",
    cadence: "once",
    detail: "Pay once. Pro forever. No renewal.",
    badge: "One-time",
  },
];

const Paywall = () => {
  const location = useLocation();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("year");
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extensionId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("extension_id") ?? "";
  }, [location.search]);

  const startCheckout = async () => {
    setIsStartingCheckout(true);
    setError(null);

    try {
      const checkoutUrl = await createCheckoutSession({ extensionId, billingInterval });
      window.location.assign(checkoutUrl);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout.");
      setIsStartingCheckout(false);
    }
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background px-4 py-10 text-foreground">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-4 py-2 text-sm text-muted-foreground backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-primary" />
              Smart Auto Blur Pro
            </div>

            <div className="space-y-5">
              <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
                Unlock <span className="text-gradient">Smart Auto Blur</span>
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Upgrade Screen Privacy Blur to automatically find and blur sensitive fields before they appear in
                screen shares or recordings.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="hero"
                size="xl"
                className="w-full sm:w-auto"
                disabled={isStartingCheckout}
                onClick={startCheckout}
              >
                {isStartingCheckout ? <Loader2 className="h-5 w-5 animate-spin" /> : <Chrome className="h-5 w-5" />}
                {isStartingCheckout
                  ? "Starting checkout..."
                  : billingInterval === "lifetime" ? "Get lifetime Pro — $59"
                  : `Start ${billingInterval === "year" ? "yearly" : "monthly"} Pro`}
              </Button>
              <Button asChild variant="glass" size="xl" className="w-full sm:w-auto">
                <Link to={`/payment-success${location.search}`}>I already paid</Link>
              </Button>
            </div>

            {error ? (
              <Alert variant="destructive" className="max-w-2xl bg-destructive/10">
                <AlertTitle>Checkout could not start</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
          </div>

          <Card className="glass overflow-hidden shadow-elevated">
            <CardContent className="space-y-7 p-6 md:p-8">
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Choose your Pro plan</p>
                <ToggleGroup
                  type="single"
                  variant="plan"
                  value={billingInterval}
                  onValueChange={(value) => {
                    if (value === "month" || value === "year" || value === "lifetime") setBillingInterval(value);
                  }}
                  disabled={isStartingCheckout}
                  className="grid grid-cols-1 items-stretch gap-3"
                  aria-label="Pro plan"
                >
                  {plans.map((plan) => (
                      <ToggleGroupItem
                        key={plan.interval}
                        value={plan.interval}
                        aria-label={plan.name}
                        className="relative h-auto flex-col items-stretch gap-2 p-4 text-left"
                      >
                        {plan.badge ? (
                          <Badge className="absolute right-3 top-3">
                            {plan.badge}
                          </Badge>
                        ) : null}
                        <span className="block text-sm font-semibold">{plan.name}</span>
                        <span className="flex items-baseline gap-1">
                          <span className="font-display text-3xl font-bold">{plan.price}</span>
                          <span className="text-sm text-muted-foreground">{plan.cadence}</span>
                        </span>
                        <span className="block text-xs leading-relaxed text-muted-foreground">{plan.detail}</span>
                      </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <p className="text-sm text-muted-foreground">All plans unlock every Smart Auto Blur Pro feature.</p>
                {billingInterval === "lifetime" ? (
                  <p className="text-xs text-muted-foreground">Already subscribed? Buying lifetime access does not cancel an existing subscription.</p>
                ) : null}
              </div>

              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex gap-3 text-sm leading-relaxed">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-border/70 bg-background/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Wand2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Built for live work</p>
                    <p className="text-sm text-muted-foreground">Auto blur stays focused on sensitive field types.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default Paywall;
