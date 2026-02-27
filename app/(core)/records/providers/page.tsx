/**
 * Provider List Page
 * 
 * Main page for provider list with search, filters, sorting, and pagination.
 * Route: /records/providers
 * 
 * Uses URL searchParams for all state (filters, search, sort, pagination).
 */

import { ProviderListBoundary } from '@/features/records/providers/components/list-view/provider-list-boundary';

interface ProvidersPageProps {
  searchParams: Promise<{
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
  }>;
}

export default async function ProvidersPage({ searchParams }: Readonly<ProvidersPageProps>) {
  const params = await searchParams;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <ProviderListBoundary searchParams={params} />
    </div>
  );
}
