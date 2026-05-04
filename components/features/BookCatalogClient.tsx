"use client";

import { useMemo } from "react";
import { BookOpen } from "lucide-react";
import { BookGrid } from "@/components/features/BookGrid";
import { BrowseSectionHeader } from "@/components/features/BrowseSectionHeader";
import { useSearchStore } from "@/store/searchStore";
import { UI } from "@/constants/ui";
import type { Book } from "@/lib/generated/prisma";

type BookCatalogClientProps = {
  books: Book[];
};

export function BookCatalogClient({ books }: BookCatalogClientProps) {
  const { query, clearQuery } = useSearchStore();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q),
    );
  }, [books, query]);

  const isFiltering = query.trim().length > 0;

  return (
    <>
      <div className="mb-6 mt-8">
        <BrowseSectionHeader count={filtered.length} total={isFiltering ? books.length : undefined} />
      </div>
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 py-32 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
            <BookOpen className="h-7 w-7 text-orange-400" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-serif text-xl font-semibold text-gray-900">No results found</p>
            <p className="text-muted-foreground text-sm">
              No books match &ldquo;{query.trim()}&rdquo;
            </p>
          </div>
          <button
            onClick={clearQuery}
            className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Clear search
          </button>
        </div>
      ) : (
        <BookGrid books={filtered} />
      )}
    </>
  );
}
