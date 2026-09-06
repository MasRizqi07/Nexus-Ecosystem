/* eslint-disable no-console */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import * as schema from "./schema";
import { INITIAL_PRODUCTS, INITIAL_USERS } from "./seed-data";
import { hashPassword } from "@/lib/auth";

if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch {
    // .env file may not exist if env vars are provided directly
  }
}

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("ERROR: DATABASE_URL environment variable is required to run db:seed.");
    process.exit(1);
  }

  // Refuse to seed known/demo credentials into anything that looks like production
  // unless the operator explicitly opts in. This is the guard that prevents the
  // exact failure mode found in the audit: a known admin password reaching a real deploy.
  const isProdLike = process.env.NODE_ENV === "production";
  const allowProdSeed = process.env.ALLOW_PROD_SEED === "true";
  if (isProdLike && !allowProdSeed) {
    console.error(
      "ERROR: refusing to seed demo accounts with NODE_ENV=production. " +
      "Set ALLOW_PROD_SEED=true only if you understand this creates a known-password admin account."
    );
    process.exit(1);
  }

  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const devPassword = process.env.SEED_DEV_PASSWORD;
  if (!adminPassword || !devPassword) {
    console.error(
      "ERROR: SEED_ADMIN_PASSWORD and SEED_DEV_PASSWORD environment variables are required to seed users."
    );
    process.exit(1);
  }

  const adminPasswordHash = await hashPassword(adminPassword);
  const devPasswordHash = await hashPassword(devPassword);

  console.log("Connecting to database for seeding...");
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  try {
    console.log(`Seeding ${INITIAL_PRODUCTS.length} products (idempotent upsert on slug)...`);

    for (const product of INITIAL_PRODUCTS) {
      await db
        .insert(schema.products)
        .values({
          id: product.id,
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          imageUrl: product.imageUrl,
          inventoryCount: product.inventoryCount,
          rating: product.rating,
          tags: product.tags,
          isFeatured: product.isFeatured,
          createdAt: product.createdAt,
        })
        .onConflictDoUpdate({
          target: schema.products.slug,
          set: {
            name: sql`excluded.name`,
            description: sql`excluded.description`,
            price: sql`excluded.price`,
            category: sql`excluded.category`,
            imageUrl: sql`excluded.image_url`,
            inventoryCount: sql`excluded.inventory_count`,
            rating: sql`excluded.rating`,
            tags: sql`excluded.tags`,
            isFeatured: sql`excluded.is_featured`,
          },
        });
    }

    console.log(`Seeding ${INITIAL_USERS.length} users with RBAC roles (idempotent upsert on email)...`);
    for (const user of INITIAL_USERS) {
      const passwordHash = user.role === "ADMIN" ? adminPasswordHash : devPasswordHash;
      await db
        .insert(schema.users)
        .values({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatarUrl: user.avatarUrl,
          passwordHash,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
        .onConflictDoUpdate({
          target: schema.users.email,
          set: {
            name: sql`excluded.name`,
            role: sql`excluded.role`,
            avatarUrl: sql`excluded.avatar_url`,
            passwordHash: sql`excluded.password_hash`,
            updatedAt: sql`now()`,
          },
        });
    }

    console.log("✓ Seeding completed successfully.");
  } catch (error) {
    console.error("Failed to seed database:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
