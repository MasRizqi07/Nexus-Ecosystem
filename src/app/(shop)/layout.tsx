import React from "react";
import Link from "next/link";
import { Cpu, ShieldCheck, Zap, Truck, ArrowLeft } from "lucide-react";
import { CartTriggerButton } from "@/components/shop/cart-trigger-button";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { Badge } from "@/components/ui/badge";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-nexus-cyan/30 selection:text-nexus-cyan">
      {/* Top Notification Strip */}
      <div className="bg-nexus-surface border-b border-border/40 py-1.5 px-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-6 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          <Truck className="w-3.5 h-3.5 text-nexus-cyan" />
          <span>Complimentary global express shipping on orders over $100</span>
        </div>
        <span className="hidden sm:inline text-border">|</span>
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Instant digital delivery on cloud cluster licenses</span>
        </div>
        <span className="hidden md:inline text-border">|</span>
        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Hardware guaranteed with 3-year enterprise warranty</span>
        </div>
      </div>

      {/* Main Commerce Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-nexus-cyan/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-all shadow-md shadow-emerald-500/10">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-wider uppercase text-foreground">
                  Nexus
                </span>
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase -mt-1">
                  Market
                </span>
              </div>
            </Link>
            <Badge variant="outline" className="hidden lg:inline-flex text-[10px] text-muted-foreground">
              Hardware & Cloud
            </Badge>
          </div>

          {/* Quick Categories Bar */}
          <nav className="hidden md:flex items-center gap-1 bg-nexus-surface/60 p-1 rounded-xl border border-border/40 text-xs font-medium">
            <Link
              href="/catalog"
              className="px-3 py-1 rounded-lg text-foreground hover:bg-secondary/70 transition-colors"
            >
              All Gear
            </Link>
            <Link
              href="/catalog?category=Hardware"
              className="px-3 py-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors"
            >
              Hardware
            </Link>
            <Link
              href="/catalog?category=Developer%20Gear"
              className="px-3 py-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors"
            >
              Developer Gear
            </Link>
            <Link
              href="/catalog?category=Cloud%20Licenses"
              className="px-3 py-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors"
            >
              Cloud Licenses
            </Link>
          </nav>

          {/* Right actions: Return to landing / Workspace & Cart Trigger */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-nexus-cyan transition-colors"
            >
              <span>Workspace</span>
            </Link>
            <CartTriggerButton />
          </div>
        </div>
      </header>

      {/* Main Shop View */}
      <main className="flex-1">{children}</main>

      {/* Cart Drawer Mount */}
      <CartDrawer />

      {/* Commerce Micro-Footer */}
      <footer className="border-t border-border/60 bg-nexus-surface/30 py-8 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Nexus Ecosystem Home</span>
            </Link>
            <span className="text-border">|</span>
            <Link href="/catalog" className="hover:text-foreground transition-colors">
              Product Catalog
            </Link>
            <Link href="/checkout" className="hover:text-foreground transition-colors">
              Express Checkout
            </Link>
          </div>
          <p className="font-mono text-[11px]">
            Zero-friction transactional commerce • Powered by Drizzle & PostgreSQL
          </p>
        </div>
      </footer>
    </div>
  );
}
