"use client";

import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cartStore";
import { addToCartAction } from "@/server/actions/cartActions";
import { UI } from "@/constants/ui";
import type { Book } from "@/lib/generated/prisma";
import type { CARD_COLORS } from "@/constants/ui";
import { BookCardImage } from "./BookCardImage";

export type CardColor = (typeof CARD_COLORS)[number];

type BookCardProps = {
  book: Book;
  cardColor: CardColor;
};

export function BookCard({ book, cardColor }: BookCardProps) {
  const { addToCart, removeFromCart } = useCartStore();
  const isOutOfStock = book.stock === 0;

  async function handleAddToCart() {
    addToCart(book);
    const result = await addToCartAction(book.id);
    if (!result.success) {
      removeFromCart(book.id);
      toast.error(result.message);
    }
  }

  return (
    <Card
      className="relative flex flex-col shadow-xs transition-all duration-400 ease-in-out hover:scale-102 hover:shadow-2xl has-[button:active]:scale-98"
      style={{
        background: `linear-gradient(160deg, ${cardColor.color} 0%, ${cardColor.color2} 100%)`,
      }}
    >
      <div className="pointer-events-none absolute -top-8 -right-8 h-36 w-36 rounded-full bg-white/10" />
      <BookCardImage src={book.cover} alt={book.title} />
      <div className="pointer-events-none h-4 bg-gradient-to-b from-transparent to-white/5" />

      <CardContent className="flex flex-1 flex-col gap-1 bg-white/5 p-3">
        <p className="font-roboto text-[9px] font-medium tracking-widest text-white/50 uppercase">
          {book.sku}
        </p>

        <h2 className="font-serif text-base leading-tight font-semibold text-white text-shadow-2xs">
          {book.title}
        </h2>

        <p className="font-sans text-xs text-white/60 text-shadow-2xs">{book.author}</p>

        <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-base font-bold text-white text-shadow-2xs">
            ${book.price.toFixed(2)}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex h-[30px] w-full items-center justify-center gap-1 whitespace-nowrap rounded-full px-3 font-sans text-[11px] font-medium backdrop-blur-xl transition-all duration-200 active:scale-95 disabled:cursor-not-allowed sm:w-auto sm:justify-start ${
              isOutOfStock
                ? "border border-white/15 bg-white/[0.06] text-white/35"
                : "border border-white/50 bg-white/[0.18] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.42),inset_0_-1px_0_rgba(255,255,255,0.06)] hover:bg-white/30"
            } `}
          >
            <ShoppingBag className="h-3 w-3" />
            {isOutOfStock ? UI.OUT_OF_STOCK : UI.ADD_TO_CART}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
