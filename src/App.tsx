import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Paywall from "./pages/Paywall";
import PaymentCancelled from "./pages/PaymentCancelled";
import PaymentSuccess from "./pages/PaymentSuccess";
import Support from "./pages/Support";
import GrowthPage from "./pages/GrowthPage";
import GrowthHub from "./pages/GrowthHub";
import { growthPagesByPath } from "./data/growthPages";

const queryClient = new QueryClient();
const siteUrl = "https://privacyblur.co";
const defaultDescription =
  "Blur sensitive data in Chrome and on macOS before screen sharing, demos, calls, and recordings. Local-first privacy overlays for tabs and desktop apps.";

// Align router base with Vite's base URL when the app is hosted below a subpath.
const routerBase = import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL.replace(/\/$/, "");

const RouteMetadata = () => {
  const { pathname } = useLocation();
  const canonicalPath = pathname === "/" ? "/" : `${pathname.replace(/\/+$/, "")}/`;
  const growthPage = growthPagesByPath[pathname] ?? growthPagesByPath[pathname.replace(/\/+$/, "")];
  const hub =
    canonicalPath === "/use-cases/"
      ? {
          title: "Screen privacy use cases | Screen Privacy Blur",
          description: "Practical ways to hide sensitive browser and desktop information before a live screen share or recording.",
        }
      : canonicalPath === "/alternatives/"
        ? {
            title: "Screen Privacy Blur alternatives | Screen Privacy Blur",
            description: "Compare browser-first privacy workflows for demos, calls, recordings, and remote collaboration.",
          }
        : undefined;
  const isTransactional = ["/paywall/", "/payment-success/", "/payment-cancelled/"].includes(canonicalPath);
  const title = growthPage
    ? `${growthPage.title} | Screen Privacy Blur`
    : hub?.title ?? "Screen Privacy Blur | Blur Sensitive Information During Screen Sharing";
  const description = growthPage?.description ?? hub?.description ?? defaultDescription;

  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `${siteUrl}${canonicalPath}`);
    document.querySelector('meta[name="robots"]')?.setAttribute("content", isTransactional ? "noindex,nofollow" : "index,follow");
  }, [canonicalPath, description, isTransactional, title]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter basename={routerBase}>
      <TooltipProvider>
        <RouteMetadata />
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/paywall" element={<Paywall />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancelled" element={<PaymentCancelled />} />
          <Route path="/support" element={<Support />} />
          <Route path="/support/" element={<Support />} />
          <Route path="/privacy-policy/*" element={<GrowthPage page={growthPagesByPath["/privacy-policy"]} />} />
          <Route path="/terms/*" element={<GrowthPage page={growthPagesByPath["/terms"]} />} />
          <Route path="/data-collection/*" element={<GrowthPage page={growthPagesByPath["/data-collection"]} />} />
          <Route path="/permissions/*" element={<GrowthPage page={growthPagesByPath["/permissions"]} />} />
          <Route path="/use-cases" element={<GrowthHub group="Use cases" title="Screen privacy use cases" description="Practical ways to hide sensitive browser and desktop information before a live screen share or recording." />} />
          <Route path="/use-cases/" element={<GrowthHub group="Use cases" title="Screen privacy use cases" description="Practical ways to hide sensitive browser and desktop information before a live screen share or recording." />} />
          <Route path="/use-cases/screen-sharing/*" element={<GrowthPage page={growthPagesByPath["/use-cases/screen-sharing"]} />} />
          <Route path="/use-cases/google-meet/*" element={<GrowthPage page={growthPagesByPath["/use-cases/google-meet"]} />} />
          <Route path="/use-cases/zoom/*" element={<GrowthPage page={growthPagesByPath["/use-cases/zoom"]} />} />
          <Route path="/use-cases/loom-recording/*" element={<GrowthPage page={growthPagesByPath["/use-cases/loom-recording"]} />} />
          <Route path="/use-cases/hide-api-keys/*" element={<GrowthPage page={growthPagesByPath["/use-cases/hide-api-keys"]} />} />
          <Route path="/alternatives" element={<GrowthHub group="Alternatives" title="Screen Privacy Blur alternatives" description="Compare browser-first privacy workflows for demos, calls, recordings, and remote collaboration." />} />
          <Route path="/alternatives/" element={<GrowthHub group="Alternatives" title="Screen Privacy Blur alternatives" description="Compare browser-first privacy workflows for demos, calls, recordings, and remote collaboration." />} />
          <Route path="/alternatives/safe-screen-share/*" element={<GrowthPage page={growthPagesByPath["/alternatives/safe-screen-share"]} />} />
          <Route path="/alternatives/datablur/*" element={<GrowthPage page={growthPagesByPath["/alternatives/datablur"]} />} />
          <Route path="/alternatives/privacy-blu/*" element={<GrowthPage page={growthPagesByPath["/alternatives/privacy-blu"]} />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
