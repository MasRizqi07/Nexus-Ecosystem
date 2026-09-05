import React from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, Package } from "lucide-react";
import { dbRepo } from "@/db";
import { ProductCard } from "@/components/shop/product-card";
import { Badge } from "@/components/ui/badge";

interface CatalogPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: "price_asc" | "price_desc" | "rating";
  }>;
}

const CATEGORIES = [
  "All",
  "Hardware",
  "Developer Gear",
  "Cloud Licenses",
  "Merchandise",
];

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams.category || "All";
  const searchQuery = resolvedParams.search || "";
  const activeSort = resolvedParams.sort || "rating";

  const products = await dbRepo.getProducts({
    category: activeCategory,
    search: searchQuery,
    sort: activeSort,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/60">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="emerald" className="text-[10px] font-mono">
              Enterprise Store
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              {products.length} Products Available
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Nexus Gear & Compute Catalog
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Cutting-edge edge inference blades, bespoke mechanical cyberdecks,
            and dedicated cloud cluster licenses.
          </p>
        </div>

        {/* Search Bar Form */}
        <form
          method="GET"
          action="/catalog"
          className="relative max-w-sm w-full"
        >
          {activeCategory !== "All" && (
            <input type="hidden" name="category" value={activeCategory} />
          )}
          {activeSort && (
            <input type="hidden" name="sort" value={activeSort} />
          )}
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            name="search"
            defaultValue={searchQuery}
            placeholder="Search blades, specs, tags..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border/80 bg-nexus-surface/80 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
          />
        </form>
      </div>

      {/* Filters & Sorting Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat;
            const href =
              cat === "All"
                ? `/catalog${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`
                : `/catalog?category=${encodeURIComponent(cat)}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`;

            return (
              <Link
                key={cat}
                href={href}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10"
                    : "bg-nexus-surface/60 text-muted-foreground border-border/60 hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground self-end sm:self-auto">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Sort:</span>
          <div className="flex gap-1 bg-nexus-surface/80 p-1 rounded-lg border border-border/60 font-mono">
            <Link
              href={`/catalog?category=${encodeURIComponent(activeCategory)}&sort=rating${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`}
              className={`px-2 py-0.5 rounded text-[11px] ${
                activeSort === "rating"
                  ? "bg-emerald-500/20 text-emerald-400 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Top Rated
            </Link>
            <Link
              href={`/catalog?category=${encodeURIComponent(activeCategory)}&sort=price_asc${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`}
              className={`px-2 py-0.5 rounded text-[11px] ${
                activeSort === "price_asc"
                  ? "bg-emerald-500/20 text-emerald-400 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Price: Low
            </Link>
            <Link
              href={`/catalog?category=${encodeURIComponent(activeCategory)}&sort=price_desc${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`}
              className={`px-2 py-0.5 rounded text-[11px] ${
                activeSort === "price_desc"
                  ? "bg-emerald-500/20 text-emerald-400 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Price: High
            </Link>
          </div>
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {products.length === 0 ? (
        <div className="p-16 rounded-2xl border border-dashed border-border text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-secondary mx-auto flex items-center justify-center text-muted-foreground">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            No products matched your criteria
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search terms or selecting a different category
            filter to explore our inventory.
          </p>
          <Link
            href="/catalog"
            className="inline-block px-4 py-2 rounded-lg bg-secondary text-xs font-semibold text-foreground hover:bg-secondary/80"
          >
            Clear All Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
