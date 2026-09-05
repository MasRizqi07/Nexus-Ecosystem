import { pgTable, uuid, varchar, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * USERS TABLE
 * Stores account credentials, roles (USER/ADMIN), and profile timestamps.
 */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("USER"), // 'USER' | 'ADMIN'
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * PRODUCTS TABLE
 * E-Commerce catalog storing pricing in cents (integer) to prevent floating-point inaccuracies,
 * categorized faceted tags, and live inventory levels.
 */
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents: $120.00 -> 12000
  category: varchar("category", { length: 100 }).notNull(), // 'Hardware' | 'Developer Gear' | 'Cloud Licenses' | 'Merchandise'
  imageUrl: text("image_url").notNull(),
  inventoryCount: integer("inventory_count").notNull().default(100),
  rating: integer("rating").notNull().default(48), // scaled x10: 48 -> 4.8 / 5.0
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * ORDERS TABLE
 * Records completed checkout sessions with structured shipping metadata and totals in cents.
 */
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: varchar("order_number", { length: 64 }).notNull().unique(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  shippingAddress: jsonb("shipping_address").$type<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>().notNull(),
  subtotal: integer("subtotal").notNull(),
  tax: integer("tax").notNull(),
  total: integer("total").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("PAID"), // 'PENDING' | 'PAID' | 'FAILED'
  paymentRef: varchar("payment_ref", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * ORDER ITEMS TABLE
 * Line-item snapshot of products captured at checkout time to guarantee historical price integrity.
 */
export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  productName: varchar("product_name", { length: 255 }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * TOOL SAVED STATES TABLE
 * Preserves developer utility configurations (JSON schemas, Regex patterns, Markdown drafts)
 * directly in PostgreSQL.
 */
export const toolSavedStates = pgTable("tool_saved_states", {
  id: uuid("id").defaultRandom().primaryKey(),
  toolType: varchar("tool_type", { length: 50 }).notNull(), // 'JSON' | 'REGEX' | 'MARKDOWN'
  title: varchar("title", { length: 255 }).notNull(),
  stateData: jsonb("state_data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================= RELATIONSHIPS =================

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
}));

// ================= TYPE INFERENCE =================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type ToolSavedState = typeof toolSavedStates.$inferSelect;
export type NewToolSavedState = typeof toolSavedStates.$inferInsert;
