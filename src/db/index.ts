import { drizzle } from "drizzle-orm/postgres-js";
import { eq, sql, asc, desc, and } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "./schema";
import { INITIAL_PRODUCTS, INITIAL_TOOL_STATES, INITIAL_USERS } from "./seed-data";
import type { Product, Order, OrderItem, ToolSavedState, User, NewOrder, NewOrderItem, NewToolSavedState } from "./schema";

/**
 * THREAD-SAFE GLOBAL IN-MEMORY STORE SINGLETON
 * Preserves runtime state across Next.js Fast-Refresh, HMR, and Server Action executions
 * when external PostgreSQL connection string is not supplied or during local development.
 */
interface NexusMemoryStore {
  users: Map<string, User>;
  products: Map<string, Product>;
  orders: Map<string, Order>;
  orderItems: Map<string, OrderItem>;
  toolSavedStates: Map<string, ToolSavedState>;
}

declare global {
  // eslint-disable-next-line no-var
  var __nexus_memory_store__: NexusMemoryStore | undefined;
}

function getOrCreateMemoryStore(): NexusMemoryStore {
  if (!globalThis.__nexus_memory_store__) {
    const productMap = new Map<string, Product>();
    for (const p of INITIAL_PRODUCTS) {
      productMap.set(p.id, { ...p });
    }

    const toolMap = new Map<string, ToolSavedState>();
    for (const t of INITIAL_TOOL_STATES) {
      toolMap.set(t.id, { ...t });
    }

    const userMap = new Map<string, User>();
    for (const u of INITIAL_USERS) {
      userMap.set(u.id, { ...u });
    }

    globalThis.__nexus_memory_store__ = {
      users: userMap,
      products: productMap,
      orders: new Map<string, Order>(),
      orderItems: new Map<string, OrderItem>(),
      toolSavedStates: toolMap,
    };
  }
  return globalThis.__nexus_memory_store__;
}

const memoryStore = getOrCreateMemoryStore();

// Live PostgreSQL connection setup
const connectionString = process.env.DATABASE_URL;
export const isLiveDb = Boolean(connectionString && connectionString.startsWith("postgres"));

const queryClient = isLiveDb ? postgres(connectionString as string) : null;
export const db = queryClient ? drizzle(queryClient, { schema }) : null;

/**
 * UNIFIED DATABASE REPOSITORY ABSTRACTION
 * Seamlessly routes queries between live Drizzle PostgreSQL and the thread-safe global memory store.
 */
