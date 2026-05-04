"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Logo } from "@/components/layout/Logo";

export function Header() {
  const items = useCartStore((state) => state.items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg sticky top-0 z-100 border-b bg-[#f5f5f7]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/">
          <Logo />
        </Link>
        <Link href="/cart" className="relative flex items-center gap-2 text-sm font-medium">
          <ShoppingBag className="h-6 w-6 text-gray-600" />
          {count > 0 && (
            <span className="absolute -top-2 -right-3 flex min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] leading-none font-medium text-white">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
