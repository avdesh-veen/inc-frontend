import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const WORKFLOW_SKELETON_ROW_KEYS = [
  "workflow-skeleton-1",
  "workflow-skeleton-2",
  "workflow-skeleton-3",
  "workflow-skeleton-4",
] as const;

export function ApprovalWorkflowsTabSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row gap-2 items-center justify-between">
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-2">
            {WORKFLOW_SKELETON_ROW_KEYS.map((key) => (
              <Skeleton key={key} className="h-20 w-full" />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-64" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
