"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/use-cart-store";
import { formatCentsToUsd } from "@/lib/utils";

export function CartDrawer() {
  const [mounted, setMounted] = React.useState(false);
  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeItem,
    getTotals,
  } = useCartStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const totals = getTotals();

  const isFreeShipping = totals.subtotal >= 10000;
  const remainingForFreeShipping = Math.max(0, 10000 - totals.subtotal);

  return (
    <Sheet
      isOpen={isOpen}
      onClose={closeCart}
      title="Shopping Cart"
      description={
        totals.itemCount > 0
          ? `${totals.itemCount} ${totals.itemCount === 1 ? "item" : "items"} in your cart`
          : "Your cart is currently empty"
      }
    >
      <div className="flex flex-col h-full justify-between">
        {/* Free Shipping Meter */}
        {totals.subtotal > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-nexus-surface/80 border border-border/60">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground font-medium">
                {isFreeShipping ? (
                  <span className="text-emerald-400 font-semibold">
                    Free shipping unlocked!
                  </span>
                ) : (
                  <span>
                    Add{" "}
                    <strong className="text-nexus-cyan font-mono">
                      {formatCentsToUsd(remainingForFreeShipping)}
                    </strong>{" "}
                    for free shipping
                  </span>
                )}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {Math.min(100, Math.round((totals.subtotal / 10000) * 100))}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-border/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-nexus-cyan to-emerald-400 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (totals.subtotal / 10000) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Item List or Empty State */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-secondary/60 flex items-center justify-center text-muted-foreground border border-border/40">
              <ShoppingBag className="w-8 h-8 stroke-1" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-base">
                Your cart is empty
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Explore our catalog of neural accelerators, mechanical decks,
                and cloud infrastructure licenses.
              </p>
            </div>
            <Link href="/catalog" onClick={closeCart}>
              <Button variant="outline" size="sm" className="gap-2">
                Browse Catalog
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto divide-y divide-border/40 pr-1 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="pt-3 first:pt-0 flex gap-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border/60 bg-nexus-surface shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-semibold text-foreground line-clamp-1">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-muted-foreground hover:text-rose-400 transition-colors p-1"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                      {item.category}
                    </Badge>
                    <span className="text-xs font-mono font-bold text-nexus-cyan">
                      {formatCentsToUsd(item.price)}
                    </span>
                  </div>
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-border/60 rounded-md bg-nexus-dark/60">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="p-1 hover:text-nexus-cyan transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="p-1 hover:text-nexus-cyan transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[11px] text-muted-foreground ml-auto font-mono">
                      {formatCentsToUsd(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-border/60 space-y-3 mt-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono text-foreground">
                  {formatCentsToUsd(totals.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono text-foreground">
                  {formatCentsToUsd(totals.tax)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="font-mono text-foreground">
                  {totals.shipping === 0 ? (
                    <span className="text-emerald-400 font-semibold">FREE</span>
                  ) : (
                    formatCentsToUsd(totals.shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border/40">
                <span>Total</span>
                <span className="font-mono text-nexus-cyan text-base">
                  {formatCentsToUsd(totals.total)}
                </span>
              </div>
            </div>

            <Link href="/checkout" onClick={closeCart} className="block w-full">
              <Button variant="glow" size="lg" className="w-full gap-2">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Sheet>
  );
}
