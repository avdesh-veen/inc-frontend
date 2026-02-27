'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { WorkType } from '@/features/settings/types/work-types';
import {
  CATEGORY_COLORS,
  COMPLEXITY_LEVEL_DISPLAY,
} from '@/features/settings/types/work-types';
import {
  useWorkTypes,
  useToggleWorkTypeStatus,
} from '@/features/settings/hooks/use-work-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TablePagination } from '@/components/shared/table-pagination';
import { appRoutes } from '@/lib/constants/navigation';
import { WorkTypeUsageStatsDialog } from './work-type-usage-stats-dialog';
import { useWorkTypesContext } from './work-types-context';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  PencilEdit01Icon,
  Analytics02Icon,
  CheckmarkCircle01Icon,
  UnavailableIcon,
} from '@hugeicons/core-free-icons';

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} mins`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs} hr ${mins} mins` : `${hrs} hr`;
}

export function WorkTypesGrid() {
  const router = useRouter();
  const { filters, updateFilters } = useWorkTypesContext();
  const toggleStatusMutation = useToggleWorkTypeStatus();

  const { data: workTypesResponse, isLoading, isFetching } = useWorkTypes(filters);

  const workTypes = workTypesResponse?.data?.items ?? [];
  const pagination = workTypesResponse?.data?.meta;

  const [usageStatsDialogOpen, setUsageStatsDialogOpen] = React.useState(false);
  const [workTypeForStats, setWorkTypeForStats] = React.useState<WorkType | null>(null);

  const currentSortField = React.useMemo(
    () => (filters.sort.startsWith('-') ? filters.sort.slice(1) : filters.sort),
    [filters.sort],
  );

  const isDesc = React.useMemo(() => filters.sort.startsWith('-'), [filters.sort]);

  const getComplexityColor = React.useCallback((complexity: string) => {
    const map: Record<string, string> = {
      low: 'emerald',
      medium: 'amber',
      high: 'rose',
    };
    return map[complexity] ?? 'slate';
  }, []);

  const handleSort = React.useCallback(
    (column: string) => {
      const newSort = currentSortField === column
        ? isDesc ? column : `-${column}`
        : column;
      updateFilters({ sort: newSort });
    },
    [currentSortField, isDesc, updateFilters],
  );

  const handlePageChange = React.useCallback(
    (page: number) => updateFilters({ page }),
    [updateFilters],
  );

  const handleEdit = React.useCallback(
    (workType: WorkType) => router.push(appRoutes.settings.workflow.editWorkType(workType.id)),
    [router],
  );

  const handleDuplicate = React.useCallback((workType: WorkType) => {
    setWorkTypeForStats(workType);
    setUsageStatsDialogOpen(true);
  }, []);

  const handleCloseUsageStats = React.useCallback(() => {
    setUsageStatsDialogOpen(false);
    setWorkTypeForStats(null);
  }, []);

  const handleToggleStatus = React.useCallback(
    async (workType: WorkType) => {
      await toggleStatusMutation.mutateAsync({ id: workType.id, isActive: !workType.isActive });
    },
    [toggleStatusMutation],
  );

  const getSortIcon = React.useCallback(
    (column: string) => {
      if (currentSortField !== column) {
        return (
          <svg className="w-3 h-3 text-text-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        );
      }
      return isDesc ? (
        <svg className="w-3 h-3 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      ) : (
        <svg className="w-3 h-3 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    },
    [currentSortField, isDesc],
  );

  if (isLoading) {
    return (
      <div className="rounded-xl bg-glass-bg border border-glass-border p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl bg-glass-bg border border-glass-border p-6">
      {isFetching && (
        <div className="absolute top-2 right-2 z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-300 text-xs">
            <Spinner className="w-3 h-3" />
            Loading...
          </div>
        </div>
      )}

      <Table variant="secondary">
        <TableHeader className="border-b border-border-10 bg-transparent h-auto">
          <TableRow className="hover:bg-transparent border-0">
            <TableHead className="px-2 py-2 text-xs cursor-pointer" onClick={() => handleSort('name')}>
              <span className="flex items-center gap-1">Work Type {getSortIcon('name')}</span>
            </TableHead>
            <TableHead className="px-2 py-2 text-xs cursor-pointer" onClick={() => handleSort('category')}>
              <span className="flex items-center gap-1">Category {getSortIcon('category')}</span>
            </TableHead>
            <TableHead className="px-2 py-2 text-xs cursor-pointer" onClick={() => handleSort('expectedDuration')}>
              <span className="flex items-center gap-1">Duration {getSortIcon('expectedDuration')}</span>
            </TableHead>
            <TableHead className="px-2 py-2 text-xs cursor-pointer" onClick={() => handleSort('complexityLevel')}>
              <span className="flex items-center gap-1">Complexity {getSortIcon('complexityLevel')}</span>
            </TableHead>
            <TableHead className="px-2 py-2 text-xs">Requires</TableHead>
            <TableHead className="px-2 py-2 text-xs cursor-pointer" onClick={() => handleSort('isActive')}>
              <span className="flex items-center gap-1">Status {getSortIcon('isActive')}</span>
            </TableHead>
            <TableHead className="px-2 py-2 text-xs">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {workTypes.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={7} className="px-2 py-12 text-center text-text-50">
                No work types found
              </TableCell>
            </TableRow>
          ) : (
            workTypes.map((workType) => {
              const categoryColor =
                CATEGORY_COLORS[workType.category.name as keyof typeof CATEGORY_COLORS] ?? 'slate';
              const complexityColor = getComplexityColor(workType.complexityLevel);

              return (
                <TableRow
                  key={workType.id}
                  className="border-border-5 hover:bg-glass-bg transition-colors"
                >
                  <TableCell className="px-2 py-3">
                    <div className="font-medium text-foreground">{workType.name}</div>
                    {workType.shortName && (
                      <div className="text-xs text-text-50">{workType.shortName}</div>
                    )}
                  </TableCell>

                  <TableCell className="px-2 py-3">
                    <span className={`px-2 py-1 rounded-lg text-xs bg-${categoryColor}-500/20 text-${categoryColor}-300`}>
                      {workType.category.name}
                    </span>
                  </TableCell>

                  <TableCell className="px-2 py-3">
                    {formatDuration(workType.expectedDuration)}
                  </TableCell>

                  <TableCell className="px-2 py-3">
                    <span className={`px-2 py-1 rounded-lg text-xs bg-${complexityColor}-500/20 text-${complexityColor}-300`}>
                      {COMPLEXITY_LEVEL_DISPLAY[workType.complexityLevel]}
                    </span>
                  </TableCell>

                  <TableCell className="px-2 py-3">
                    <div className="flex flex-wrap gap-1">
                      {workType.providerSignature && (
                        <span className="px-2 py-0.5 rounded text-xs bg-glass-bg border border-border-10 text-text-70">
                          Provider Signature
                        </span>
                      )}
                      {workType.psvRequired && (
                        <span className="px-2 py-0.5 rounded text-xs bg-glass-bg border border-border-10 text-text-70">
                          PSV
                        </span>
                      )}
                      {!workType.providerSignature && !workType.psvRequired && (
                        <span className="text-xs text-text-50">—</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="px-2 py-3">
                    <Badge variant={workType.isActive ? 'tertiaryLight' : 'destructiveLight'}>
                      {workType.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-2 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-text-50 hover:text-foreground hover:bg-glass-bg"
                        title="Edit"
                        onClick={() => handleEdit(workType)}
                      >
                        <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={toggleStatusMutation.isPending}
                        className={`size-7 hover:bg-glass-bg ${
                          workType.isActive
                            ? 'text-amber-400 hover:text-amber-300'
                            : 'text-emerald-400 hover:text-emerald-300'
                        }`}
                        title={workType.isActive ? 'Deactivate' : 'Activate'}
                        onClick={() => handleToggleStatus(workType)}
                      >
                        <HugeiconsIcon
                          icon={workType.isActive ? UnavailableIcon : CheckmarkCircle01Icon}
                          size={16}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-text-50 hover:text-foreground hover:bg-glass-bg"
                        title="Usage Stats"
                        onClick={() => handleDuplicate(workType)}
                      >
                        <HugeiconsIcon icon={Analytics02Icon} size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <TablePagination
        meta={pagination}
        label="work types"
        onPageChange={handlePageChange}
      />

      <WorkTypeUsageStatsDialog
        open={usageStatsDialogOpen}
        workType={workTypeForStats}
        onClose={handleCloseUsageStats}
      />
    </div>
  );
}
