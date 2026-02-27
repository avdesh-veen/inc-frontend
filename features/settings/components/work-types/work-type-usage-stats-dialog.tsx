/**
 * WorkTypeUsageStatsDialog Component
 * 
 * Displays usage statistics for a work type including times used,
 * average duration, efficiency, expected duration, and complexity level.
 */

'use client';

import * as React from 'react';
import type { WorkType } from '@/features/settings/types/work-types';
import { useWorkTypeUsageStatistics } from '@/features/settings/hooks/use-work-types';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface WorkTypeUsageStatsDialogProps {
  open: boolean;
  workType: WorkType | null;
  onClose: () => void;
}

export function WorkTypeUsageStatsDialog({
  open,
  workType,
  onClose,
}: Readonly<WorkTypeUsageStatsDialogProps>) {
  // Fetch usage statistics from API
  const { data: statsResponse, isLoading, isError } = useWorkTypeUsageStatistics(
    workType?.id ?? '',
    open && !!workType?.id
  );

  const usageStats = statsResponse?.data;

  const formatDuration = (minutes: number): string => {
    return `${minutes}m`;
  };

  const getEfficiencyColor = (efficiency: number): string => {
    if (efficiency >= 100) return 'text-emerald-400';
    if (efficiency >= 80) return 'text-cyan-400';
    if (efficiency >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getComplexityLabel = (complexity: string): string => {
    const labels: Record<string, string> = {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
    };
    return labels[complexity] || complexity;
  };

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent className="!max-w-2xl">
        <AlertDialogHeader className="relative">
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 p-2 rounded-lg hover:bg-glass-bg text-text-50 hover:text-foreground transition-colors"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <AlertDialogTitle className="text-2xl font-bold text-foreground mb-8">
            Usage Statistics
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-6">
          {/* Work Type Name */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-1">
              {workType?.name || usageStats?.workTypeName || 'Work Type'}
            </h3>
            <p className="text-sm text-text-50">
              {workType?.shortName || ''}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
              <p className="text-sm text-text-50 mt-4">Loading statistics...</p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-8">
              <div className="text-rose-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-sm text-text-50">Failed to load usage statistics</p>
            </div>
          )}

          {/* Data State */}
          {!isLoading && !isError && usageStats && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                {/* Times Used */}
                <div className="rounded-xl bg-glass-bg border border-border-10 p-6 text-center">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">
                    {usageStats.timesUsed}
                  </div>
                  <div className="text-sm text-text-50">Times Used</div>
                </div>

                {/* Average Duration */}
                <div className="rounded-xl bg-glass-bg border border-border-10 p-6 text-center">
                  <div className="text-4xl font-bold text-violet-400 mb-2">
                    {formatDuration(usageStats.averageDuration)}
                  </div>
                  <div className="text-sm text-text-50">Avg. Duration</div>
                </div>

                {/* Efficiency */}
                <div className="rounded-xl bg-glass-bg border border-border-10 p-6 text-center">
                  <div className={`text-4xl font-bold mb-2 ${getEfficiencyColor(usageStats.efficiencyPercentage)}`}>
                    {usageStats.efficiencyPercentage}%
                  </div>
                  <div className="text-sm text-text-50">Efficiency</div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="rounded-xl bg-glass-bg border border-border-10 p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">Expected :</span>
                  <span className="text-sm text-text-70">
                    {usageStats.expectedDuration} minutes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">Complexity :</span>
                  <span className="text-sm text-text-70">
                    {getComplexityLabel(usageStats.complexityLevel)}
                  </span>
                </div>
              </div>

              {/* Footer Note */}
              <p className="text-xs text-center text-text-50">
                Data from last 30 days (simulated)
              </p>
            </>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="min-w-[120px]"
            >
              Close
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
