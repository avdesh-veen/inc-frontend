import { Skeleton } from "@/components/ui/skeleton";
import { TableLoadingSkeleton } from "@/features/user-and-roles/components/table-loading-skeleton";

export default function UsersRolesLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      {/* Page Header Skeleton */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex flex-1 flex-col gap-6">
        {/* TabsList Skeleton */}
        <div className="inline-flex h-10 items-center justify-start gap-1 rounded-md bg-muted p-1 w-fit">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-32" />
        </div>

        {/* TabsContent Skeleton - Table Layout */}
        <TableLoadingSkeleton />
      </div>
    </div>
  );
}
