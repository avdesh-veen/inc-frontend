import { Skeleton } from "@/components/ui/skeleton";

export function TableLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-9 flex-1" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-[24px] border overflow-hidden">
        {/* Table Header */}
        <div className="border-b bg-muted/50 p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-7 flex-1" />
            <Skeleton className="h-7 flex-1" />
            <Skeleton className="h-7 flex-1" />
            <Skeleton className="h-7 flex-1" />
            <Skeleton className="h-7 flex-1" />
            <Skeleton className="h-7 flex-1" />
          </div>
        </div>

        {/* Table Rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`table-row-skeleton-${i}`} className="border-b p-4 last:border-0">
            <div className="flex items-center gap-4">
              <Skeleton className="h-7 flex-1" />
              <Skeleton className="h-7 flex-1" />
              <Skeleton className="h-7 flex-1" />
              <Skeleton className="h-7 flex-1" />
              <Skeleton className="h-7 flex-1" />
              <Skeleton className="h-7 flex-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-56" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-10" />
          <Skeleton className="h-9 w-10" />
          <Skeleton className="h-9 w-10" />
          <Skeleton className="h-9 w-10" />
        </div>
      </div>
    </div>
  );
}
