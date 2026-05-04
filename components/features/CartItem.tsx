"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import type { Book } from "@/lib/generated/prisma";

type CartItemProps = {
  book: Book;
  quantity: number;
};

export function CartItem({ book, quantity }: CartItemProps) {
  const [confirming, setConfirming] = useState(false);
  const { removeFromCart, updateQuantity } = useCart();

  function handleDecrement() {
    if (quantity === 1) {
      setConfirming(true);
    } else {
      updateQuantity(book.id, quantity - 1);
    }
  }

  return (
    <div data-testid="cart-item" className="border-border flex items-center gap-2 border-b py-4 sm:gap-4 sm:py-5">
      <div className="relative h-16 w-10 flex-shrink-0 overflow-hidden rounded-md shadow-md sm:h-20 sm:w-13">
        <Image
          src={book.cover}
          alt={`Cover of ${book.title}`}
          fill
          sizes="52px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-0.5">
        <p className="line-clamp-2 font-serif text-sm leading-tight font-semibold text-gray-900 sm:text-base">
          {book.title}
        </p>
        <p className="text-muted-foreground text-xs">{book.author}</p>
        <div className="mt-2 flex items-center gap-3">
          <div
            role="group"
            aria-label={`Quantity for ${book.title}`}
            className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-0.5"
          >
            <button
              onClick={handleDecrement}
              aria-label="Decrease quantity"
              className="text-muted-foreground flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              −
            </button>
            <span aria-live="polite" aria-atomic="true" className="w-4 text-center text-sm font-medium text-gray-900">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(book.id, quantity + 1)}
              disabled={quantity >= book.stock}
              aria-label="Increase quantity"
              className="text-muted-foreground flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
          </div>
          {confirming && (
            <div role="alert" className="flex items-center gap-2 text-xs text-muted-foreground">
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
          )}
        </div>
      </div>

      <p className="font-serif text-sm font-bold text-gray-900 sm:text-base">
        ${(book.price * quantity).toFixed(2)}
      </p>
    </div>
  );
}
