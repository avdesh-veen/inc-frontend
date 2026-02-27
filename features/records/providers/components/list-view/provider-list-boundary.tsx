/**
 * Provider List Boundary Component
 * 
 * Server component that handles data fetching for the provider list.
 * Wraps client components with prefetched data.
 * Uses the API layer for data fetching.
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ProviderListHeader } from './provider-list-header';
import { ProviderSearchFilters } from './provider-search-filters';
import { ProviderTable } from './provider-table';
import { ProviderPagination } from './provider-pagination';
import { getProvidersListServer } from '../../api/list-view/server';
import type { ProviderSortField, ProviderStatus } from '@/features/records/providers/types';

interface ProviderListBoundaryProps {
  searchParams: {
    search?: string;
    client?: string;
    department?: string;
    businessEntity?: string;
    status?: string;
    alert?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    page?: string;
    limit?: string;
  };
}

export async function ProviderListBoundary({ searchParams }: ProviderListBoundaryProps) {
  const filters = {
    search: searchParams.search || '',
    clientId: searchParams.client || null,
    departmentId: searchParams.department || null,
    businessEntityId: searchParams.businessEntity || null,
    status: (searchParams.status as ProviderStatus) || null,
    alert: searchParams.alert || null,
  };
  
  const sort = {
    field: (searchParams.sort as ProviderSortField) || 'displayName',
    order: (searchParams.order || 'asc') as 'asc' | 'desc',
  };
  
  const page = parseInt(searchParams.page || '1', 10);
  const limit = parseInt(searchParams.limit || '25', 10);

  const { providers, pagination } = await getProvidersListServer({
    search: filters.search,
    alert: filters.alert || undefined,
    clientId: filters.clientId || undefined,
    departmentId: filters.departmentId || undefined,
    businessEntityId: filters.businessEntityId || undefined,
    status: filters.status || undefined,
    sortBy: sort.field,
    sortOrder: sort.order,
    page,
    limit,
  });

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-white/5">
          <ProviderListHeader />
          <ProviderSearchFilters filters={filters} sort={sort} />
        </CardHeader>

        <CardContent className="p-0">
          <ProviderTable providers={providers} sort={sort} />
        </CardContent>
      </Card>

      <ProviderPagination page={page} limit={limit} pagination={pagination} />
    </>
  );
}
