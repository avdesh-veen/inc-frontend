

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useWorkCategories } from '../../hooks/use-work-categories';
import { appRoutes } from '@/lib/constants/navigation';
import { useWorkTypesContext } from './work-types-context';

export function WorkTypesFilters() {
  const router = useRouter();
  const { filters, updateFilters } = useWorkTypesContext();
  const { data: categoriesResponse } = useWorkCategories({limit: 100, page: 1});
  
  const categories = categoriesResponse?.data?.items || [];
  const currentCategory = filters.categoryId || 'all';

  // Update category filter - instant response
  const handleCategoryChange = React.useCallback((categoryId: string) => {
    updateFilters({
      categoryId: categoryId === 'all' ? undefined : categoryId,
    });
  }, [updateFilters]);

  // Handle create
  const handleCreate = React.useCallback(() => {
    router.push(appRoutes.settings.workflow.newWorkType);
  }, [router]);

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
      <h3 className="text-base font-bold text-foreground whitespace-nowrap">All Work Types</h3>
      <div className="flex items-center gap-2 shrink-0">
        <select
          value={currentCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-glass-bg border border-border-10 text-sm text-foreground focus:border-violet-500 focus:outline-none cursor-pointer [&>option]:bg-background [&>option]:text-foreground whitespace-nowrap max-w-[140px] truncate"
          style={{ colorScheme: 'dark' }}
        >
          <option value="all" className="bg-background text-foreground">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id} className="bg-background text-foreground">
              {category.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleCreate}
          className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm hover:bg-emerald-500/30 transition-colors whitespace-nowrap shrink-0"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Work Type
        </button>
      </div>
    </div>
  );
}
