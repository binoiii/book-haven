import { prisma } from "@/server/db";
import { BookGrid } from "@/components/features/BookGrid";
import { BrowseSectionHeader } from "@/components/features/BrowseSectionHeader";

export async function BookCatalog() {
  const books = await prisma.book.findMany({ orderBy: { id: "asc" } });

  return (
    <>
      <BrowseSectionHeader count={books.length} />
      <BookGrid books={books} />
    </>
  );
}
