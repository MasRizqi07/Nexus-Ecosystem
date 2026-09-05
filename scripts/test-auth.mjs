async function runAuthRBACTest() {
  console.log("=================================================");
  console.log("PHASE 3 AUTH & RBAC VERIFICATION TEST");
  console.log("=================================================");

  // 1. Unauthenticated request to protected admin endpoint
  console.log("[Test 1] Accessing protected admin endpoint unauthenticated...");
  const unauthRes = await fetch("http://localhost:3000/api/admin/metrics");
  const unauthData = await unauthRes.json();
  console.log(`Status: ${unauthRes.status} (Expected: 401)`);
  console.log("Body:", JSON.stringify(unauthData));
  if (unauthRes.status !== 401) throw new Error("Expected 401 for unauthenticated request");

  // 2. Login as developer (USER role)
  console.log("\n[Test 2] Logging in as developer@nexus.dev (USER role)...");
  const devLoginRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "developer@nexus.dev", password: "dev123" }),
  });
  const devLoginData = await devLoginRes.json();
  const devCookie = devLoginRes.headers.get("set-cookie");
  console.log(`Status: ${devLoginRes.status} (Expected: 200)`);
  console.log("User:", JSON.stringify(devLoginData.user));
  console.log("Session Cookie issued:", Boolean(devCookie));
  if (devLoginRes.status !== 200 || devLoginData.user.role !== "USER") {
    throw new Error("Failed developer login");
  }

  // 3. Verify /api/auth/me with developer cookie
  console.log("\n[Test 3] Verifying /api/auth/me for developer session...");
  const devMeRes = await fetch("http://localhost:3000/api/auth/me", {
    headers: { Cookie: devCookie },
  });
  const devMeData = await devMeRes.json();
  console.log(`Status: ${devMeRes.status} (Expected: 200)`);
  console.log("Authenticated User:", JSON.stringify(devMeData.user));
  if (devMeRes.status !== 200 || devMeData.user.email !== "developer@nexus.dev") {
    throw new Error("Failed to verify developer session");
  }

  // 4. Role-Gating: Developer attempting to access admin metrics
  console.log("\n[Test 4] Role-Gating: USER role attempting to access admin metrics...");
  const devForbiddenRes = await fetch("http://localhost:3000/api/admin/metrics", {
    headers: { Cookie: devCookie },
  });
  const devForbiddenData = await devForbiddenRes.json();
  console.log(`Status: ${devForbiddenRes.status} (Expected: 403)`);
  console.log("Forbidden Message:", JSON.stringify(devForbiddenData));
  if (devForbiddenRes.status !== 403) throw new Error("Expected 403 Forbidden for USER accessing ADMIN route");

  // 5. Login as admin (ADMIN role)
  console.log("\n[Test 5] Logging in as admin@nexus.dev (ADMIN role)...");
  const adminLoginRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@nexus.dev", password: "admin123" }),
  });
  const adminLoginData = await adminLoginRes.json();
  const adminCookie = adminLoginRes.headers.get("set-cookie");
  console.log(`Status: ${adminLoginRes.status} (Expected: 200)`);
  console.log("User:", JSON.stringify(adminLoginData.user));
  console.log("Admin Session Cookie issued:", Boolean(adminCookie));
  if (adminLoginRes.status !== 200 || adminLoginData.user.role !== "ADMIN") {
    throw new Error("Failed admin login");
  }

  // 6. Role-Gating: Admin accessing admin metrics
  console.log("\n[Test 6] Role-Gating: ADMIN role accessing admin metrics...");
  const adminAllowedRes = await fetch("http://localhost:3000/api/admin/metrics", {
    headers: { Cookie: adminCookie },
  });
  const adminAllowedData = await adminAllowedRes.json();
  console.log(`Status: ${adminAllowedRes.status} (Expected: 200)`);
  console.log("Admin Data Summary:", JSON.stringify({
    metrics: adminAllowedData.data.metrics,
    rosterCount: adminAllowedData.data.users.length,
  }));
  if (adminAllowedRes.status !== 200) throw new Error("Expected 200 OK for ADMIN accessing admin route");

  console.log("\n=================================================");
  console.log("✓ ALL AUTH & RBAC GATING TESTS PASSED SUCCESSFULLY");
  console.log("=================================================");
}

runAuthRBACTest().catch((err) => {
  console.error("Auth test failed:", err);
  process.exit(1);
});
