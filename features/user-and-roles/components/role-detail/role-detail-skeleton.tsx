import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Skeleton loading component for role detail page
 */
export function RoleDetailSkeleton() {
  return (
    <div className="flex flex-1 flex-col p-6">
      <div
        className="backdrop-blur-2xl border border-input rounded-3xl flex flex-col h-full"
        style={{ background: "var(--glass-bg)" }}
      >
        {/* Header Skeleton */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="size-10 rounded-xl" />
              <div className="flex items-center gap-3">
                <Skeleton className="size-11 rounded-lg" />
                <div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 p-6 space-y-6">
          {/* Overview Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={`overview-skeleton-${i}`}>
                    <Skeleton className="h-3 w-20 mb-2" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-border/50">
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Permissions Card Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`permission-group-skeleton-${i}`}
                    className="rounded-lg border border-border/50 p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Skeleton className="size-8 rounded-md" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[...Array(4)].map((_, j) => (
                        <Skeleton key={`permission-skeleton-${i}-${j}`} className="h-5 w-16" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
