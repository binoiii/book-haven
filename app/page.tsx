import { prisma } from "@/server/db";
import { BookGrid } from "@/components/features/BookGrid";
import { BrowseSectionHeader } from "@/components/features/BrowseSectionHeader";

export default async function Home() {
  const books = await prisma.book.findMany({ orderBy: { id: "asc" } });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="sr-only">BookHaven — Online Bookstore</h1>
      <BrowseSectionHeader count={books.length} />
      <BookGrid books={books} />
    </main>
  );
}
