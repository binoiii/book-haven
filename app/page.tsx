import { prisma } from "@/server/db";
import { BookGrid } from "@/components/features/BookGrid";
import { BrowseSectionHeader } from "@/components/features/BrowseSectionHeader";

export default async function Home() {
  const books = await prisma.book.findMany({ orderBy: { id: "asc" } });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-4 md:mb-10">
        <h1 className="sr-only">BookHaven — Online Bookstore</h1>
        <h2 className="font-serif text-3xl leading-[30px] text-gray-900 sm:text-4xl/9 md:text-5xl/12">
          Let's start your <span className="text-orange-400">next chapter</span>
          <br />
          today.
        </h2>
      </div>
      <BrowseSectionHeader count={books.length} />
      <BookGrid books={books} />
    </main>
  );
}
