"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ShoppingBag,
  Lock,
  Sparkles,
} from "lucide-react";
import { useCartStore } from "@/stores/use-cart-store";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCentsToUsd } from "@/lib/utils";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validators";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const { items, getTotals, clearCart } = useCartStore();
  const { error: toastError, success: toastSuccess } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Completed Order State
  const [completedOrder, setCompletedOrder] = useState<{
    orderNumber: string;
    total: number;
    createdAt: string;
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: "Mas Rizqi",
    customerEmail: "masrizqi@nexus.io",
    street: "742 Evergreen Cyber Terrace",
    city: "San Francisco",
    state: "CA",
    postalCode: "94105",
    country: "United States",
    cardNumber: "4242 4242 4242 4242",
    cardExpiry: "12/28",
    cardCvc: "888",
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-nexus-cyan border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground font-mono">
          Loading secure checkout environment...
        </p>
      </div>
    );
  }

  const totals = getTotals();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof CheckoutFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setServerError(null);
  };

  const validateStep1 = () => {
    const step1Schema = checkoutSchema.pick({
      customerName: true,
      customerEmail: true,
      street: true,
      city: true,
      state: true,
      postalCode: true,
      country: true,
    });
    const result = step1Schema.safeParse(formData);
    if (!result.success) {
      const formatted = result.error.flatten().fieldErrors;
      const errors: Partial<Record<keyof CheckoutFormData, string>> = {};
      for (const [k, v] of Object.entries(formatted)) {
        if (v && v.length > 0) {
          errors[k as keyof CheckoutFormData] = v[0];
        }
      }
      setFormErrors(errors);
      return false;
    }
    setFormErrors({});
    return true;
  };

  const validateStep2 = () => {
    const step2Schema = checkoutSchema.pick({
      cardNumber: true,
      cardExpiry: true,
      cardCvc: true,
    });
    const result = step2Schema.safeParse(formData);
    if (!result.success) {
      const formatted = result.error.flatten().fieldErrors;
      const errors: Partial<Record<keyof CheckoutFormData, string>> = {};
      for (const [k, v] of Object.entries(formatted)) {
        if (v && v.length > 0) {
          errors[k as keyof CheckoutFormData] = v[0];
        }
      }
      setFormErrors(errors);
      return false;
    }
    setFormErrors({});
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handleSubmitOrder = async () => {
    // Validate entire schema
    const fullValidation = checkoutSchema.safeParse(formData);
    if (!fullValidation.success) {
      toastError("Validation Error", "Please review the highlighted form fields.");
      return;
    }

    if (items.length === 0) {
      toastError("Empty Cart", "Cannot checkout an empty shopping cart.");
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const payload = {
        customer: formData,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg = data.message || "Failed to finalize transactional order.";
        setServerError(errorMsg);
        toastError("Order Error", errorMsg);
        setIsSubmitting(false);
        return;
      }

      // Order Success!
      setCompletedOrder({
        orderNumber: data.orderNumber,
        total: data.total,
        createdAt: data.createdAt,
      });
      clearCart();
      toastSuccess("Order Confirmed!", `Order #${data.orderNumber} successfully placed.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error during checkout.";
      setServerError(msg);
      toastError("Transaction Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-in zoom-in-95 duration-300">
        {/* Confetti Particles (Native CSS Animation) */}
        <div className="relative flex justify-center items-center">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-2xl shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>
          <Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-nexus-cyan animate-spin" />
        </div>

        <div className="space-y-2">
          <Badge variant="emerald" className="font-mono text-xs">
            Transaction Authorized & Sealed
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Order Successfully Placed
          </h1>
          <p className="text-sm text-muted-foreground">
            A confirmation receipt has been sent to{" "}
            <strong className="text-foreground">{formData.customerEmail}</strong>.
          </p>
        </div>

        <Card className="border-emerald-500/30 bg-nexus-surface/60 text-left">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-border/60 text-xs">
              <span className="text-muted-foreground">Order Reference</span>
              <span className="font-mono font-bold text-emerald-400">
                {completedOrder.orderNumber}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border/60 text-xs">
              <span className="text-muted-foreground">Amount Charged</span>
              <span className="font-mono font-bold text-foreground text-sm">
                {formatCentsToUsd(completedOrder.total)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Shipping Destination</span>
              <span className="text-foreground text-right">
                {formData.city}, {formData.country}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="/catalog">
            <Button variant="outline" size="md" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Back to Store</span>
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="glow" size="md" className="gap-2">
              <span>Go to Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // EMPTY CART FALLBACK
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-secondary mx-auto flex items-center justify-center text-muted-foreground">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Your Cart is Empty
        </h2>
        <p className="text-sm text-muted-foreground">
          Add neural compute blades or developer gear from our catalog before
          initiating checkout.
        </p>
        <Link href="/catalog">
          <Button variant="glow" size="md" className="gap-2">
            <span>Browse Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Stepper */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Nexus Express Checkout
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            256-bit encrypted transaction with atomic inventory verification.
          </p>
        </div>

        {/* 3-Step Wizard Indicators */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${
              step >= 1
                ? "bg-nexus-cyan/10 border-nexus-cyan text-nexus-cyan"
                : "border-border text-muted-foreground"
            }`}
          >
            <span>1.</span>
            <span>Shipping</span>
          </div>
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${
              step >= 2
                ? "bg-nexus-cyan/10 border-nexus-cyan text-nexus-cyan"
                : "border-border text-muted-foreground"
            }`}
          >
            <span>2.</span>
            <span>Payment</span>
          </div>
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${
              step === 3
                ? "bg-nexus-cyan/10 border-nexus-cyan text-nexus-cyan"
                : "border-border text-muted-foreground"
            }`}
          >
            <span>3.</span>
            <span>Review</span>
          </div>
        </div>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <div className="flex-1">{serverError}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Steps */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Shipping Address */}
          {step === 1 && (
            <Card className="border-border/80">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Truck className="w-4 h-4 text-nexus-cyan" />
                  <span>Shipping & Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    error={formErrors.customerName}
                    placeholder="Jane Doe"
                  />
                  <Input
                    label="Email Address"
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    error={formErrors.customerEmail}
                    placeholder="jane@company.com"
                  />
                </div>

                <Input
                  label="Street Address"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  error={formErrors.street}
                  placeholder="100 Silicon Blvd, Suite 400"
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    error={formErrors.city}
                    placeholder="San Francisco"
                  />
                  <Input
                    label="State / Province"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    error={formErrors.state}
                    placeholder="CA"
                  />
                  <Input
                    label="Postal Code"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    error={formErrors.postalCode}
                    placeholder="94105"
                  />
                </div>

                <Input
                  label="Country"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  error={formErrors.country}
                  placeholder="United States"
                />

                <div className="pt-4 flex justify-end">
                  <Button
                    variant="glow"
                    size="md"
                    onClick={handleNextStep}
                    className="gap-2 text-xs"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: Payment Details */}
          {step === 2 && (
            <Card className="border-border/80">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Payment Authorization</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-xl bg-nexus-dark/60 border border-border/40 text-xs text-muted-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Mock test card environment: You can use the pre-filled test
                    card details below.
                  </span>
                </div>

                <Input
                  label="Card Number (16 Digits)"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  error={formErrors.cardNumber}
                  placeholder="4242 4242 4242 4242"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expires (MM/YY)"
                    id="cardExpiry"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    error={formErrors.cardExpiry}
                    placeholder="12/28"
                  />
                  <Input
                    label="Security Code (CVC)"
                    id="cardCvc"
                    name="cardCvc"
                    value={formData.cardCvc}
                    onChange={handleInputChange}
                    error={formErrors.cardCvc}
                    placeholder="888"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep(1)}
                    className="gap-2 text-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Shipping</span>
                  </Button>

                  <Button
                    variant="glow"
                    size="md"
                    onClick={handleNextStep}
                    className="gap-2 text-xs"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 3: Review & Authorize */}
          {step === 3 && (
            <Card className="border-nexus-cyan/40">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-nexus-cyan" />
                  <span>Final Order Verification</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-nexus-dark/60 border border-border/40">
                  <div>
                    <h4 className="font-semibold text-foreground uppercase tracking-wider text-[10px] mb-1">
                      Shipping Destination
                    </h4>
                    <p className="text-muted-foreground">{formData.customerName}</p>
                    <p className="text-muted-foreground">{formData.street}</p>
                    <p className="text-muted-foreground">
                      {formData.city}, {formData.state} {formData.postalCode}
                    </p>
                    <p className="text-muted-foreground">{formData.country}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground uppercase tracking-wider text-[10px] mb-1">
                      Payment Method
                    </h4>
                    <p className="text-muted-foreground font-mono">
                      Card ending in **** {formData.cardNumber.slice(-4)}
                    </p>
                    <p className="text-muted-foreground">Expires: {formData.cardExpiry}</p>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-nexus-cyan underline mt-2 inline-block text-[11px]"
                    >
                      Edit Payment
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep(2)}
                    className="gap-2 text-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </Button>

                  <Button
                    variant="glow"
                    size="lg"
                    isLoading={isSubmitting}
                    onClick={handleSubmitOrder}
                    className="gap-2 font-bold px-8 text-sm"
                  >
                    <span>Authorize & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <Card className="border-border/80 sticky top-24">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Order Summary</span>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {totals.itemCount} Items
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items List */}
              <div className="divide-y divide-border/40 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.productId} className="py-2.5 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border/60 bg-nexus-surface shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        Qty: {item.quantity} × {formatCentsToUsd(item.price)}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-foreground">
                      {formatCentsToUsd(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-border/60 space-y-2 text-xs">
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
                <div className="flex justify-between text-base font-bold text-foreground pt-3 border-t border-border/40">
                  <span>Total Due</span>
                  <span className="font-mono text-nexus-cyan">
                    {formatCentsToUsd(totals.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
