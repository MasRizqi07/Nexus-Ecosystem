import { cookies } from "next/headers";

const AUTH_SALT = process.env.AUTH_SALT || "nexus_auth_salt_v1";
const AUTH_SECRET = process.env.AUTH_SECRET || "nexus-ecosystem-jwt-secret-key-production-32-chars";
export const SESSION_COOKIE_NAME = "nexus_session";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

/**
 * Derives a PBKDF2 SHA-256 hash using native Web Crypto API.
 */
export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode(AUTH_SALT),
      iterations: 10000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  return Buffer.from(derived).toString("hex");
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const computedHash = await hashPassword(password);
  return computedHash === storedHash;
}

/**
 * Creates a signed HMAC-SHA256 session token.
 */
export async function createSessionToken(user: SessionUser): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(AUTH_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const payload = {
    ...user,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64));
  const signatureB64 = Buffer.from(signature).toString("base64url");

  return `${payloadB64}.${signatureB64}`;
}

/**
 * Verifies a signed HMAC-SHA256 session token.
 */
export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadB64, signatureB64] = parts;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(AUTH_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      Buffer.from(signatureB64, "base64url"),
      enc.encode(payloadB64)
    );

    if (!valid) return null;

    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadJson);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role as "USER" | "ADMIN",
    };
  } catch {
    return null;
  }
}

/**
 * Retrieves the current session user from the incoming cookie header.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) return null;
  return await verifySessionToken(sessionCookie.value);
}
