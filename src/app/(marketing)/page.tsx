import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Activity,
  Code2,
  Database,
  Cpu,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function MarketingHomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
        {/* Background Ambient Glows */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-nexus-cyan/15 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-60 left-1/4 w-[400px] h-[400px] bg-nexus-violet/15 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Engineering Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-nexus-surface/80 border border-nexus-cyan/30 text-xs font-mono text-nexus-cyan mb-8 backdrop-blur-md shadow-lg shadow-nexus-cyan/10 animate-in fade-in slide-in-from-top-4 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-nexus-cyan animate-pulse" />
            <span>Next.js 15 App Router • Strict TypeScript 5</span>
          </div>

          {/* High-Impact Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] text-foreground">
            A Unified Platform Engineered For{" "}
            <span className="gradient-text-cyan-violet">
              Extreme Engineering Velocity
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-normal">
            Nexus Ecosystem converges four critical domains into a cohesive web
            experience: high-converting presentation, step-by-step algorithm
            visualization, developer productivity utilities, and transactional
            e-commerce.
          </p>

          {/* Dual Call to Action */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="glow" size="lg" className="w-full sm:w-auto gap-2 px-8">
                <Terminal className="w-4 h-4" />
                <span>Launch Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/catalog" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto gap-2 px-8 border-border hover:border-emerald-500/50"
              >
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Explore Hardware Store</span>
              </Button>
            </Link>
          </div>

          {/* Telemetry Metrics Bar */}
          <div className="mt-20 pt-10 border-t border-border/40 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-nexus-cyan">
                &lt; 0.8ms
              </div>
              <p className="text-xs text-muted-foreground mt-1 uppercase font-mono">
                Generator Tick Invariant
              </p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400">
                100%
              </div>
              <p className="text-xs text-muted-foreground mt-1 uppercase font-mono">
                Strict Type Coverage
              </p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-nexus-violet">
                Zero
              </div>
              <p className="text-xs text-muted-foreground mt-1 uppercase font-mono">
                Unvalidated Mutations
              </p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400">
                PostgreSQL
              </div>
              <p className="text-xs text-muted-foreground mt-1 uppercase font-mono">
                Drizzle In-Memory Pool
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES BENTO GRID */}
      <section className="py-20 bg-nexus-surface/20 border-t border-border/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="cyan" className="uppercase tracking-widest text-[10px]">
              Ecosystem Architecture
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Four Core Domains, One Unbroken System
            </h2>
            <p className="text-sm text-muted-foreground">
              Engineered with zero context pollution via Next.js isolated Route
              Groups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Visualizer */}
            <Card className="md:col-span-2 relative overflow-hidden border-nexus-cyan/30 hover:border-nexus-cyan/60 transition-all group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-nexus-cyan/10 rounded-full blur-3xl pointer-events-none" />
              <CardContent className="p-8 flex flex-col justify-between h-full space-y-6">
                <div>
                  <Badge variant="cyan" className="mb-3">
                    Interactive Engine
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground">
                    Algorithm & Data Visualizer
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md">
                    Pure TypeScript generator functions (<code>function*</code>)
                    yielding granular frame states. Step forward, backward, or
                    simulate at 1x to 10x speeds with custom array parsing.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-nexus-dark/80 border border-border/60 flex items-end justify-between h-32 gap-2">
                  {[40, 75, 25, 90, 60, 30, 85, 50, 95, 20].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t transition-all duration-300"
                      style={{
                        height: `${h}%`,
                        backgroundColor:
                          i === 3
                            ? "#00f0ff"
                            : i === 7
                            ? "#f43f5e"
                            : i > 7
                            ? "#10b981"
                            : "#1e293b",
                      }}
                    />
                  ))}
                </div>
                <Link href="/visualizer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <span>Open Visualizer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Bento Card 2: Micro E-Commerce */}
            <Card className="border-emerald-500/30 hover:border-emerald-500/60 transition-all group">
              <CardContent className="p-8 flex flex-col justify-between h-full space-y-6">
                <div>
                  <Badge variant="emerald" className="mb-3">
                    Commerce Domain
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground">
                    Hardware & Cloud Catalog
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Zustand LocalStorage cart, faceted search filtering, and
                    frictionless checkout with validated order records.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-nexus-dark/80 border border-border/60 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">Blade Compute</span>
                    <span className="text-emerald-400 font-bold">$899.00</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">Annual License</span>
                    <span className="text-emerald-400 font-bold">$1,200.00</span>
                  </div>
                </div>
                <Link href="/catalog">
                  <Button variant="outline" size="sm" className="gap-2 w-full">
                    <span>Browse Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Bento Card 3: Developer Tools */}
            <Card className="border-nexus-violet/30 hover:border-nexus-violet/60 transition-all group">
              <CardContent className="p-8 flex flex-col justify-between h-full space-y-6">
                <div>
                  <Badge variant="violet" className="mb-3">
                    Productivity
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground">
                    Developer Suite
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    JSON syntax highlighter, regex group sandbox, and Markdown
                    studio with database state persistence.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded bg-secondary text-nexus-violet">
                    JSON Formatter
                  </span>
                  <span className="px-2.5 py-1 rounded bg-secondary text-nexus-cyan">
                    Regex Tester
                  </span>
                  <span className="px-2.5 py-1 rounded bg-secondary text-emerald-400">
                    Markdown Studio
                  </span>
                </div>
                <Link href="/tools/json-formatter">
                  <Button variant="outline" size="sm" className="gap-2 w-full">
                    <span>Launch Utilities</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Bento Card 4: Architecture & DB */}
            <Card className="md:col-span-2 border-border/80 hover:border-nexus-cyan/40 transition-all">
              <CardContent className="p-8 flex flex-col justify-between h-full space-y-6">
                <div>
                  <Badge variant="outline" className="mb-3">
                    Full-Stack Foundation
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground">
                    Drizzle ORM & PostgreSQL Architecture
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Fully typed relational models for users, products, orders,
                    items, and utility configurations. Supported by a thread-safe
                    global memory fallback for zero-dependency development.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-nexus-dark/60 border border-border/40">
                    <Database className="w-4 h-4 text-nexus-cyan mb-1" />
                    <span className="font-semibold text-foreground">Drizzle ORM</span>
                    <p className="text-[10px] text-muted-foreground">Type-safe queries</p>
                  </div>
                  <div className="p-3 rounded-lg bg-nexus-dark/60 border border-border/40">
                    <Code2 className="w-4 h-4 text-nexus-violet mb-1" />
                    <span className="font-semibold text-foreground">Zod Schemas</span>
                    <p className="text-[10px] text-muted-foreground">Boundary validation</p>
                  </div>
                  <div className="p-3 rounded-lg bg-nexus-dark/60 border border-border/40">
                    <Activity className="w-4 h-4 text-emerald-400 mb-1" />
                    <span className="font-semibold text-foreground">Zustand State</span>
                    <p className="text-[10px] text-muted-foreground">LocalStorage sync</p>
                  </div>
                </div>
                <Link href="/about">
                  <Button variant="outline" size="sm" className="gap-2">
                    <span>Read Architecture Spec</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
