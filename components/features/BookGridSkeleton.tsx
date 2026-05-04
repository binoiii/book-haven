import { Skeleton } from "@/components/ui/skeleton";
import { BookCardSkeleton } from "@/components/features/BookCardSkeleton";

export function BookGridSkeleton() {
  return (
    <>
      <Skeleton className="my-8 h-3 w-44" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
