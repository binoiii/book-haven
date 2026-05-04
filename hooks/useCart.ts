"use client";

import { useCartStore } from "@/store/cartStore";

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = useCartStore((state) => state.total);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount };
}
