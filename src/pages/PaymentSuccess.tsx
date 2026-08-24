import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Chrome, Loader2, ShieldCheck } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { activateExtension, checkSubscriptionStatus } from "@/lib/billing";
import { useLocation } from "react-router-dom";

type VerificationState = "idle" | "active" | "processing" | "error";

const PaymentSuccess = () => {
  const location = useLocation();
  const [verificationState, setVerificationState] = useState<VerificationState>("idle");
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extensionId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("extension_id") ?? "";
  }, [location.search]);

  const [activationToken] = useState(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const tokenFromUrl = hashParams.get("activation_token") ?? "";
    const storageKey = extensionId ? `screen-privacy-blur-activation:${extensionId}` : "";

    if (tokenFromUrl && storageKey) {
      window.sessionStorage.setItem(storageKey, tokenFromUrl);
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      return tokenFromUrl;
    }

    return storageKey ? window.sessionStorage.getItem(storageKey) ?? "" : "";
  });

  const extensionUrl = extensionId ? `chrome-extension://${extensionId}/popup.html` : "";

  const verifySubscription = useCallback(async () => {
    setIsChecking(true);
    setError(null);

    try {
      if (!extensionId || !activationToken) {
        throw new Error("The secure activation link is incomplete. Return to the extension and start checkout again.");
      }

      const status = await checkSubscriptionStatus(extensionId, activationToken);

      if (!status.active) {
        setVerificationState("processing");
        return;
      }

      await activateExtension(extensionId, activationToken);
      setVerificationState("active");
    } catch (statusError) {
      setVerificationState("error");
      setError(statusError instanceof Error ? statusError.message : "Unable to check subscription status.");
    } finally {
      setIsChecking(false);
    }
  }, [activationToken, extensionId]);

  useEffect(() => {
    void verifySubscription();
  }, [verifySubscription]);

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
        <Card className="glass w-full shadow-elevated">
          <CardContent className="space-y-8 p-6 text-center md:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <ShieldCheck className="h-8 w-8" />
            </div>

            <div className="space-y-3">
              <h1 className="font-display text-4xl font-bold md:text-5xl">
                {verificationState === "active" ? "Pro is active" : "Activating Pro"}
              </h1>
              <p className="mx-auto max-w-xl text-muted-foreground">
                {verificationState === "active"
                  ? "Smart Auto Blur has been enabled automatically in the extension."
                  : "Keep this page open while we verify your payment and activate the extension."}
              </p>
            </div>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              {extensionUrl ? (
                <Button asChild variant="hero" size="lg">
                  <a href={extensionUrl}>
                    <Chrome className="h-5 w-5" />
                    Open Screen Privacy Blur Extension
                  </a>
                </Button>
              ) : (
                <Button type="button" variant="hero" size="lg" disabled>
                  <Chrome className="h-5 w-5" />
                  Open Screen Privacy Blur Extension
                </Button>
              )}
              <Button type="button" variant="glass" size="lg" disabled={isChecking} onClick={verifySubscription}>
                {isChecking ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                {isChecking ? "Checking..." : "Check subscription"}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              After activation, open the extension popup to confirm that Smart Auto Blur is on.
            </p>

            {verificationState === "active" ? (
              <Alert className="border-primary/40 bg-primary/10 text-left">
                <AlertTitle>Subscription verified</AlertTitle>
                <AlertDescription>Your Pro subscription is active and Smart Auto Blur is enabled.</AlertDescription>
              </Alert>
            ) : null}

            {verificationState === "processing" ? (
              <Alert className="bg-background/50 text-left">
                <AlertTitle>Payment is still processing</AlertTitle>
                <AlertDescription>Payment is still processing. Try again in a few seconds.</AlertDescription>
              </Alert>
            ) : null}

            {verificationState === "error" && error ? (
              <Alert variant="destructive" className="bg-destructive/10 text-left">
                <AlertTitle>Could not check subscription</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default PaymentSuccess;
