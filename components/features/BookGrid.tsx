import { BookCard } from "@/components/features/BookCard";
import type { Book } from "@/lib/generated/prisma";

type BookGridProps = {
  books: Book[];
};

export function BookGrid({ books }: BookGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
