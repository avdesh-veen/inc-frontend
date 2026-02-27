/**
 * SLA Rules Loading Skeletons
 * 
 * Reusable skeleton components for SLA Rules sections
 */

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/**
 * SLA Targets Section Skeleton
 */
export function SLATargetsSkeleton() {
  return (
    <div className="rounded-xl bg-glass-bg backdrop-blur-(--glass-blur) border border-glass-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Table */}
      <div className="rounded-md border border-border-10 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border-10 hover:bg-transparent">
              <TableHead className="text-xs font-bold text-text-50 uppercase">Request Type</TableHead>
              <TableHead className="text-xs font-bold text-text-50 uppercase">Target Days</TableHead>
              <TableHead className="text-xs font-bold text-text-50 uppercase">Warning at</TableHead>
              <TableHead className="text-xs font-bold text-text-50 uppercase">Critical at</TableHead>
              <TableHead className="text-xs font-bold text-text-50 uppercase">Status</TableHead>
              <TableHead className="text-xs font-bold text-text-50 uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={`skeleton-${i}`} className="border-b border-border-5">
                <TableCell className="px-4 py-4">
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell className="px-4 py-4">
                  <Skeleton className="h-8 w-28" />
                </TableCell>
                <TableCell className="px-4 py-4">
                  <Skeleton className="h-8 w-28" />
                </TableCell>
                <TableCell className="px-4 py-4">
                  <Skeleton className="h-8 w-28" />
                </TableCell>
                <TableCell className="px-4 py-4">
                  <Skeleton className="h-6 w-12" />
                </TableCell>
                <TableCell className="px-4 py-4">
                  <Skeleton className="h-4 w-4" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-4">
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}

/**
 * SLA Override Section Skeleton
 */
export function SLAOverrideSkeleton() {
  return (
    <div className="rounded-xl bg-glass-bg backdrop-blur-(--glass-blur) border border-glass-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <Skeleton className="h-6 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Priority Hierarchy Banner */}
      <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <Skeleton className="h-4 w-56 mb-2" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`priority-${i}`} className="h-10 w-full" />
          ))}
        </div>
      </div>

      {/* Override Table */}
      <div className="rounded-md border border-border-10 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border-10 hover:bg-transparent">
              <TableHead className="text-xs font-bold text-text-50 uppercase">Scope</TableHead>
              <TableHead className="text-xs font-bold text-text-50 uppercase">Request Type</TableHead>
              <TableHead className="text-xs font-bold text-text-50 uppercase">Target</TableHead>
              <TableHead className="text-xs font-bold text-text-50 uppercase">Warning</TableHead>
              <TableHead className="text-xs font-bold text-text-50 uppercase">Critical</TableHead>
              <TableHead className="text-xs font-bold text-text-50 uppercase">Reason</TableHead>
              <TableHead className="text-xs font-bold text-text-50 uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={`skeleton-${i}`} className="border-b border-border-5">
                <TableCell className="px-3 py-3">
                  <Skeleton className="h-6 w-32" />
                </TableCell>
                <TableCell className="px-3 py-3">
                  <Skeleton className="h-4 w-36" />
                </TableCell>
                <TableCell className="px-3 py-3">
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell className="px-3 py-3">
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell className="px-3 py-3">
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell className="px-3 py-3">
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/**
 * Escalation Rules Section Skeleton
 */
export function EscalationRulesSkeleton() {
  return (
    <div className="rounded-xl bg-glass-bg backdrop-blur-(--glass-blur) border border-glass-border p-6">
      {/* Header */}
      <Skeleton className="h-6 w-48 mb-4" />

      {/* Rules Grid */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className="flex items-center justify-between p-4 rounded-xl bg-glass-bg border border-border-5"
          >
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-3 w-96" />
            </div>
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * FPR Metrics Section Skeleton
 */
export function FPRMetricsSkeleton() {
  return (
    <div className="rounded-xl bg-glass-bg backdrop-blur-(--glass-blur) border border-glass-border p-6">
      {/* Header */}
      <Skeleton className="h-6 w-64 mb-2" />
      <Skeleton className="h-4 w-full max-w-2xl mb-4" />

      {/* 2-Column Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Target Rates */}
        <div>
          <Skeleton className="h-5 w-32 mb-3" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`rate-${i}`}
                className="flex items-center justify-between p-3 rounded-xl bg-glass-bg border border-border-5"
              >
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Right Column - Track By */}
        <div>
          <Skeleton className="h-5 w-24 mb-3" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`dimension-${i}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-glass-bg border border-border-5"
              >
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Performance Banner */}
      <div className="mt-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`perf-${i}`} className="text-center space-y-2">
              <Skeleton className="h-8 w-16 mx-auto" />
              <Skeleton className="h-3 w-24 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Full Page Skeleton - All Sections
 */
export function SLARulesPageSkeleton() {
  return (
    <div className="space-y-6">
      <SLATargetsSkeleton />
      <SLAOverrideSkeleton />
      <EscalationRulesSkeleton />
      <FPRMetricsSkeleton />
    </div>
  );
}
