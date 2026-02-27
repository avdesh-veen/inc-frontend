import { Skeleton } from "@/components/ui/skeleton";

const SUMMARY_CARD_IDS = ["summary-a", "summary-b", "summary-c", "summary-d", "summary-e"] as const;
const TABLE_ROW_IDS = ["row-a", "row-b", "row-c", "row-d", "row-e", "row-f", "row-g", "row-h"] as const;

export default function TriggerEventsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Page Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="mt-4 space-y-4">
        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 p-1">
          {SUMMARY_CARD_IDS.map((id) => (
            <div key={id} className="rounded-lg border bg-card p-4 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>

        {/* Info Banner Skeleton */}
        <div className="rounded-lg border bg-primary/5 p-4 mx-1">
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mt-1" />
        </div>

        {/* Table Controls Skeleton */}
        <div className="flex items-center gap-4 px-1">
          <Skeleton className="h-10 flex-1 max-w-sm" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Table Skeleton */}
        <div className="rounded-md border mx-1">
          {/* Table Header */}
          <div className="border-b bg-muted/50 p-4">
            <div className="grid grid-cols-[1fr_150px_120px_120px_80px_80px] gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>

          {/* Table Rows */}
          {TABLE_ROW_IDS.map((id) => (
            <div key={id} className="border-b p-4 last:border-0">
              <div className="grid grid-cols-[1fr_150px_120px_120px_80px_80px] gap-4">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between px-1">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      </div>
    </div>
  );
}
