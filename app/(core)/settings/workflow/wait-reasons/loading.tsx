import { Skeleton } from "@/components/ui/skeleton";

const STAT_CARD_IDS = ["stat-a", "stat-b", "stat-c", "stat-d"] as const;
const TABLE_ROW_IDS = ["row-a", "row-b", "row-c", "row-d", "row-e"] as const;

export default function WaitReasonsLoading() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-5 w-5 mt-0.5 shrink-0 rounded" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-full max-w-md" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {STAT_CARD_IDS.map((id) => (
          <div key={id} className="rounded-xl border bg-card p-4 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-12" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-1">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-full max-w-lg" />
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-9 w-36 rounded" />
        </div>

        <div className="rounded-md border">
          <div className="border-b bg-muted/50 p-4">
            <div className="grid grid-cols-7 gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>

          {TABLE_ROW_IDS.map((id) => (
            <div key={id} className="border-b p-4 last:border-0">
              <div className="grid grid-cols-7 gap-4 items-center">
                <Skeleton className="h-6 w-20 rounded" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-6 w-16 rounded-lg" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
