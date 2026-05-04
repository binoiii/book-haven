"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import type { Book } from "@/lib/generated/prisma";

type CartItemProps = {
  book: Book;
  quantity: number;
};

export function CartItem({ book, quantity }: CartItemProps) {
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  return (
    <div data-testid="cart-item" className="border-border flex items-center gap-4 border-b py-5">
      <div className="relative h-20 w-13 flex-shrink-0 overflow-hidden rounded-md shadow-md">
        <Image
          src={book.cover}
          alt={`Cover of ${book.title}`}
          fill
          sizes="52px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-0.5">
        <p className="font-serif text-base leading-tight font-semibold text-gray-900">
          {book.title}
        </p>
        <p className="text-muted-foreground text-xs">{book.author}</p>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-muted-foreground text-xs">Qty: {quantity}</p>
          <span className="text-muted-foreground text-xs">·</span>
          <button
            onClick={() => removeFromCart(book.id)}
            aria-label="Remove item"
            className="text-muted-foreground flex items-center gap-1 text-xs transition-colors hover:text-orange-500"
          >
            <Trash2 className="h-3 w-3" />
            <span className="mt-[2px]">Remove</span>
          </button>
        </div>
      </div>

      <p className="font-serif text-base font-bold text-gray-900">
        ${(book.price * quantity).toFixed(2)}
      </p>
    </div>
  );
}
