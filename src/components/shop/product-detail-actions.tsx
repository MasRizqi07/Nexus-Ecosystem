"use client";

import React, { useState } from "react";
import { Plus, Minus, ShoppingCart, Check, ShieldCheck, Truck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/use-cart-store";
import { useToast } from "@/components/ui/toast";
import type { Product } from "@/types";

export function ProductDetailActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { success } = useToast();

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    success(
      "Added to Cart",
      `Added ${quantity}x ${product.name} to your order.`
    );
    setTimeout(() => setAdded(false), 2000);
  };

  const isOutOfStock = product.inventoryCount <= 0;

  return (
    <div className="space-y-6 pt-4 border-t border-border/60">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Quantity selector */}
        <div className="flex items-center justify-between border border-border/80 rounded-xl bg-nexus-surface/80 p-1.5 h-12 sm:w-36">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isOutOfStock}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-mono text-sm font-bold text-foreground">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() =>
              setQuantity((q) => Math.min(product.inventoryCount, q + 1))
            }
            disabled={quantity >= product.inventoryCount || isOutOfStock}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add To Cart Primary Button */}
        <Button
          variant={added ? "secondary" : "glow"}
          size="lg"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className="flex-1 h-12 gap-2 text-sm font-bold"
        >
          {added ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Added to Cart</span>
            </>
          ) : isOutOfStock ? (
            <span>Sold Out</span>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart ({quantity})</span>
            </>
          )}
        </Button>
      </div>

      {/* View Cart Shortcut */}
      <button
        type="button"
        onClick={openCart}
        className="text-xs text-nexus-cyan hover:underline font-mono inline-flex items-center gap-1"
      >
        <span>Open slide-over cart drawer &rarr;</span>
      </button>

      {/* Trust guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/40 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-nexus-surface/40 border border-border/40">
          <Truck className="w-4 h-4 text-nexus-cyan shrink-0" />
          <span>Global Fast Dispatch</span>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-nexus-surface/40 border border-border/40">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>3-Year Enterprise SLA</span>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-nexus-surface/40 border border-border/40">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Instant Activation</span>
        </div>
      </div>
    </div>
  );
}
