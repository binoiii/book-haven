import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <Skeleton className="mb-8 h-9 w-32" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-lg border">
            <Skeleton className="h-64 w-full" />
            <div className="flex flex-col gap-2 p-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="mt-2 h-7 w-20" />
            </div>
            <div className="p-4 pt-0">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
