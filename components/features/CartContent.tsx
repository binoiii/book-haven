"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/components/features/CartItem";
import { CartSummary } from "@/components/features/CartSummary";
import { UI } from "@/constants/ui";

export function CartContent() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-32 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
          <BookOpen className="h-7 w-7 text-orange-400" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-serif text-xl font-semibold text-gray-900">{UI.CART_EMPTY}</p>
          <p className="text-muted-foreground text-sm">
            Browse our collection and find your next read.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          {UI.BACK_TO_SHOP}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {items.map(({ book, quantity }) => (
        <CartItem key={book.id} book={book} quantity={quantity} />
      ))}
      <CartSummary />
    </div>
  );
}
