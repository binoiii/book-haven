import { prisma } from "@/server/db";
import { BookCatalogClient } from "@/components/features/BookCatalogClient";

export async function BookCatalog() {
  const books = await prisma.book.findMany({ orderBy: { id: "asc" } });

  return <BookCatalogClient books={books} />;
}
