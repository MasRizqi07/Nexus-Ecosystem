import React from "react";
import Link from "next/link";
import { Compass, Home, ShoppingBag, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-nexus-surface border border-nexus-cyan/40 flex items-center justify-center text-nexus-cyan shadow-xl shadow-nexus-cyan/10">
        <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: "12s" }} />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-mono font-bold text-nexus-cyan uppercase tracking-widest">
          404 • Resource Not Found
        </span>
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
          Sector Coordinates Unresolved
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The requested route does not exist within the Nexus Ecosystem topology.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button variant="glow" size="sm" className="gap-2">
            <Home className="w-3.5 h-3.5" />
            <span>Landing Page</span>
          </Button>
        </Link>
        <Link href="/catalog">
          <Button variant="outline" size="sm" className="gap-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Hardware Catalog</span>
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="gap-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
