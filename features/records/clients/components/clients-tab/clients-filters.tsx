/**
 * Clients Filters
 * 
 * Search bar and filter dropdowns for client list.
 * Uses router navigation for server-side filtering.
 */

'use client';

import * as React from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClientType, ClientTier } from '@/features/records/clients/types';
import { useSearchParamsManager } from '@/hooks/use-search-params';

export function ClientsFilters() {
  const { getParam, updateParams } = useSearchParamsManager();
  const [localSearch, setLocalSearch] = React.useState(getParam('search') || '');

  const search = getParam('search');
  const type = getParam('type');
  const accountTier = getParam('accountTier');
  const portalAccess = getParam('portalAccess');

  const activeFiltersCount =
    (search ? 1 : 0) +
    (type ? 1 : 0) +
    (accountTier ? 1 : 0) +
    (portalAccess ? 1 : 0);

  const searchTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  
  const handleSearchChange = React.useCallback((value: string) => {
    setLocalSearch(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      updateParams({ search: value || null });
    }, 500);
  }, [updateParams]);

  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleFilterChange = React.useCallback((key: string, value: string) => {
    updateParams({ [key]: value === 'all' ? null : value });
  }, [updateParams]);

  const handleResetFilters = React.useCallback(() => {
    setLocalSearch('');
    updateParams({
      search: null,
      type: null,
      accountTier: null,
      portalAccess: null,
    });
  }, [updateParams]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 max-w-sm">
          <Input
            type="search"
            placeholder="Search by name, Tax ID..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={type ?? 'all'}
            onValueChange={(value) => handleFilterChange('type', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value={ClientType.LARGE}>Large Group</SelectItem>
              <SelectItem value={ClientType.MID_SIZE}>Mid-size Group</SelectItem>
              <SelectItem value={ClientType.SMALL_GROUP}>Small Group</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={accountTier ?? 'all'}
            onValueChange={(value) => handleFilterChange('accountTier', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Tiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value={ClientTier.PLATINUM}>Platinum</SelectItem>
              <SelectItem value={ClientTier.DIAMOND}>Diamond</SelectItem>
              <SelectItem value={ClientTier.GOLD}>Gold</SelectItem>
              <SelectItem value={ClientTier.SILVER}>Silver</SelectItem>
              <SelectItem value={ClientTier.BRONZE}>Bronze</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={portalAccess ?? 'all'}
            onValueChange={(value: string) => handleFilterChange('portalAccess', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Portal Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Enabled</SelectItem>
              <SelectItem value="false">Disabled</SelectItem>
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
    </div>
  );
}
