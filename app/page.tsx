import { Suspense } from "react";
import { BookCatalog } from "@/components/features/BookCatalog";
import { BookGridSkeleton } from "@/components/features/BookGridSkeleton";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-4 md:py-8">
      <div className="mb-4 md:mb-10">
        <h1 className="sr-only">BookHaven — Online Bookstore</h1>
        <h2 className="font-serif text-3xl leading-[30px] font-semibold text-gray-900 sm:text-4xl/9 md:text-5xl/12">
          Let&apos;s start your <span className="text-orange-400">next chapter</span>
          <br />
          today.
        </h2>
      </div>
      <Suspense fallback={<BookGridSkeleton />}>
        <BookCatalog />
      </Suspense>
    </main>
  );
}
