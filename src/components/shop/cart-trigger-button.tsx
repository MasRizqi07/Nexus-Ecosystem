"use client";

import React, { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/use-cart-store";
import { formatCentsToUsd } from "@/lib/utils";

export function CartTriggerButton() {
  const { toggleCart, getTotals, hasHydrated } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totals = mounted && hasHydrated
    ? getTotals()
    : { subtotal: 0, tax: 0, shipping: 0, total: 0, itemCount: 0 };

  return (
    <button
      onClick={toggleCart}
      className="relative flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-nexus-surface/90 border border-nexus-cyan/30 hover:border-nexus-cyan text-foreground transition-all shadow-md shadow-nexus-cyan/10 hover:shadow-nexus-cyan/20 active:scale-95"
      aria-label="Open shopping cart"
    >
      <div className="relative">
        <ShoppingBag className="w-4 h-4 text-nexus-cyan" />
        {totals.itemCount > 0 && (
          <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gradient-to-r from-nexus-cyan to-nexus-violet text-[10px] font-bold text-background flex items-center justify-center animate-in zoom-in-50">
            {totals.itemCount > 9 ? "9+" : totals.itemCount}
          </span>
        )}
      </div>

      <div className="hidden sm:flex flex-col text-left text-xs">
        <span className="text-[10px] uppercase font-mono text-muted-foreground leading-none">
          Cart
        </span>
        <span className="font-mono font-bold text-nexus-cyan leading-tight mt-0.5">
          {formatCentsToUsd(totals.subtotal)}
        </span>
      </div>
    </button>
  );
}
