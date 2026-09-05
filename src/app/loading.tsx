import React from "react";
import { Cpu } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-nexus-surface border border-nexus-cyan/40 flex items-center justify-center text-nexus-cyan shadow-lg shadow-nexus-cyan/20 animate-pulse">
          <Cpu className="w-6 h-6 animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-nexus-cyan/30 animate-ping" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-nexus-cyan">
          Initializing Engine Frame
        </p>
        <p className="text-[11px] text-muted-foreground font-mono">
          Loading cached AST and runtime dependencies...
        </p>
      </div>
    </div>
  );
}
