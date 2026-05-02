import { prisma } from "@/server/db";
import { BookGrid } from "@/components/features/BookGrid";

export default async function Home() {
  const books = await prisma.book.findMany({ orderBy: { id: "asc" } });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Books</h1>
      <BookGrid books={books} />
    </main>
  );
}
