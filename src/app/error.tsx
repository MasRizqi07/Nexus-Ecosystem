/* eslint-disable no-console */
"use client";

import React, { useEffect } from "react";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error telemetry
    console.error("Nexus Runtime Boundary Caught Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-500/10">
        <AlertOctagon className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
          Execution Boundary Interrupted
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          An unhandled runtime exception was intercepted by the Nexus system
          boundary.
        </p>
        {error.message && (
          <div className="mt-3 p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 font-mono text-[11px] text-rose-300 text-left overflow-x-auto">
            {error.message}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="default" size="sm" onClick={() => reset()} className="gap-2">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Frame</span>
        </Button>
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-2">
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
