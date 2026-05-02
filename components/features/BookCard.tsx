"use client";

import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCartStore } from "@/store/cartStore";
import { addToCartAction } from "@/actions/cartActions";
import { UI } from "@/constants/ui";
import type { Book } from "@/lib/generated/prisma";

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
    <Card className="flex flex-col overflow-hidden">
      <div className="relative h-64 w-full bg-gray-100">
        <Image
          src={book.cover}
          alt={book.title}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isOutOfStock && (
          <div className="absolute right-2 top-2">
            <Badge variant="secondary">{UI.OUT_OF_STOCK}</Badge>
          </div>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs text-muted-foreground">{book.sku}</p>
        <h2 className="font-semibold leading-tight">{book.title}</h2>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        <p className="mt-auto pt-2 text-lg font-bold">${book.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {UI.ADD_TO_CART}
        </Button>
      </CardFooter>
    </Card>
  );
}
