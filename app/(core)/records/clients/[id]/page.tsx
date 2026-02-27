/**
 * Client Detail Page
 * 
 * Displays detailed information about a specific client with multiple tabs.
 * Route: /records/clients/[id]
 * 
 * Server component that uses ClientDetailBoundary for data prefetching.
 */

import { ClientDetailBoundary } from '@/features/records/clients/components/client-detail/client-detail-boundary';
import { ClientDetailContent } from '@/features/records/clients/components/client-detail/client-detail-content';

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function ClientDetailPage({
  params,
  searchParams,
}: Readonly<ClientDetailPageProps>) {
  const { id: clientId } = await params;
  const { tab: activeTab = 'overview' } = await searchParams;

  return (
    <ClientDetailBoundary clientId={clientId}>
      <ClientDetailContent clientId={clientId} activeTab={activeTab} />
    </ClientDetailBoundary>
  );
}
