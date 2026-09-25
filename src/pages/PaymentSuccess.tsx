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
  const [isLifetime, setIsLifetime] = useState(false);

  const extensionId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("extension_id") ?? "";
  }, [location.search]);

  const sessionId = new URLSearchParams(location.search).get("session_id") ?? undefined;
  const [activationToken] = useState(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get("activation_token") ?? "";
    const key = extensionId ? `screen-privacy-blur-activation:${extensionId}` : "";
    if (token && key) {
      window.sessionStorage.setItem(key, token);
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      return token;
    }
    return key ? window.sessionStorage.getItem(key) ?? "" : "";
  });

  const extensionUrl = extensionId ? `chrome-extension://${extensionId}/popup.html` : "";

  const verifySubscription = useCallback(async () => {
    setIsChecking(true);
    setError(null);

    try {
      if (!extensionId || !activationToken) {
        throw new Error("The secure activation link is incomplete. Reopen your payment confirmation link or contact support.");
      }
      const status = await checkSubscriptionStatus(extensionId, activationToken, sessionId);
      if (!status.active) {
        setVerificationState("processing");
        return;
      }
      setIsLifetime(status.plan === "lifetime");
      await activateExtension(extensionId, activationToken);
      setVerificationState("active");
    } catch (statusError) {
      setVerificationState("error");
      setError(statusError instanceof Error ? statusError.message : "Unable to check Pro access.");
    } finally {
      setIsChecking(false);
    }
  }, [extensionId, activationToken, sessionId]);

  useEffect(() => { void verifySubscription(); }, [verifySubscription]);

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
                {verificationState === "active" ? isLifetime ? "Lifetime Pro is active" : "Pro is active" : "Activating Pro"}
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
                {isChecking ? "Checking..." : "Check Pro access"}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Open the extension popup and turn on Smart Auto Blur again.
            </p>

            {verificationState === "active" ? (
              <Alert className="border-primary/40 bg-primary/10 text-left">
                <AlertTitle>Pro access verified</AlertTitle>
                <AlertDescription>{isLifetime ? "Your lifetime Pro access is active. No renewal or further subscription payments." : "Your Pro subscription is active."}</AlertDescription>
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
                <AlertTitle>Could not activate Pro</AlertTitle>
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
