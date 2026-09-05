import React from "react";
import Link from "next/link";
import { Cpu, ArrowUpRight, Terminal, ShoppingCart, Layers, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-nexus-cyan/30 selection:text-nexus-cyan">
      {/* Top Specular Gradient Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-nexus-cyan via-nexus-violet to-emerald-400" />

      {/* Global Marketing Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-nexus-cyan/20 to-nexus-violet/20 border border-nexus-cyan/40 flex items-center justify-center text-nexus-cyan group-hover:border-nexus-cyan transition-all shadow-md shadow-nexus-cyan/10">
              <Cpu className="w-5 h-5 animate-pulse-glow" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-wider uppercase bg-gradient-to-r from-foreground via-foreground/90 to-nexus-cyan bg-clip-text text-transparent">
                Nexus
              </span>
              <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase -mt-1">
                Ecosystem
              </span>
            </div>
            <Badge variant="cyan" className="hidden sm:inline-flex text-[10px] ml-1 py-0">
              v1.0
            </Badge>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link
              href="/catalog"
              className="hover:text-nexus-cyan transition-colors flex items-center gap-1"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </Link>
            <Link
              href="/visualizer"
              className="hover:text-nexus-cyan transition-colors flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Visualizer</span>
            </Link>
            <Link
              href="/tools/json-formatter"
              className="hover:text-nexus-cyan transition-colors flex items-center gap-1"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Dev Tools</span>
            </Link>
            <Link
              href="/about"
              className="hover:text-nexus-cyan transition-colors"
            >
              Architecture
            </Link>
          </nav>

          {/* Dual Call-to-Action */}
          <div className="flex items-center gap-2.5">
            <Link href="/catalog" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <span>Explore Store</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="glow" size="sm" className="gap-1.5 text-xs">
                <span>Launch Workspace</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Global Marketing Footer */}
      <footer className="border-t border-border/60 bg-nexus-surface/40 backdrop-blur-md pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border/40">
            {/* Brand column */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-nexus-cyan/10 border border-nexus-cyan/30 flex items-center justify-center text-nexus-cyan">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm tracking-wider uppercase text-foreground">
                  Nexus Ecosystem
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A unified multi-domain web platform converging high-converting
                presentation, step-by-step algorithm rendering, developer
                utilities, and micro e-commerce.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="emerald" className="text-[10px]">
                  Next.js 15 App Router
                </Badge>
                <Badge variant="violet" className="text-[10px]">
                  React 19
                </Badge>
              </div>
            </div>

            {/* Domains */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">
                Platform Domains
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link href="/visualizer" className="hover:text-nexus-cyan transition-colors">
                    Algorithm Visualizer
                  </Link>
                </li>
                <li>
                  <Link href="/catalog" className="hover:text-nexus-cyan transition-colors">
                    Hardware & Cloud Catalog
                  </Link>
                </li>
                <li>
                  <Link href="/checkout" className="hover:text-nexus-cyan transition-colors">
                    Frictionless Checkout
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-nexus-cyan transition-colors">
                    Developer Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Developer Utilities */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">
                Developer Utilities
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link href="/tools/json-formatter" className="hover:text-nexus-cyan transition-colors">
                    JSON Formatter & Linter
                  </Link>
                </li>
                <li>
                  <Link href="/tools/regex-tester" className="hover:text-nexus-cyan transition-colors">
                    Regex Pattern Sandbox
                  </Link>
                </li>
                <li>
                  <Link href="/tools/markdown-editor" className="hover:text-nexus-cyan transition-colors">
                    Markdown Live Preview
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-nexus-cyan transition-colors">
                    Engineering Specs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Architectural Guarantees */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">
                System Guarantees
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>100% Strict TypeScript 5</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-nexus-cyan" />
                  <span>Drizzle ORM + PostgreSQL</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-nexus-violet" />
                  <span>Zustand LocalStorage Store</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Zero Unvalidated Mutations</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Nexus Ecosystem. Built for extreme engineering velocity.</p>
            <div className="flex items-center gap-4">
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground flex items-center gap-1 transition-colors">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </Link>
              <span className="text-border">|</span>
              <span className="font-mono text-[11px] text-emerald-400">All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
