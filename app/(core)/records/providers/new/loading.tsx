/**
 * Add Provider Loading State
 * 
 * Loading skeleton for the add provider page.
 * Route: /records/providers/new
 */

import { Skeleton } from '@/components/ui/skeleton';

export default function NewProviderLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
          {/* Header Card Skeleton */}
          <div className="rounded-xl border border-white/10 bg-white/2 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-96" />
                </div>
              </div>
              <div className="space-y-2 text-right">
                <Skeleton className="h-3 w-32 ml-auto" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-2 w-32" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Form Sections Skeleton */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Actions Skeleton */}
          <div className="flex items-center justify-between border-t border-white/10 pt-6">
            <Skeleton className="h-10 w-24" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
