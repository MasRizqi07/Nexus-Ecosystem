import { describe, it, expect } from "vitest";

function calculateOrderTotals(items: Array<{ price: number; quantity: number }>) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08); // 8% sales tax
  const shipping = subtotal >= 10000 ? 0 : 1500; // Free shipping on orders >= $100.00
  const total = subtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
}

describe("Checkout Calculations", () => {
  it("calculates accurate subtotal, tax, and free shipping for orders over $100.00", () => {
    // 1 item priced at $899.00 (89900 cents)
    const result = calculateOrderTotals([{ price: 89900, quantity: 1 }]);

    expect(result.subtotal).toBe(89900);
    expect(result.tax).toBe(7192); // 89900 * 0.08 = 7192
    expect(result.shipping).toBe(0); // Free shipping over $100 (10000 cents)
    expect(result.total).toBe(89900 + 7192 + 0); // 97092
  });

  it("applies standard $15.00 shipping fee for orders under $100.00", () => {
    // 1 item priced at $95.00 (9500 cents)
    const result = calculateOrderTotals([{ price: 9500, quantity: 1 }]);

    expect(result.subtotal).toBe(9500);
    expect(result.tax).toBe(760); // 9500 * 0.08 = 760
    expect(result.shipping).toBe(1500); // $15.00 shipping
    expect(result.total).toBe(9500 + 760 + 1500); // 11760 ($117.60)
  });

  it("computes multi-item line cart pricing accurately without floating-point drift", () => {
    const items = [
      { price: 24900, quantity: 2 }, // $498.00
      { price: 9500, quantity: 1 },  // $95.00
    ];

    const result = calculateOrderTotals(items);
    expect(result.subtotal).toBe(59300); // $593.00
    expect(result.tax).toBe(4744); // 59300 * 0.08 = 4744
    expect(result.shipping).toBe(0); // Free shipping
    expect(result.total).toBe(64044);
  });
});
