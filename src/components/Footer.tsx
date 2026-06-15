import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-border/50">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-semibold">Screen Privacy Blur</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground md:justify-end">
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="/data-collection" className="hover:text-foreground transition-colors">Data Collection</Link>
            <Link to="/permissions" className="hover:text-foreground transition-colors">Permissions</Link>
            <Link to="/support" className="hover:text-foreground transition-colors">Support</Link>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2025 Screen Privacy Blur. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
