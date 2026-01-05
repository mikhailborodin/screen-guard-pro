import { Button } from "@/components/ui/button";
import { Shield, Chrome } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="container max-w-6xl mx-auto">
        <div className="flex items-center justify-between glass rounded-2xl px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-semibold text-foreground">Screen Privacy Blur</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#privacy" className="hover:text-foreground transition-colors">Privacy</a>
          </div>

          <Button variant="default" size="sm" className="group">
            <Chrome className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Install Free</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};
