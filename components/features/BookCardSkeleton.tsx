import { Skeleton } from "@/components/ui/skeleton";

export function BookCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-gradient-to-br from-gray-200 to-gray-300">
      <Skeleton className="h-48 w-full rounded-none bg-white/40" />
      <div className="flex flex-1 flex-col gap-1 bg-white/5 p-3">
        <Skeleton className="h-2 w-10 bg-white/40" />
        <Skeleton className="mt-1 h-4 w-3/4 bg-white/40" />
        <Skeleton className="h-3 w-1/2 bg-white/40" />
        <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-4 w-10 bg-white/40" />
          <Skeleton className="h-[30px] w-full rounded-full bg-white/40 sm:w-24" />
        </div>
      </div>
    </div>
  );
}
