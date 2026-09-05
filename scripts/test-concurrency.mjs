async function runConcurrentCheckoutTest() {
  console.log("=================================================");
  console.log("PHASE 2 CONCURRENCY TEST: INVENTORY RACE GUARD");
  console.log("=================================================");

  const payloadA = {
    customer: {
      customerName: "Buyer A (Concurrent)",
      customerEmail: "buyer-a@nexus.dev",
      street: "100 Alpha Way",
      city: "San Francisco",
      state: "CA",
      postalCode: "94105",
      country: "United States",
      cardNumber: "4242 4242 4242 4242",
      cardExpiry: "12/28",
      cardCvc: "111",
    },
    items: [{ productId: "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d", quantity: 1 }],
  };

  const payloadB = {
    customer: {
      customerName: "Buyer B (Concurrent)",
      customerEmail: "buyer-b@nexus.dev",
      street: "200 Beta Blvd",
      city: "Austin",
      state: "TX",
      postalCode: "78701",
      country: "United States",
      cardNumber: "4242 4242 4242 4242",
      cardExpiry: "12/28",
      cardCvc: "222",
    },
    items: [{ productId: "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d", quantity: 1 }],
  };

  console.log("Firing two concurrent checkout requests simultaneously against product with inventoryCount = 1...\n");

  const [resA, resB] = await Promise.all([
    fetch("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadA),
    }),
    fetch("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadB),
    }),
  ]);

  const dataA = await resA.json();
  const dataB = await resB.json();

  console.log(`[Request A] Status: ${resA.status} ${resA.statusText}`);
  console.log("[Request A] Response Body:", JSON.stringify(dataA, null, 2));
  console.log("-------------------------------------------------");
  console.log(`[Request B] Status: ${resB.status} ${resB.statusText}`);
  console.log("[Request B] Response Body:", JSON.stringify(dataB, null, 2));
  console.log("-------------------------------------------------");

  const successCount = (resA.status === 201 ? 1 : 0) + (resB.status === 201 ? 1 : 0);
  const conflictCount = (resA.status === 409 ? 1 : 0) + (resB.status === 409 ? 1 : 0);

  if (successCount === 1 && conflictCount === 1) {
    console.log("✓ TEST PASSED: Exactly one order succeeded (201) and exactly one order was rejected with INSUFFICIENT_STOCK (409).");
    console.log("Zero overselling occurred. Atomic concurrency guard is verified.");
    process.exit(0);
  } else {
    console.error(`✗ TEST FAILED: Expected 1 success (201) and 1 conflict (409). Got ${successCount} success(es) and ${conflictCount} conflict(s).`);
    process.exit(1);
  }
}

runConcurrentCheckoutTest().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
