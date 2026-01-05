import { useState } from "react";
import { Move, Lock } from "lucide-react";

export const BlurDemo = () => {
  const [isBlurred, setIsBlurred] = useState(true);

  return (
    <div className="relative animate-float">
      {/* Browser mockup */}
      <div className="glass rounded-2xl overflow-hidden shadow-elevated">
        {/* Browser header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-background/50 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>secure-bank.com/dashboard</span>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-6 space-y-4 bg-background/30">
          {/* Simulated dashboard content */}
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 rounded bg-muted/50" />
            <div className="h-8 w-24 rounded bg-primary/20" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Account balance - blurred */}
            <div 
              className="relative p-4 rounded-xl bg-secondary/50 col-span-2 cursor-pointer transition-all duration-500"
              onClick={() => setIsBlurred(!isBlurred)}
            >
              <p className="text-xs text-muted-foreground mb-1">Account Balance</p>
              <p className={`text-2xl font-bold font-display text-foreground transition-all duration-500 ${isBlurred ? 'blur-md' : 'blur-0'}`}>
                $124,589.00
              </p>
              <p className={`text-sm text-primary transition-all duration-500 ${isBlurred ? 'blur-md' : 'blur-0'}`}>
                +12.5% this month
              </p>
              
              {/* Blur overlay indicator */}
              {isBlurred && (
                <div className="absolute inset-0 rounded-xl border-2 border-primary/50 border-dashed flex items-center justify-center bg-primary/5">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-xs text-primary">
                    <Move className="w-3 h-3" />
                    <span>Click to toggle blur</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm">Active</span>
              </div>
            </div>
          </div>

          {/* Simulated transaction list */}
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-muted/30" />
            <div className={`space-y-2 transition-all duration-500 ${isBlurred ? 'blur-sm' : 'blur-0'}`}>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                <div className="h-4 w-28 rounded bg-muted/50" />
                <div className="h-4 w-16 rounded bg-muted/50" />
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                <div className="h-4 w-36 rounded bg-muted/50" />
                <div className="h-4 w-20 rounded bg-muted/50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <div className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full glass text-xs font-medium text-primary shadow-glow animate-pulse-glow">
        🔒 Protected
      </div>
    </div>
  );
};
