/**
 * Stats Grid Component (Client)
 * 
 * Displays key metrics for work types including total count,
 * active count, categories count, and average duration.
 * Uses server-side prefetched data via useWorkTypeStatistics hook.
 */

import * as React from 'react';
import { useWorkTypeStatistics } from '../../hooks/use-work-types';

export function StatsGrid() {
  const { data: statsResponse, isLoading, isError } = useWorkTypeStatistics();
  
  const stats = statsResponse?.data;

  // Loading state
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl bg-glass-bg backdrop-blur-2xl border border-glass-border p-6 animate-pulse">
            <div className="h-4 bg-border-10 rounded w-24 mb-2"></div>
            <div className="h-8 bg-border-10 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (isError || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl bg-glass-bg backdrop-blur-2xl border border-glass-border p-6">
            <p className="text-xs text-text-50 mb-1">—</p>
            <p className="text-2xl font-bold text-foreground">—</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Work Types */}
      <div className="rounded-xl bg-glass-bg backdrop-blur-2xl border border-glass-border p-6">
        <p className="text-xs text-text-50 mb-1">Total Work Types</p>
        <p className="text-2xl font-bold text-foreground">{stats.totalWorkTypes}</p>
      </div>

      {/* Active */}
      <div className="rounded-xl bg-glass-bg backdrop-blur-2xl border border-glass-border p-6">
        <p className="text-xs text-text-50 mb-1">Active</p>
        <p className="text-2xl font-bold text-emerald-400">{stats.activeWorkTypes}</p>
      </div>

      {/* Categories */}
      <div className="rounded-xl bg-glass-bg backdrop-blur-2xl border border-glass-border p-6">
        <p className="text-xs text-text-50 mb-1">Categories</p>
        <p className="text-2xl font-bold text-violet-400">{stats.workTypeCategoriesCount}</p>
      </div>

      {/* Avg Duration */}
      <div className="rounded-xl bg-glass-bg backdrop-blur-2xl border border-glass-border p-6">
        <p className="text-xs text-text-50 mb-1">Avg Duration</p>
        <p className="text-2xl font-bold text-cyan-400">
          {stats.averageDuration} <span className="text-sm">mins</span>
        </p>
      </div>
    </div>
  );
}
