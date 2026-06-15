import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Paywall from "./pages/Paywall";
import PaymentCancelled from "./pages/PaymentCancelled";
import PaymentSuccess from "./pages/PaymentSuccess";
import Support from "./pages/Support";
import GrowthPage from "./pages/GrowthPage";
import { pageByPath } from "./data/growthPages";

const queryClient = new QueryClient();

// Align router base with Vite's base URL when the app is hosted below a subpath.
const routerBase = import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL.replace(/\/$/, "");

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={routerBase}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/paywall" element={<Paywall />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancelled" element={<PaymentCancelled />} />
          <Route path="/support" element={<Support />} />
          <Route path="/privacy-policy" element={<GrowthPage page={pageByPath["/privacy-policy"]} />} />
          <Route path="/terms" element={<GrowthPage page={pageByPath["/terms"]} />} />
          <Route path="/data-collection" element={<GrowthPage page={pageByPath["/data-collection"]} />} />
          <Route path="/permissions" element={<GrowthPage page={pageByPath["/permissions"]} />} />
          <Route path="/use-cases/screen-sharing" element={<GrowthPage page={pageByPath["/use-cases/screen-sharing"]} />} />
          <Route path="/use-cases/google-meet" element={<GrowthPage page={pageByPath["/use-cases/google-meet"]} />} />
          <Route path="/use-cases/zoom" element={<GrowthPage page={pageByPath["/use-cases/zoom"]} />} />
          <Route path="/use-cases/loom-recording" element={<GrowthPage page={pageByPath["/use-cases/loom-recording"]} />} />
          <Route path="/use-cases/hide-api-keys" element={<GrowthPage page={pageByPath["/use-cases/hide-api-keys"]} />} />
          <Route path="/alternatives/safe-screen-share" element={<GrowthPage page={pageByPath["/alternatives/safe-screen-share"]} />} />
          <Route path="/alternatives/datablur" element={<GrowthPage page={pageByPath["/alternatives/datablur"]} />} />
          <Route path="/alternatives/privacy-blu" element={<GrowthPage page={pageByPath["/alternatives/privacy-blu"]} />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
