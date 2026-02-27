

import { Skeleton } from '@/components/ui/skeleton';

export function WorkTypesMetricsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-xl bg-glass-bg backdrop-blur-[var(--glass-blur)] border border-glass-border p-6">
          <Skeleton className="h-3 w-24 mb-3" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

export function CategoryGridSkeleton() {
  return (
    <div className="rounded-xl bg-glass-bg backdrop-blur-[var(--glass-blur)] border border-glass-border p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div
            key={i}
            className="p-3 rounded-xl bg-white/5 border border-white/10"
            style={{ minHeight: '70px' }}
          >
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-8 rounded-full" />
            </div>
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function WorkTypesGridSkeleton() {
  return (
    <div className="rounded-xl bg-glass-bg backdrop-blur-[var(--glass-blur)] border border-glass-border p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-10">
              <th className="px-2 py-2 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
              <th className="px-2 py-2 text-left">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="px-2 py-2 text-left">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="px-2 py-2 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
              <th className="px-2 py-2 text-left">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="px-2 py-2 text-left">
                <Skeleton className="h-4 w-12" />
              </th>
              <th className="px-2 py-2 text-left">
                <Skeleton className="h-4 w-16" />
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <tr key={i} className="border-b border-border-5">
                <td className="px-2 py-3">
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </td>
                <td className="px-2 py-3">
                  <Skeleton className="h-6 w-24 rounded-lg" />
                </td>
                <td className="px-2 py-3">
                  <Skeleton className="h-5 w-16" />
                </td>
                <td className="px-2 py-3">
                  <Skeleton className="h-6 w-16 rounded-lg" />
                </td>
                <td className="px-2 py-3">
                  <div className="flex flex-wrap gap-1">
                    <Skeleton className="h-6 w-20 rounded" />
                    <Skeleton className="h-6 w-16 rounded" />
                  </div>
                </td>
                <td className="px-2 py-3">
                  <Skeleton className="h-6 w-11 rounded-full" />
                </td>
                <td className="px-2 py-3">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function WorkTypesPageSkeleton() {
  return (
    <div className="space-y-6">
      <WorkTypesMetricsSkeleton />
      <CategoryGridSkeleton />
      <WorkTypesGridSkeleton />
    </div>
  );
}
