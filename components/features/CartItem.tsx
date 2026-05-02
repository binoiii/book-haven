"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { UI } from "@/constants/ui";
import type { Book } from "@/lib/generated/prisma";

type CartItemProps = {
  book: Book;
  quantity: number;
};

export function CartItem({ book, quantity }: CartItemProps) {
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  return (
    <div className="flex items-center justify-between gap-4 border-b py-4">
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{book.title}</p>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
      </div>
      <div className="flex items-center gap-4">
        <p className="font-semibold">${(book.price * quantity).toFixed(2)}</p>
        <Button variant="outline" size="sm" onClick={() => removeFromCart(book.id)}>
          {UI.REMOVE}
        </Button>
      </div>
    </div>
  );
}
