/**
 * Fail-fast environment validation. Import this before anything that
 * reads process.env directly for a security-sensitive value.
 * Throwing at module-load time means a missing secret breaks the build
 * or the first request loudly — it can never silently fall back to a
 * committed default.
 */
function requireEnv(name: string, minLength: number): string {
  const value = process.env[name];
  if (!value || value.length < minLength) {
    throw new Error(
      `[env] ${name} is required and must be at least ${minLength} characters. ` +
      `Set it in your environment or .env.local — see .env.example.`
    );
  }
  return value;
}

export const AUTH_SECRET = requireEnv("AUTH_SECRET", 32);
