import React from "react";
import Link from "next/link";
import {
  Binary,
  FileCode2,
  ScanLine,
  ArrowRight,
  Clock,
} from "lucide-react";
import { dbRepo } from "@/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const toolStates = await dbRepo.getToolStates();
  const products = await dbRepo.getProducts();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-nexus-surface via-nexus-surface/80 to-nexus-dark border border-nexus-cyan/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-nexus-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" className="font-mono text-[10px]">
              Active Environment
            </Badge>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Real-Time Synchronized
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Nexus Workspace & Launchpad
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Welcome to the operational hub. Launch generator-based algorithm visualizers,
            execute real-time developer transformations, and manage micro-commerce records.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link href="/visualizer">
              <Button variant="glow" size="sm" className="gap-2 text-xs">
                <Binary className="w-3.5 h-3.5" />
                <span>Launch Sorting Visualizer</span>
              </Button>
            </Link>
            <Link href="/tools/json-formatter">
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                <FileCode2 className="w-3.5 h-3.5" />
                <span>JSON Formatter</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Launch Utility Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground tracking-tight">
            Developer Utilities Launchpad
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            3 High-Throughput Tools
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Visualizer Card */}
          <Card className="border-nexus-cyan/30 hover:border-nexus-cyan transition-all group">
            <CardHeader className="pb-3">
              <div className="w-9 h-9 rounded-xl bg-nexus-cyan/10 border border-nexus-cyan/30 flex items-center justify-center text-nexus-cyan mb-2">
                <Binary className="w-4 h-4" />
              </div>
              <CardTitle className="text-base">Sorting Visualizer</CardTitle>
              <CardDescription className="text-xs">
                Step-by-step generator engine (`function*`) with timeline scrubbing & custom array parsing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/visualizer">
                <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                  <span>Open Engine</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* JSON Formatter */}
          <Card className="border-nexus-violet/30 hover:border-nexus-violet transition-all group">
            <CardHeader className="pb-3">
              <div className="w-9 h-9 rounded-xl bg-nexus-violet/10 border border-nexus-violet/30 flex items-center justify-center text-nexus-violet mb-2">
                <FileCode2 className="w-4 h-4" />
              </div>
              <CardTitle className="text-base">JSON Formatter</CardTitle>
              <CardDescription className="text-xs">
                Real-time validation, syntax highlighting, minification, and database persistence.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/tools/json-formatter">
                <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                  <span>Launch Formatter</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Regex Tester */}
          <Card className="border-emerald-500/30 hover:border-emerald-500 transition-all group">
            <CardHeader className="pb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
                <ScanLine className="w-4 h-4" />
              </div>
              <CardTitle className="text-base">Regex Sandbox</CardTitle>
              <CardDescription className="text-xs">
                Pattern matching engine with live highlight, capture group breakdown, and flags.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/tools/regex-tester">
                <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                  <span>Test Patterns</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Saved Tool States & Catalog Quick Look */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved Tool Presets */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground">
              Saved Tool Presets in DB
            </h3>
            <Badge variant="outline" className="font-mono text-[10px]">
              {toolStates.length} Records
            </Badge>
          </div>

          <div className="space-y-3">
            {toolStates.map((state) => (
              <div
                key={state.id}
                className="p-4 rounded-xl bg-nexus-surface/70 border border-border/60 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Badge
                    variant={
                      state.toolType === "JSON"
                        ? "violet"
                        : state.toolType === "REGEX"
                        ? "emerald"
                        : "cyan"
                    }
                    className="font-mono text-[9px] shrink-0"
                  >
                    {state.toolType}
                  </Badge>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {state.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono flex items-center gap-1 mt-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(state.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Link
                  href={
                    state.toolType === "JSON"
                      ? "/tools/json-formatter"
                      : state.toolType === "REGEX"
                      ? "/tools/regex-tester"
                      : "/tools/markdown-editor"
                  }
                >
                  <Button variant="ghost" size="sm" className="text-xs h-8">
                    Open
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* System Specs & Metrics */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">
            System & Engine Diagnostics
          </h3>

          <div className="p-6 rounded-2xl bg-nexus-surface/50 border border-border/60 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/40 text-xs">
              <span className="text-muted-foreground">App Router Mode</span>
              <span className="font-mono font-semibold text-foreground">
                Next.js 15 (Node / Turbopack)
              </span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-border/40 text-xs">
              <span className="text-muted-foreground">React Release</span>
              <span className="font-mono font-semibold text-nexus-cyan">
                React 19.0.0 (Strict Concurrent)
              </span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-border/40 text-xs">
              <span className="text-muted-foreground">Persistence Adapter</span>
              <span className="font-mono font-semibold text-emerald-400">
                Drizzle ORM (Thread-Safe Global Singleton)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Catalog Item Count</span>
              <span className="font-mono font-semibold text-amber-400">
                {products.length} Active SKUs
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
