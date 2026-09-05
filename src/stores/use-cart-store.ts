import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  hasHydrated: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotals: () => {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    itemCount: number;
  };
  setHasHydrated: (state: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product: Product, quantity = 1) => {
        if (quantity <= 0) return;
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isOpen: true,
            };
          }
          const newItem: CartItem = {
            id: crypto.randomUUID(),
            productId: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            category: product.category,
            quantity,
          };
          return {
            items: [...state.items, newItem],
            isOpen: true,
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotals: () => {
        const { items } = get();
        const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
        const subtotal = items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        // Estimated 8% tax
        const tax = Math.round(subtotal * 0.08);
        // Free shipping if subtotal >= $100 (10000 cents), otherwise $15 (1500 cents)
        const shipping = subtotal > 0 && subtotal < 10000 ? 1500 : 0;
        const total = subtotal + tax + shipping;

        return { subtotal, tax, shipping, total, itemCount };
      },

      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
    }),
    {
      name: "nexus-cart-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
