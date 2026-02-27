/**
 * Provider Detail Boundary Component
 * 
 * Server component that handles data fetching for the provider detail view.
 * Wraps client components with prefetched data.
 * Uses the API layer for data fetching.
 */

import { notFound } from 'next/navigation';
import { ProviderDetailHeader } from './provider-detail-header';
import { ProviderDetailTabs } from './provider-detail-tabs';
import { getProviderDetailServer } from '../../api/detail-view/server';

interface ProviderDetailBoundaryProps {
  providerId: string;
}

export async function ProviderDetailBoundary({ providerId }: Readonly<ProviderDetailBoundaryProps>) {
  // Fetch provider data using API layer
  const provider = await getProviderDetailServer(providerId);

  if (!provider) {
    notFound();
  }

  return (
    <>
      {/* Provider Header */}
      <ProviderDetailHeader provider={provider} />

      {/* Tabs */}
      <ProviderDetailTabs provider={provider} />
    </>
  );
}
