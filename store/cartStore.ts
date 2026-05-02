import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Book } from "@/lib/generated/prisma";

type CartItem = {
  book: Book;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  total: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (book) =>
        set((state) => {
          const existing = state.items.find((i) => i.book.id === book.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.book.id === book.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            };
          }
          return { items: [...state.items, { book, quantity: 1 }] };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.book.id !== id),
        })),
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce(
          (sum, item) => sum + item.book.price * item.quantity,
          0,
        ),
    }),
    { name: "cart" },
  ),
);
