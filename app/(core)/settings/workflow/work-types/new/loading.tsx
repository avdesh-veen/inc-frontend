import { Skeleton } from "@/components/ui/skeleton";

export default function NewWorkTypeLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <div className="p-6 rounded-[24px] border border-white/6 bg-white/3 backdrop-blur-2xl">
        {/* Header skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-7 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        {/* Form sections skeleton */}
        <div className="space-y-6 mt-6">
          {/* Basic Information */}
          <div className="rounded-xl border border-glass-border p-6">
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Time & Complexity */}
          <div className="rounded-xl border border-glass-border p-6">
            <Skeleton className="h-4 w-40 mb-4" />
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}
