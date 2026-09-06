"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Package, Truck, ArrowRight, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCentsToUsd } from "@/lib/utils";

interface OrderData {
  order: {
    id: string;
    orderNumber: string;
    customerEmail: string;
    customerName: string;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    subtotal: number;
    tax: number;
    total: number;
    status: string;
    paymentRef: string;
    createdAt: string;
  };
  itemCount: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-nexus-cyan border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground font-mono">
          Synchronizing order history...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-400">
          <p className="font-semibold mb-1">Error Loading Orders</p>
          <p className="text-sm">{error}</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Workspace</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-nexus-cyan" />
            Order History
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            View your past transactions, invoices, and shipping statuses.
          </p>
        </div>
        <Link href="/catalog">
          <Button variant="glow" size="sm" className="gap-2">
            <span>Shop Gear</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="p-16 rounded-3xl border border-dashed border-border/60 text-center space-y-4 bg-nexus-surface/30">
          <div className="w-16 h-16 rounded-2xl bg-secondary/50 mx-auto flex items-center justify-center text-muted-foreground">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">No Orders Found</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            You haven&apos;t placed any orders yet. Explore our enterprise catalog to acquire cutting-edge compute blades and developer gear.
          </p>
          <div className="pt-4">
            <Link href="/catalog">
              <Button variant="outline" size="md" className="gap-2">
                <span>Browse Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(({ order, itemCount }) => (
            <Card key={order.id} className="border-border/60 overflow-hidden hover:border-nexus-cyan/40 transition-colors">
              <CardHeader className="bg-nexus-surface/50 border-b border-border/40 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-mono text-nexus-cyan">
                      {order.orderNumber}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {itemCount} Items
                    </Badge>
                    <Badge
                      variant={order.status === "PAID" ? "emerald" : "outline"}
                      className="text-[10px]"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Totals */}
                  <div className="space-y-3 text-sm">
                    <h4 className="font-semibold text-foreground uppercase tracking-wider text-[10px]">
                      Payment Summary
                    </h4>
                    <div className="flex justify-between text-muted-foreground text-xs">
                      <span>Subtotal</span>
                      <span>{formatCentsToUsd(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground text-xs">
                      <span>Tax</span>
                      <span>{formatCentsToUsd(order.tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border/40">
                      <span>Total</span>
                      <span className="text-emerald-400 font-mono">
                        {formatCentsToUsd(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="space-y-2 text-sm sm:col-span-2 sm:pl-8 sm:border-l border-border/40">
                    <h4 className="font-semibold text-foreground uppercase tracking-wider text-[10px] flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5" />
                      Shipping Destination
                    </h4>
                    <div className="text-muted-foreground text-xs leading-relaxed space-y-1">
                      <p className="font-semibold text-foreground">{order.customerName}</p>
                      <p>{order.shippingAddress?.street}</p>
                      <p>
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                        {order.shippingAddress?.postalCode}
                      </p>
                      <p>{order.shippingAddress?.country}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
