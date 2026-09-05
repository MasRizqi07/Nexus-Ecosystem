import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Zap, Layers, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-2 text-xs mb-4">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </Button>
      </Link>

      <div className="space-y-4">
        <Badge variant="cyan" className="uppercase tracking-widest text-[10px]">
          Architectural Blueprint
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          The Nexus Architectural Manifesto
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          How four distinct software disciplines were forged into a unified,
          zero-compromise web platform with Next.js 15, TypeScript 5, and Drizzle ORM.
        </p>
      </div>

      <div className="space-y-8">
        <Card className="border-border/80">
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-nexus-cyan/10 border border-nexus-cyan/30 flex items-center justify-center text-nexus-cyan">
                <Layers className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                1. Context Isolation Through Route Groups
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Monolithic frontends often suffer from stylesheet bleed, bloated bundle graphs,
              and cross-domain state pollution. Nexus avoids this through Next.js Route Groups:
              <code>(marketing)</code> serves lean, ultra-fast static markup; <code>(shop)</code>
              injects the commerce engine and cart drawer; while <code>(workspace)</code> loads
              authenticated layouts and developer toolbars.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                2. Step-by-Step Generator State Invariants
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Traditional sorting animation libraries employ uncontrolled <code>setTimeout</code>
              chains that leak memory and drop frames. Nexus relies on pure ES6 generator functions
              (<code>function*</code>). Each iteration yields an immutable snapshot detailing active
              comparisons, element swaps, and sorted boundary indices, enabling scrubbing and timeline navigation.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-nexus-violet/10 border border-nexus-violet/30 flex items-center justify-center text-nexus-violet">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                3. Resilient Database Persistence
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Configured with Drizzle ORM targeting PostgreSQL, the data layer utilizes an
              in-memory singleton fallback on <code>globalThis</code>. This allows the complete
              e-commerce catalog, checkout flow, and developer tool state saving to function
              during preview environments, while seamlessly hot-connecting to PostgreSQL pools in production.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="pt-8 border-t border-border/60 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-mono">
          Engine Version: 1.0.0-PROD
        </span>
        <Link href="/dashboard">
          <Button variant="glow" size="md" className="gap-2">
            <span>Explore Dashboard</span>
            <Terminal className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
