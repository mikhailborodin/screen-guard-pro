import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PaymentCancelled = () => {
  const location = useLocation();

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
        <Card className="glass w-full shadow-elevated">
          <CardContent className="space-y-8 p-6 text-center md:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <ArrowLeft className="h-8 w-8" />
            </div>

            <div className="space-y-3">
              <h1 className="font-display text-4xl font-bold md:text-5xl">Checkout cancelled</h1>
              <p className="mx-auto max-w-xl text-muted-foreground">
                Smart Auto Blur is still locked, but manual blur remains free for screen sharing and recordings.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="hero" size="lg">
                <Link to={`/paywall${location.search}`}>
                  <RotateCcw className="h-5 w-5" />
                  Try again
                </Link>
              </Button>
              <Button asChild variant="glass" size="lg">
                <Link to="/">Continue with free manual blur</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default PaymentCancelled;
