import { describe, it, expect } from "vitest";
import { dbRepo } from "@/db";
import { checkRateLimit } from "@/lib/rate-limit";

describe("Developer Tool State Scoping & Rate Limiting", () => {
  it("isolates saved tool states by anonymous client identifier", async () => {
    const clientA = `client_a_${Date.now()}`;
    const clientB = `client_b_${Date.now()}`;

    // Client A saves a state
    const savedA = await dbRepo.saveToolState({
      clientId: clientA,
      toolType: "JSON",
      title: "Secret Database Config",
      stateData: { host: "internal.db.local", token: "secret_token_123" },
    });

    expect(savedA.id).toBeDefined();
    expect(savedA.clientId).toBe(clientA);

    // Client A retrieves their states
    const statesA = await dbRepo.getToolStates("JSON", clientA);
    expect(statesA.some((s) => s.id === savedA.id)).toBe(true);

    // Client B retrieves states -> MUST NOT see Client A's state
    const statesB = await dbRepo.getToolStates("JSON", clientB);
    expect(statesB.some((s) => s.id === savedA.id)).toBe(false);
    expect(statesB.length).toBe(0);

    // Unscoped access (no clientId) returns empty array
    const unscoped = await dbRepo.getToolStates("JSON", undefined);
    expect(unscoped).toEqual([]);
  });

  it("enforces in-process token-bucket rate limits on burst traffic", () => {
    const rateLimitKey = `test_rate_client_${Date.now()}`;
    const limit = 5;
    const windowSeconds = 10;

    const results = [];
    for (let i = 0; i < 7; i++) {
      results.push(checkRateLimit(rateLimitKey, limit, windowSeconds));
    }

    // First 5 requests must be allowed
    for (let i = 0; i < 5; i++) {
      expect(results[i].allowed).toBe(true);
    }

    // 6th and 7th requests must be rejected
    expect(results[5].allowed).toBe(false);
    expect(results[5].remaining).toBe(0);
    expect(results[6].allowed).toBe(false);
    expect(results[6].remaining).toBe(0);
  });
});