export const dbRepo = {
  // --- Users & RBAC ---
  async getUserByEmail(email: string): Promise<User | null> {
    if (db) {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email.toLowerCase()))
        .limit(1);
      return user || null;
    }
    for (const u of memoryStore.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) return u;
    }
    return null;
  },

  async getUserById(id: string): Promise<User | null> {
    if (db) {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, id))
        .limit(1);
      return user || null;
    }
    return memoryStore.users.get(id) || null;
  },

  async getAllUsers(): Promise<User[]> {
    if (db) {
      return await db.select().from(schema.users);
    }
    return Array.from(memoryStore.users.values());
  },

  // --- Products ---
  async getProducts(params?: { category?: string; search?: string; sort?: "price_asc" | "price_desc" | "rating" }): Promise<Product[]> {
    if (db) {
      const conditions = [];

      if (params?.category && params.category !== "All") {
        conditions.push(sql`lower(${schema.products.category}) = ${params.category.toLowerCase()}`);
      }

      if (params?.search && params.search.trim()) {
        const q = `%${params.search.toLowerCase().trim()}%`;
        conditions.push(
          sql`(lower(${schema.products.name}) LIKE ${q} OR lower(${schema.products.description}) LIKE ${q} OR ${schema.products.tags}::text ILIKE ${q})`
        );
      }

      const whereClause = conditions.length > 0 ? (conditions.length === 1 ? conditions[0] : and(...conditions)) : undefined;
      const orderByClause =
        params?.sort === "price_asc"
          ? asc(schema.products.price)
          : params?.sort === "price_desc"
          ? desc(schema.products.price)
          : params?.sort === "rating"
          ? desc(schema.products.rating)
          : undefined;

      const query = db.select().from(schema.products);
      if (whereClause && orderByClause) {
        return await query.where(whereClause).orderBy(orderByClause);
      } else if (whereClause) {
        return await query.where(whereClause);
      } else if (orderByClause) {
        return await query.orderBy(orderByClause);
      } else {
        return await query;
      }
    }

    let list = Array.from(memoryStore.products.values());

    if (params?.category && params.category !== "All") {
      const catLower = params.category.toLowerCase();
      list = list.filter((p) => p.category.toLowerCase() === catLower);
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
    }

    if (params?.sort === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (params?.sort === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (params?.sort === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (db) {
      const [prod] = await db
        .select()
        .from(schema.products)
        .where(eq(schema.products.slug, slug))
        .limit(1);
      return prod || null;
    }

    for (const p of memoryStore.products.values()) {
      if (p.slug === slug) return p;
    }
    return null;
  },

  async getProductById(id: string): Promise<Product | null> {
    if (db) {
      const [prod] = await db
        .select()
        .from(schema.products)
        .where(eq(schema.products.id, id))
        .limit(1);
      return prod || null;
    }

    return memoryStore.products.get(id) || null;
  },

  // --- Orders & Items ---
  async createOrder(
    orderData: Omit<NewOrder, "id" | "createdAt">,
    items: Array<Omit<NewOrderItem, "id" | "orderId" | "createdAt">>
  ): Promise<{ order: Order; items: OrderItem[] }> {
    if (items.length === 0) {
      throw new Error("CANNOT_ORDER_EMPTY_CART: Order must contain at least one line item.");
    }

    // If live PostgreSQL connection is active, run via Drizzle transaction
    if (db) {
      return await db.transaction(async (tx) => {
        // Live DB atomic inventory check & decrement guard
        for (const item of items) {
          const [updated] = await tx
            .update(schema.products)
            .set({
              inventoryCount: sql`${schema.products.inventoryCount} - ${item.quantity}`,
            })
            .where(
              and(
                eq(schema.products.id, item.productId),
                sql`${schema.products.inventoryCount} >= ${item.quantity}`
              )
            )
            .returning({
              id: schema.products.id,
              name: schema.products.name,
              inventoryCount: schema.products.inventoryCount,
            });

          if (!updated) {
            throw new Error(
              `INSUFFICIENT_STOCK: "${item.productName}" has insufficient inventory available in live database.`
            );
          }
        }

        const [createdOrder] = await tx
          .insert(schema.orders)
          .values({
            orderNumber: orderData.orderNumber,
            customerEmail: orderData.customerEmail,
            customerName: orderData.customerName,
            shippingAddress: orderData.shippingAddress,
            subtotal: orderData.subtotal,
            tax: orderData.tax,
            total: orderData.total,
            status: orderData.status ?? "PAID",
            paymentRef: orderData.paymentRef,
          })
          .returning();

        const createdItems: OrderItem[] = [];
        for (const item of items) {
          const [createdItem] = await tx
            .insert(schema.orderItems)
            .values({
              orderId: createdOrder.id,
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })
            .returning();
          createdItems.push(createdItem);
        }

        return { order: createdOrder, items: createdItems };
      });
    }

    // --- Thread-Safe Atomic Memory Store Mutation (Fallback) ---
    for (const item of items) {
      const prod = memoryStore.products.get(item.productId);
      if (!prod) {
        throw new Error(`PRODUCT_NOT_FOUND: Product "${item.productName}" (ID: ${item.productId}) does not exist.`);
      }
      if (prod.inventoryCount < item.quantity) {
        throw new Error(
          `INSUFFICIENT_STOCK: "${prod.name}" has only ${prod.inventoryCount} units available, but ${item.quantity} were requested.`
        );
      }
    }

    const orderId = crypto.randomUUID();
    const now = new Date();

    // 1. Decrement all product inventory counts atomically
    for (const item of items) {
      const prod = memoryStore.products.get(item.productId);
      if (prod) {
        prod.inventoryCount -= item.quantity;
      }
    }

    // 2. Commit Order
    const orderRecord: Order = {
      id: orderId,
      orderNumber: orderData.orderNumber,
      customerEmail: orderData.customerEmail,
      customerName: orderData.customerName,
      shippingAddress: orderData.shippingAddress,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      total: orderData.total,
      status: orderData.status ?? "PAID",
      paymentRef: orderData.paymentRef,
      createdAt: now,
    };
    memoryStore.orders.set(orderId, orderRecord);

    // 3. Commit Order Items
    const insertedItems: OrderItem[] = [];
    for (const item of items) {
      const itemId = crypto.randomUUID();
      const itemRecord: OrderItem = {
        id: itemId,
        orderId,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        createdAt: now,
      };
      memoryStore.orderItems.set(itemId, itemRecord);
      insertedItems.push(itemRecord);
    }

    return { order: orderRecord, items: insertedItems };
  },

  async getOrderById(id: string): Promise<{ order: Order; items: OrderItem[] } | null> {
    if (db) {
      const [order] = await db.select().from(schema.orders).where(eq(schema.orders.id, id)).limit(1);
      if (!order) return null;
      const items = await db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, id));
      return { order, items };
    }

    const order = memoryStore.orders.get(id);
    if (!order) return null;

    const items = Array.from(memoryStore.orderItems.values()).filter((i) => i.orderId === id);
    return { order, items };
  },

  // --- Developer Tool Saved States ---
  async getToolStates(toolType?: "JSON" | "REGEX" | "MARKDOWN", clientId?: string): Promise<ToolSavedState[]> {
    if (!clientId) {
      return [];
    }

    if (db) {
      const conditions = [eq(schema.toolSavedStates.clientId, clientId)];
      if (toolType) {
        conditions.push(eq(schema.toolSavedStates.toolType, toolType));
      }
      return await db
        .select()
        .from(schema.toolSavedStates)
        .where(conditions.length === 1 ? conditions[0] : and(...conditions))
        .orderBy(desc(schema.toolSavedStates.updatedAt));
    }

    let all = Array.from(memoryStore.toolSavedStates.values()).filter((s) => s.clientId === clientId);
    if (toolType) {
      all = all.filter((s) => s.toolType === toolType);
    }
    return all.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  },

  async saveToolState(data: Omit<NewToolSavedState, "id" | "createdAt" | "updatedAt">): Promise<ToolSavedState> {
    const id = crypto.randomUUID();
    const now = new Date();

    if (db) {
      const [saved] = await db
        .insert(schema.toolSavedStates)
        .values({
          id,
          clientId: data.clientId || null,
          toolType: data.toolType,
          title: data.title,
          stateData: data.stateData,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      return saved;
    }

    const record: ToolSavedState = {
      id,
      clientId: data.clientId || null,
      toolType: data.toolType,
      title: data.title,
      stateData: data.stateData,
      createdAt: now,
      updatedAt: now,
    };

    memoryStore.toolSavedStates.set(id, record);
    return record;
  },

  async deleteToolState(id: string, clientId?: string): Promise<boolean> {
    if (db) {
      const condition = clientId
        ? and(eq(schema.toolSavedStates.id, id), eq(schema.toolSavedStates.clientId, clientId))
        : eq(schema.toolSavedStates.id, id);
      const res = await db.delete(schema.toolSavedStates).where(condition).returning({ id: schema.toolSavedStates.id });
      return res.length > 0;
    }

    const state = memoryStore.toolSavedStates.get(id);
    if (state && (!clientId || state.clientId === clientId)) {
      return memoryStore.toolSavedStates.delete(id);
    }
    return false;
  },
};
