import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DecisionTableTabSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full rounded-xl" />

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={`decision-row-${i}`} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    </div>
  );
}
