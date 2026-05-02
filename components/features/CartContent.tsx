"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { CartItem } from "@/components/features/CartItem";
import { CartSummary } from "@/components/features/CartSummary";
import { Button } from "@/components/ui/button";
import { UI } from "@/constants/ui";

export function CartContent() {
  const items = useCartStore((state) => state.items);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
        <p className="text-xl font-semibold">{UI.CART_EMPTY}</p>
        <Button asChild variant="outline">
          <Link href="/">{UI.BACK_TO_SHOP}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map(({ book, quantity }) => (
        <CartItem key={book.id} book={book} quantity={quantity} />
      ))}
      <CartSummary />
      <div className="pt-2">
        <Button asChild variant="outline">
          <Link href="/">{UI.BACK_TO_SHOP}</Link>
        </Button>
      </div>
    </div>
  );
}
