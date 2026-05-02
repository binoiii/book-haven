"use server";

import { prisma } from "@/server/db";

export async function addToCartAction(
  bookId: number,
): Promise<{ success: boolean; message?: string }> {
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book || book.stock === 0) {
    return { success: false, message: "This book is out of stock" };
  }
  return { success: true };
}
