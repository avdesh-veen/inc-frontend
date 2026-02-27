/**
 * TriggerEventFilters Component
 *
 * Filter tabs for trigger events with count badges.
 * Uses shadcn/ui Tabs component for consistent styling.
 */

'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { FlashIcon, Tap01Icon, Clock01Icon } from '@hugeicons/core-free-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type FilterType = 'all' | 'system' | 'manual' | 'scheduled';

interface FilterMetrics {
  total: number;
  system: number;
  manual: number;
  scheduled: number;
}

export interface TriggerEventFiltersProps {
  /**
   * Currently active filter
   */
  activeFilter: FilterType;

  /**
   * Callback when filter changes
   */
  onFilterChange: (filter: FilterType) => void;

  /**
   * Metrics for each filter type
   */
  metrics: FilterMetrics;

  /**
   * Callback for add button click
   */
  onAddClick: () => void;

  /**
   * Optional className for additional styling
   */
  className?: string;
}

const filterConfig: Array<{
  value: FilterType;
  label: string;
  icon?: typeof FlashIcon;
  metricKey: keyof FilterMetrics;
}> = [
    { value: 'all', label: 'All Events', metricKey: 'total' },
    { value: 'system', label: 'System', icon: FlashIcon, metricKey: 'system' },
    { value: 'manual', label: 'Manual', icon: Tap01Icon, metricKey: 'manual' },
    { value: 'scheduled', label: 'Scheduled', icon: Clock01Icon, metricKey: 'scheduled' },
  ];

export function TriggerEventFilters({
  activeFilter,
  onFilterChange,
  metrics,
  className,
}: Readonly<TriggerEventFiltersProps>) {
  return (
    <div className={cn('flex items-center justify-between gap-2 border-b border-white/10 pb-4', className)}>
      <div className="flex min-w-0 gap-1">
        {filterConfig.map((filter) => {
          const isActive = activeFilter === filter.value;
          
          return (
            <Button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              variant={isActive ? 'tertiary' : 'muted'}
              className="shrink-0 gap-1.5 cursor-pointer"
            >
              {filter.icon && (
                <HugeiconsIcon
                  icon={filter.icon}
                  className="size-3.5"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              )}
              {filter.label} ({metrics[filter.metricKey]})
            </Button>
          );
        })}
      </div>
    </div>
  );
}
