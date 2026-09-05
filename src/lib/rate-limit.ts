interface RateLimitRecord {
  tokens: number;
  lastRefill: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now - record.lastRefill > 10 * 60 * 1000) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
  if (cleanup.unref) cleanup.unref();
}

/**
 * In-process Token Bucket rate limiter (Zero external dependencies).
 *
 * @param key Unique client identifier (e.g., client ID or IP)
 * @param limit Maximum tokens allowed in the bucket
 * @param windowSeconds Window duration in seconds
 */
export function checkRateLimit(
  key: string,
  limit: number = 30,
  windowSeconds: number = 60
): { allowed: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const refillRate = limit / windowMs;

  let record = rateLimitStore.get(key);

  if (!record) {
    record = { tokens: limit - 1, lastRefill: now };
    rateLimitStore.set(key, record);
    return {
      allowed: true,
      remaining: limit - 1,
      reset: Math.ceil(windowSeconds),
    };
  }

  // Refill tokens based on time passed
  const elapsed = now - record.lastRefill;
  const tokensToAdd = elapsed * refillRate;
  record.tokens = Math.min(limit, record.tokens + tokensToAdd);
  record.lastRefill = now;

  if (record.tokens >= 1) {
    record.tokens -= 1;
    return {
      allowed: true,
      remaining: Math.floor(record.tokens),
      reset: Math.ceil((limit - record.tokens) / (refillRate * 1000)),
    };
  }

  return {
    allowed: false,
    remaining: 0,
    reset: Math.ceil((1 - record.tokens) / (refillRate * 1000)),
  };
}
