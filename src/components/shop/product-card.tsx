"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/use-cart-store";
import { useToast } from "@/components/ui/toast";
import { formatCentsToUsd, formatRating } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { success } = useToast();
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    success("Added to Cart", `${product.name} has been added to your order.`);
    setTimeout(() => setAdded(false), 1500);
  };

  const isLowStock = product.inventoryCount < 15;

  return (
    <div className="group rounded-2xl border border-border/80 bg-nexus-surface/60 backdrop-blur-md overflow-hidden hover:border-nexus-cyan/40 hover:shadow-xl hover:shadow-nexus-cyan/5 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Product Image Preview */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-nexus-dark/60">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-nexus-dark/80 via-transparent to-transparent opacity-60" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <Badge variant="outline" className="bg-nexus-dark/80 backdrop-blur-md border-border/80 text-[10px]">
              {product.category}
            </Badge>
            {product.isFeatured && (
              <Badge variant="emerald" className="text-[10px]">
                Featured
              </Badge>
            )}
          </div>

          {/* Low stock pill */}
          {isLowStock && (
            <div className="absolute bottom-3 left-3">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono">
                Only {product.inventoryCount} left
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-amber-400 text-xs">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-mono font-semibold text-foreground">
                {formatRating(product.rating)}
              </span>
              <span className="text-muted-foreground text-[10px]">/ 5.0</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              Stock: {product.inventoryCount}
            </span>
          </div>

          <Link href={`/catalog/${product.slug}`} className="block">
            <h3 className="text-base font-bold text-foreground group-hover:text-nexus-cyan transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary/80 text-muted-foreground border border-border/40"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Price & Add To Cart Button */}
      <div className="p-5 pt-0 border-t border-border/40 mt-4 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-mono text-muted-foreground">
            Price
          </span>
          <span className="text-lg font-mono font-extrabold text-nexus-cyan">
            {formatCentsToUsd(product.price)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/catalog/${product.slug}`}>
            <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="View product details">
              <Eye className="w-4 h-4 text-muted-foreground" />
            </Button>
          </Link>

          <Button
            variant={added ? "secondary" : "default"}
            size="sm"
            onClick={handleAddToCart}
            className="gap-1.5 text-xs h-9 px-3.5 font-semibold"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
