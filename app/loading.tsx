import { Skeleton } from "@/components/ui/skeleton";
import { BookGridSkeleton } from "@/components/features/BookGridSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-4 md:mb-10">
        <Skeleton className="h-12 w-72 mb-3" />
        <Skeleton className="h-12 w-48" />
      </div>
      <BookGridSkeleton />
    </main>
  );
}
