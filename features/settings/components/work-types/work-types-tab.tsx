/**
 * Work Types Tab Component (Client)
 * 
 * Main tab component that orchestrates the work types view.
 * Client component that composes stats, filters, categories, and grid.
 * Follows user-and-roles pattern.
 */

'use client';

import { StatsGrid } from './stats-grid';
import { CategoryGrid } from './category-grid';
import { WorkTypesGrid } from './work-types-grid';
import { WorkTypesFilters } from './work-types-filters';
import { WorkTypeFooter } from './work-type-footer';
import { WorkTypesProvider } from './work-types-context';

export function WorkTypesTab() {
  return (
    <WorkTypesProvider>
      <div className="space-y-6">
        {/* Metrics dashboard */}
        <StatsGrid />

        {/* Category cards */}
        <CategoryGrid />

        {/* Filters */}
        <div className="rounded-xl bg-glass-bg backdrop-blur-[var(--glass-blur)] border border-glass-border p-6">
          <WorkTypesFilters />
        </div>

        {/* Work types table/grid */}
        <WorkTypesGrid />

       <WorkTypeFooter />
      </div>
    </WorkTypesProvider>
  );
}
