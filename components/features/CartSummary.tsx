"use client";

import { useCartStore } from "@/store/cartStore";

export function CartSummary() {
  const total = useCartStore((state) => state.total);

  return (
    <div className="flex justify-between border-t pt-4 text-lg font-bold">
      <span>Total</span>
      <span data-testid="cart-total">${total().toFixed(2)}</span>
    </div>
  );
}
