"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import type { Book } from "@/lib/generated/prisma";

type CartItemProps = {
  book: Book;
  quantity: number;
};

export function CartItem({ book, quantity }: CartItemProps) {
  const [confirming, setConfirming] = useState(false);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  function handleDecrement() {
    if (quantity === 1) {
      setConfirming(true);
    } else {
      updateQuantity(book.id, quantity - 1);
    }
  }

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
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-0.5">
            <button
              onClick={handleDecrement}
              aria-label="Decrease quantity"
              className="text-muted-foreground flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              −
            </button>
            <span className="w-4 text-center text-sm font-medium text-gray-900">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(book.id, quantity + 1)}
              aria-label="Increase quantity"
              className="text-muted-foreground flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              +
            </button>
          </div>
          {confirming ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Remove item?</span>
              <button
                onClick={() => removeFromCart(book.id)}
                className="font-medium text-muted-foreground transition-colors hover:text-gray-700"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="font-medium text-orange-400 transition-colors hover:text-orange-500"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              aria-label="Remove item"
              className="text-muted-foreground flex items-center gap-1 text-xs transition-colors hover:text-orange-500"
            >
              <Trash2 className="h-3 w-3" />
              <span className="mt-[2px]">Remove</span>
            </button>
          )}
        </div>
      </div>

      <p className="font-serif text-base font-bold text-gray-900">
        ${(book.price * quantity).toFixed(2)}
      </p>
    </div>
  );
}
