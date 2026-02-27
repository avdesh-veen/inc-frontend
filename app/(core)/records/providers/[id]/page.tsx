/**
 * Provider Detail Page
 * 
 * Main page for provider detail view with header, metrics, and tabs.
 * Route: /records/providers/[id]
 */

import { ProviderDetailBoundary } from '@/features/records/providers/components/detail-view/provider-detail-boundary';
import { BackButton } from './back-button';

interface ProviderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProviderDetailPage({ params }: Readonly<ProviderDetailPageProps>) {
  const { id } = await params;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Back Button */}
      <BackButton />

      {/* Provider Detail Content */}
      <ProviderDetailBoundary providerId={id} />
    </div>
  );
}
