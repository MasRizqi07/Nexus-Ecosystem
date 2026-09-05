import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import * as schema from "./schema";
import { INITIAL_PRODUCTS } from "./seed-data";

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

    console.log("✓ Seeding completed successfully.");
  } catch (error) {
    console.error("Failed to seed database:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
