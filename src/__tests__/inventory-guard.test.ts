import { describe, it, expect, beforeEach } from "vitest";
import { dbRepo, db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

describe("Inventory Guard & Concurrency Protection", () => {
  const testProductId = "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e"; // Quantum 75% Mechanical Deck

  beforeEach(async () => {
    // Reset test product to a known initial stock
    if (db) {
      await db.update(products).set({ inventoryCount: 42 }).where(eq(products.id, testProductId));
    } else {
      const product = await dbRepo.getProductById(testProductId);
      if (product) product.inventoryCount = 42;
    }
  });

  it("successfully fulfills order when requested quantity is available", async () => {
    const productBefore = await dbRepo.getProductById(testProductId);
    expect(productBefore).not.toBeNull();
    const initialStock = productBefore!.inventoryCount;

    const result = await dbRepo.createOrder(
      {
        orderNumber: `NX-TEST-PASS-${Date.now()}`,
        customerEmail: "test-pass@nexus.dev",
        customerName: "Pass Buyer",
        shippingAddress: {
          street: "123 Main St",
          city: "San Francisco",
          state: "CA",
          postalCode: "94105",
          country: "United States",
        },
        subtotal: 24900,
        tax: 1992,
        total: 26892,
        status: "PAID",
        paymentRef: "pm_test_pass",
      },
      [{ productId: testProductId, productName: productBefore!.name, quantity: 1, unitPrice: 24900 }]
    );

    expect(result.order).toBeDefined();
    expect(result.order.status).toBe("PAID");

    const productAfter = await dbRepo.getProductById(testProductId);
    expect(productAfter!.inventoryCount).toBe(initialStock - 1);
  });

  it("fails with INSUFFICIENT_STOCK when order exceeds available inventory", async () => {
    const product = await dbRepo.getProductById(testProductId);
    expect(product).not.toBeNull();
    const excessiveQuantity = product!.inventoryCount + 500;

    await expect(
      dbRepo.createOrder(
        {
          orderNumber: `NX-TEST-FAIL-${Date.now()}`,
          customerEmail: "test-fail@nexus.dev",
          customerName: "Oversell Buyer",
          shippingAddress: {
            street: "123 Main St",
            city: "San Francisco",
            state: "CA",
            postalCode: "94105",
            country: "United States",
          },
          subtotal: 24900 * excessiveQuantity,
          tax: 1000,
          total: 25900,
          status: "PAID",
          paymentRef: "pm_test_fail",
        },
        [{ productId: testProductId, productName: product!.name, quantity: excessiveQuantity, unitPrice: 24900 }]
      )
    ).rejects.toThrow(/INSUFFICIENT_STOCK/);
  });

  it("prevents overselling during simulated concurrent checkout attempts", async () => {
    const product = await dbRepo.getProductById(testProductId);
    const available = product!.inventoryCount;

    // Both buyers attempt to buy the remaining inventory simultaneously
    const orderPayload = (email: string) => ({
      orderData: {
        orderNumber: `NX-RACE-${email}-${Date.now()}`,
        customerEmail: email,
        customerName: "Racer",
        shippingAddress: {
          street: "123 Speed Way",
          city: "Austin",
          state: "TX",
          postalCode: "78701",
          country: "United States",
        },
        subtotal: 24900 * available,
        tax: 1000,
        total: 25900,
        status: "PAID" as const,
        paymentRef: "pm_race",
      },
      items: [{ productId: testProductId, productName: product!.name, quantity: available, unitPrice: 24900 }],
    });

    const racer1 = orderPayload("racer1@nexus.dev");
    const racer2 = orderPayload("racer2@nexus.dev");

    const outcomes = await Promise.allSettled([
      dbRepo.createOrder(racer1.orderData, racer1.items),
      dbRepo.createOrder(racer2.orderData, racer2.items),
    ]);

    const successes = outcomes.filter((o) => o.status === "fulfilled");
    const failures = outcomes.filter((o) => o.status === "rejected");

    // Exactly one racer must claim the units; the second must fail with INSUFFICIENT_STOCK
    expect(successes.length).toBe(1);
    expect(failures.length).toBe(1);

    if (failures[0].status === "rejected") {
      expect((failures[0] as PromiseRejectedResult).reason.message).toMatch(/INSUFFICIENT_STOCK/);
    }
  });
});
