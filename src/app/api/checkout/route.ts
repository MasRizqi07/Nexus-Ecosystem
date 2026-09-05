/* eslint-disable no-console */
import { NextResponse } from "next/server";
import { z } from "zod";
import { dbRepo } from "@/db";
import { checkoutSchema } from "@/lib/validators";

const orderItemsPayloadSchema = z.array(
  z.object({
    productId: z.string().uuid("Invalid product ID format"),
    quantity: z.number().int().positive("Quantity must be greater than zero"),
  })
).min(1, "Order must contain at least one product line item");

const checkoutPayloadSchema = z.object({
  customer: checkoutSchema,
  items: orderItemsPayloadSchema,
});

export async function POST(request: Request) {
  try {
    const rawBody: unknown = await request.json();

    // 1. Strict Zod Boundary Validation
    const validationResult = checkoutPayloadSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_FAILED",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { customer, items } = validationResult.data;

    // 2. Server-side Price Verification & Product Existence
    let computedSubtotal = 0;
    const resolvedOrderItems = [];

    for (const item of items) {
      const product = await dbRepo.getProductById(item.productId);
      if (!product) {
        return NextResponse.json(
          {
            success: false,
            error: "PRODUCT_NOT_FOUND",
            message: `Product with ID ${item.productId} was not found.`,
          },
          { status: 404 }
        );
      }

      if (product.inventoryCount < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: "INSUFFICIENT_STOCK",
            message: `Cannot fulfill order: "${product.name}" has only ${product.inventoryCount} units available, but ${item.quantity} were requested.`,
          },
          { status: 409 }
        );
      }

      const itemTotal = product.price * item.quantity;
      computedSubtotal += itemTotal;

      resolvedOrderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
      });
    }

    // 3. Server-side Tax and Shipping Calculations
    const computedTax = Math.round(computedSubtotal * 0.08); // 8% sales tax
    const computedShipping = computedSubtotal >= 10000 ? 0 : 1500; // Free over $100
    const computedTotal = computedSubtotal + computedTax + computedShipping;

    // 4. Generate Order Number & Mock Payment Reference
    const orderNumber = `NX-ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const paymentRef = `pi_mock_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;

    // 5. Atomic Transaction Mutation (decrement inventory + insert order + items)
    const { order, items: insertedItems } = await dbRepo.createOrder(
      {
        orderNumber,
        customerEmail: customer.customerEmail,
        customerName: customer.customerName,
        shippingAddress: {
          street: customer.street,
          city: customer.city,
          state: customer.state,
          postalCode: customer.postalCode,
          country: customer.country,
        },
        subtotal: computedSubtotal,
        tax: computedTax,
        total: computedTotal,
        status: "PAID",
        paymentRef,
      },
      resolvedOrderItems
    );

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        itemCount: insertedItems.length,
        createdAt: order.createdAt,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal transaction failure";
    console.error("Nexus Checkout Transaction Exception:", error);

    if (message.startsWith("INSUFFICIENT_STOCK")) {
      return NextResponse.json(
        { success: false, error: "INSUFFICIENT_STOCK", message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "SERVER_ERROR", message },
      { status: 500 }
    );
  }
}
