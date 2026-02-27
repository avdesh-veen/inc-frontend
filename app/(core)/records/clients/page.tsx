/**
 * Clients Page
 * 
 * Main client listing page with search, filters, sorting, and pagination.
 * Route: /records/clients
 * 
 * Uses URL searchParams for all state (filters, search, sort, pagination).
 * Server component that wraps ClientsTab with ClientsBoundary for data prefetching.
 */

import { Suspense } from 'react';
import { ClientsBoundary } from '@/features/records/clients/components/clients-tab/clients-boundary';
import { ClientsTab } from '@/features/records/clients/components/clients-tab/clients-tab';
import { ClientFormModal } from '@/features/records/clients/components/client-form/client-form-modal';
import { ClientsLoadingSkeleton } from '@/features/records/clients/components/clients-tab/clients-loading-skeleton';

interface ClientsPageProps {
  searchParams: Promise<{
    search?: string;
    type?: string;
    accountTier?: string;
    portalAccess?: string;
    sort?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function ClientsPage({ searchParams }: Readonly<ClientsPageProps>) {
  const params = await searchParams;

  // Parse numeric params with validation
  const parsedPage = params.page !== undefined ? Number.parseInt(params.page, 10) : undefined;
  const parsedLimit = params.limit !== undefined ? Number.parseInt(params.limit, 10) : undefined;

  const filters = {
    search: params.search,
    type: params.type,
    accountTier: params.accountTier,
    portalAccess: params.portalAccess,
    sort: params.sort,
    ...(parsedPage !== undefined && !Number.isNaN(parsedPage) && { page: parsedPage }),
    ...(parsedLimit !== undefined && !Number.isNaN(parsedLimit) && { limit: parsedLimit }),
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Suspense fallback={<ClientsLoadingSkeleton />}>
        <ClientsBoundary request={filters}>
          <ClientsTab {...filters} />
          <ClientFormModal />
        </ClientsBoundary>
      </Suspense>
    </div>
  );
}

