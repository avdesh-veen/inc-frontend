/**
 * Work Types Filter Context
 * 
 * Provides shared filter state between WorkTypesFilters and WorkTypesGrid
 * without using URL navigation for instant UI updates.
 */

'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';

interface WorkTypesFilters {
  categoryId?: string;
  sort: string;
  page: number;
  limit: number;
}

interface WorkTypesContextValue {
  filters: WorkTypesFilters;
  updateFilters: (updates: Partial<WorkTypesFilters>) => void;
  isFetching: boolean;
  setIsFetching: (fetching: boolean) => void;
}

const WorkTypesContext = React.createContext<WorkTypesContextValue | null>(null);

export function WorkTypesProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  
  // Initialize state from URL params (only on mount)
  const [filters, setFilters] = React.useState<WorkTypesFilters>(() => ({
    categoryId: searchParams.get('categoryId') || undefined,
    sort: searchParams.get('sort') || 'name',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '50'),
  }));

  const [isFetching, setIsFetching] = React.useState(false);

  // Update URL in background (non-blocking) for bookmarking/sharing
  const updateUrlRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  React.useEffect(() => {
    if (updateUrlRef.current) {
      clearTimeout(updateUrlRef.current);
    }
    
    // Debounce URL updates (doesn't affect UI)
    updateUrlRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (filters.categoryId) params.set('categoryId', filters.categoryId);
      if (filters.sort !== 'name') params.set('sort', filters.sort);
      if (filters.page !== 1) params.set('page', filters.page.toString());
      if (filters.limit !== 50) params.set('limit', filters.limit.toString());
      
      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }, 300);

    return () => {
      if (updateUrlRef.current) {
        clearTimeout(updateUrlRef.current);
      }
    };
  }, [filters]);

  // Update filters - instant UI response
  const updateFilters = React.useCallback((updates: Partial<WorkTypesFilters>) => {
    setFilters(prev => {
      const newFilters = { ...prev, ...updates };
      
      // Reset to page 1 when filters change (except when changing page itself)
      if (!('page' in updates) && !('limit' in updates)) {
        newFilters.page = 1;
      }
      
      return newFilters;
    });
  }, []);

  const value = React.useMemo(
    () => ({
      filters,
      updateFilters,
      isFetching,
      setIsFetching,
    }),
    [filters, updateFilters, isFetching]
  );

  return (
    <WorkTypesContext.Provider value={value}>
      {children}
    </WorkTypesContext.Provider>
  );
}

export function useWorkTypesContext() {
  const context = React.useContext(WorkTypesContext);
  if (!context) {
    throw new Error('useWorkTypesContext must be used within WorkTypesProvider');
  }
  return context;
}
