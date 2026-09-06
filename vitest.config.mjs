import { defineConfig } from "vitest/config";
import path from "path";

if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch {
    // .env file may not exist if env vars are provided directly
  }
}

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    env: {
      AUTH_SECRET: process.env.AUTH_SECRET || "test-vitest-auth-secret-key-32-chars-minimum",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
