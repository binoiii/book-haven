"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export function CartSummary() {
  const total = useCartStore((state) => state.total);

  return (
    <div className="mt-2 border-t border-border pt-5">
      <div className="flex items-center justify-between">
        <span className="font-serif text-lg font-semibold text-gray-900">Total</span>
        <span data-testid="cart-total" className="font-serif text-xl font-bold text-gray-900">
          ${total().toFixed(2)}
        </span>
      </div>
      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-sans text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-600 active:scale-95">
        <ShoppingBag className="h-4 w-4" />
        Proceed to Checkout
      </button>
    </div>
  );
}
