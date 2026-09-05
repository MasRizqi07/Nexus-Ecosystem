async function runPhase4Verification() {
  console.log("=================================================");
  console.log("PHASE 4: TOOLS SAVE SCOPING & RATE LIMIT TEST");
  console.log("=================================================");

  const cookieA = "nexus_client_id=client_alpha_test_111111";
  const cookieB = "nexus_client_id=client_beta_test_222222";

  // 1. User A saves a state
  console.log("[Test 1] User A saves confidential state...");
  const saveRes = await fetch("http://localhost:3000/api/tools/save", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookieA },
    body: JSON.stringify({
      toolType: "JSON",
      title: "User A Secret Vault Schema",
      stateData: { secret: "confidential_token_xyz" },
    }),
  });
  console.log(`Save status: ${saveRes.status} (Expected: 201)`);
  if (saveRes.status !== 201) throw new Error("User A save failed");

  // 2. User A retrieves states
  console.log("\n[Test 2] User A retrieves their saved states...");
  const getARes = await fetch("http://localhost:3000/api/tools/save", {
    headers: { Cookie: cookieA },
  });
  const getAData = await getARes.json();
  console.log(`User A states count: ${getAData.data.length} (Expected >= 1)`);
  console.log("First title:", getAData.data[0]?.title);

  // 3. User B retrieves states (must NOT see User A's data)
  console.log("\n[Test 3] User B retrieves states (cross-tenant isolation check)...");
  const getBRes = await fetch("http://localhost:3000/api/tools/save", {
    headers: { Cookie: cookieB },
  });
  const getBData = await getBRes.json();
  console.log(`User B states count: ${getBData.data.length} (Expected: 0)`);
  if (getBData.data.length !== 0) {
    throw new Error("Data leak detected: User B saw User A's saved data!");
  }

  // 4. Rate Limiting burst test
  console.log("\n[Test 4] Firing burst of 15 requests to test in-process rate limiter...");
  const rateCookie = "nexus_client_id=rate_limit_verifier_999";
  let got429 = false;
  for (let i = 1; i <= 15; i++) {
    const res = await fetch("http://localhost:3000/api/tools/save", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: rateCookie },
      body: JSON.stringify({
        toolType: "MARKDOWN",
        title: `Burst Note ${i}`,
        stateData: { note: "text" },
      }),
    });
    console.log(`Burst ${i}: HTTP ${res.status}`);
    if (res.status === 429) got429 = true;
  }

  if (!got429) throw new Error("Rate limiter failed to trigger 429 on burst");

  console.log("\n=================================================");
  console.log("✓ PHASE 4 SCOPING & RATE LIMITING PASSED CLEANLY");
  console.log("=================================================");
}

runPhase4Verification().catch((err) => {
  console.error(err);
  process.exit(1);
});
