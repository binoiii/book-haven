"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
// Use later
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCartStore } from "@/store/cartStore";
import { addToCartAction } from "@/server/actions/cartActions";
import { UI } from "@/constants/ui";
import type { Book } from "@/lib/generated/prisma";
import { BookCardImage } from "./BookCardImage";

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
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
    <Card className="flex flex-col">
      <BookCardImage src={book.cover} alt={book.title} />
      <CardContent className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-muted-foreground text-xs">{book.sku}</p>
        <h2 className="leading-tight font-semibold">{book.title}</h2>
        <p className="text-muted-foreground text-sm">{book.author}</p>
        <p className="mt-auto pt-2 text-lg font-bold">${book.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart} disabled={isOutOfStock}>
          {UI.ADD_TO_CART}
        </Button>
      </CardFooter>
    </Card>
  );
}
