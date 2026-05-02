"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export function Header() {
  const items = useCartStore((state) => state.items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-10 border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          BookHaven
        </Link>
        <Link href="/cart" className="relative flex items-center gap-2 text-sm font-medium">
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white">
              {count}
            </span>
          )}
          Cart
        </Link>
      </div>
    </header>
  );
}
