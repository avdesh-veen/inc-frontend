/**
 * Clients Grid Skeleton
 * 
 * Loading skeleton for the clients data grid
 */

import { Skeleton } from "@/components/ui/skeleton";

export function ClientsGridSkeleton() {
  return (
    <div className="rounded-lg border border-white/5 overflow-hidden bg-glass-bg">
      {/* Header Row */}
      <div className="grid grid-cols-[minmax(280px,2.5fr)_110px_110px_130px_110px_110px_150px_90px] gap-3 items-center py-2.5 px-4 bg-white/3 border-b border-white/5">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Client Rows */}
      <div className="divide-y divide-white/5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="grid grid-cols-[minmax(280px,2.5fr)_110px_110px_130px_110px_110px_150px_90px] gap-3 items-center py-2.5 px-4"
          >
            {/* CLIENT Column */}
            <div className="flex items-center gap-2.5 min-w-0">
              <Skeleton className="h-9 w-9 rounded-md shrink-0" />
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <Skeleton className="h-4 w-full max-w-[200px]" />
                <Skeleton className="h-3 w-full max-w-[150px]" />
              </div>
            </div>

            {/* TIER Column */}
            <div>
              <Skeleton className="h-6 w-16" />
            </div>

            {/* PROVIDERS Column */}
            <div className="flex justify-center">
              <Skeleton className="h-4 w-8" />
            </div>

            {/* EST REVENUE Column */}
            <div className="flex justify-center">
              <Skeleton className="h-4 w-16" />
            </div>

            {/* AVG TAT Column */}
            <div className="flex justify-center">
              <Skeleton className="h-4 w-16" />
            </div>

            {/* PORTAL Column */}
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="h-1.5 w-1.5 rounded-full" />
              <Skeleton className="h-6 w-16" />
            </div>

            {/* HEALTH Column */}
            <div className="flex items-center gap-2.5 px-2">
              <Skeleton className="h-1.5 flex-1" />
              <Skeleton className="h-4 w-7" />
            </div>

            {/* ACTIONS Column */}
            <div className="flex justify-center">
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
