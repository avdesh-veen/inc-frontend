/**
 * Provider Search & Filters Component
 * 
 * Comprehensive search and filter interface with 5 filter dropdowns.
 * Uses URL searchParams for state management.
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { ProviderStatus } from '@/features/records/providers/types';
import { Client } from '@/features/records/clients/types';
import { useSearchParamsManager } from '@/hooks/use-search-params';

interface ProviderSearchFiltersProps {
  filters: {
    search: string;
    clientId: string | null;
    departmentId: string | null;
    businessEntityId: string | null;
    status: string | null;
    alert: string | null;
  };
  sort: {
    field: string;
    order: 'asc' | 'desc';
  };
}

export function ProviderSearchFilters({ filters }: ProviderSearchFiltersProps) {
  const { getParam, updateParams } = useSearchParamsManager();
  const [localSearch, setLocalSearch] = useState(filters.search);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const search = getParam('search');
  const clientId = getParam('client');
  const departmentId = getParam('department');
  const businessEntityId = getParam('businessEntity');
  const status = getParam('status');
  const alert = getParam('alert');

  // Count active filters
  const activeFiltersCount =
    (search ? 1 : 0) +
    (clientId ? 1 : 0) +
    (departmentId ? 1 : 0) +
    (businessEntityId ? 1 : 0) +
    (status ? 1 : 0) +
    (alert ? 1 : 0);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      updateParams({ search: value || null });
    }, 300);
  }, [updateParams]);

  const handleClientFilterChange = (value: string) => {
    updateParams({ client: value === 'all' ? null : value });
  };

  const handleBusinessEntityFilterChange = (value: string) => {
    updateParams({ businessEntity: value === 'all' ? null : value });
  };

  const handleDepartmentFilterChange = (value: string) => {
    updateParams({ department: value === 'all' ? null : value });
  };

  const handleStatusFilterChange = (value: string) => {
    updateParams({ status: value === 'all' ? null : value });
  };

  const handleAlertFilterChange = (value: string) => {
    updateParams({ alert: value === 'all' ? null : value });
  };

  const handleResetFilters = useCallback(() => {
    setLocalSearch('');
    updateParams({
      search: null,
      client: null,
      businessEntity: null,
      department: null,
      status: null,
      alert: null,
    });
  }, [updateParams]);

  return (
    <div className="space-y-3">
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {activeFiltersCount > 0 && `${activeFiltersCount} ${activeFiltersCount === 1 ? 'filter' : 'filters'} active`}
      </div>

      {/* First Row: Search + 4 Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[250px]">
          <HugeiconsIcon
            icon={Search01Icon}
            className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/50"
            strokeWidth={2}
            aria-hidden="true"
          />
          <Input
            type="text"
            placeholder="Search by name, NPI, or specialty..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-white/50 text-sm focus:outline-none focus:border-emerald-500/50"
            aria-label="Search providers by name, NPI, or specialty"
          />
        </div>

        <Select
          value={clientId || 'all'}
          onValueChange={handleClientFilterChange}
        >
          <SelectTrigger 
            className="w-auto min-w-[140px] px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground"
            aria-label="Filter by client"
          >
            <SelectValue placeholder="All Clients" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            <SelectItem value="1">Client 1</SelectItem>
            <SelectItem value="2">Client 2</SelectItem>
            <SelectItem value="3">Client 3</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={businessEntityId || 'all'}
          onValueChange={handleBusinessEntityFilterChange}
        >
          <SelectTrigger 
            className="w-auto min-w-[180px] px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground"
            aria-label="Filter by business entity"
          >
            <SelectValue placeholder="All Business Entities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Business Entities</SelectItem>
            <SelectItem value="be-001">BE001 - Main Office</SelectItem>
            <SelectItem value="be-002">BE002 - Satellite</SelectItem>
            <SelectItem value="be-003">BE003 - Regional</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={departmentId || 'all'}
          onValueChange={handleDepartmentFilterChange}
        >
          <SelectTrigger 
            className="w-auto min-w-[160px] px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground"
            aria-label="Filter by department"
          >
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="dept-001">Internal Medicine</SelectItem>
            <SelectItem value="dept-002">Cardiology</SelectItem>
            <SelectItem value="dept-003">Family Medicine</SelectItem>
            <SelectItem value="dept-004">Pediatrics</SelectItem>
            <SelectItem value="dept-005">Surgery</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={status || 'all'}
          onValueChange={handleStatusFilterChange}
        >
          <SelectTrigger 
            className="w-auto min-w-[120px] px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground"
            aria-label="Filter by status"
          >
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value={ProviderStatus.ACTIVE}>Active</SelectItem>
            <SelectItem value={ProviderStatus.PENDING}>Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Second Row: Alert Filter + Reset Button */}
      <div className="flex items-center gap-3">
        <Select
          value={alert || 'all'}
          onValueChange={handleAlertFilterChange}
        >
          <SelectTrigger 
            className="w-auto min-w-[120px] px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground"
            aria-label="Filter by alert type"
          >
            <SelectValue placeholder="All Alerts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Alerts</SelectItem>
            <SelectItem value="critical">Critical (&lt;45 days)</SelectItem>
            <SelectItem value="warning">Warning (&lt;90 days)</SelectItem>
            <SelectItem value="good">Good (&gt;90 days)</SelectItem>
          </SelectContent>
        </Select>

        {activeFiltersCount > 0 && (
          <Button variant="outline" onClick={handleResetFilters}>
            Reset
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  );
}
