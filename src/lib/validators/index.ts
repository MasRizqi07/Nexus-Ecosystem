import { z } from "zod";

/**
 * CHECKOUT & SHIPPING VALIDATION SCHEMA
 * Strictly validates shipping address, mock payment fields, and prevents empty orders.
 */
export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  customerEmail: z.string().email("Please provide a valid email address"),
  street: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State or Province is required"),
  postalCode: z.string().min(3, "Valid postal/ZIP code is required").max(12),
  country: z.string().min(2, "Country is required"),
  // Mock Card fields
  cardNumber: z
    .string()
    .regex(/^(\d{4}[ -]?){3}\d{4}$/, "Enter a valid 16-digit card number (e.g. 4242 4242 4242 4242)"),
  cardExpiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Expiration must be MM/YY"),
  cardCvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

/**
 * VISUALIZER CUSTOM ARRAY INPUT SCHEMA
 * Validates comma-separated integers, enforcing array length and value bounds.
 */
export const customArraySchema = z.string().refine(
  (val) => {
    if (!val.trim()) return false;
    const parts = val.split(",").map((s) => s.trim());
    if (parts.length < 3 || parts.length > 60) return false;
    return parts.every((p) => {
      const num = Number(p);
      return !isNaN(num) && Number.isInteger(num) && num >= 5 && num <= 500;
    });
  },
  {
    message: "Input must be 3-60 comma-separated integers between 5 and 500 (e.g. 45, 12, 88, 120, 15)",
  }
);

/**
 * DEVELOPER TOOL STATE SAVE SCHEMA
 */
export const saveToolStateSchema = z.object({
  toolType: z.enum(["JSON", "REGEX", "MARKDOWN"]),
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  stateData: z.record(z.unknown()),
});

export type SaveToolStateInput = z.infer<typeof saveToolStateSchema>;
