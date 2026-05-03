import { BookCard } from "@/components/features/BookCard";
import type { Book } from "@/lib/generated/prisma";
import { CARD_COLORS } from "@/constants/ui";

type BookGridProps = {
  books: Book[];
};

export function BookGrid({ books }: BookGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {books.map((book, index) => (
        <BookCard key={book.id} book={book} cardColor={CARD_COLORS[index % CARD_COLORS.length]} />
      ))}
    </div>
  );
}
