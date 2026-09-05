import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, CheckCircle2 } from "lucide-react";
import { dbRepo } from "@/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductDetailActions } from "@/components/shop/product-detail-actions";
import { formatCentsToUsd, formatRating } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await dbRepo.getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} — Nexus Catalog`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await dbRepo.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link href="/catalog">
        <Button variant="ghost" size="sm" className="gap-2 text-xs">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Media Column */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-border/80 bg-nexus-surface/80 shadow-2xl">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="cyan" className="font-mono text-xs">
                {product.category}
              </Badge>
              {product.isFeatured && (
                <Badge variant="emerald" className="font-mono text-xs">
                  Featured Hardware
                </Badge>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-nexus-surface/40 border border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>SKU ID: {product.id.slice(0, 13)}...</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Authenticity
            </span>
          </div>
        </div>

        {/* Product Details Column */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-mono font-bold text-foreground">
                  {formatRating(product.rating)}
                </span>
                <span className="text-muted-foreground text-xs">/ 5.0 Rating</span>
              </div>
              <span className="text-border">|</span>
              <span className="text-xs font-mono text-muted-foreground">
                Stock: {product.inventoryCount} units
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {product.name}
            </h1>

            <div className="text-3xl font-mono font-extrabold text-nexus-cyan">
              {formatCentsToUsd(product.price)}
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Feature Tags */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Architecture & Features
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-secondary/80 text-foreground border border-border/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Add To Cart Actions */}
          <ProductDetailActions product={product} />
        </div>
      </div>
    </div>
  );
}
