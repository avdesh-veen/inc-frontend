"use client";

import { useRouter ,notFound} from 'next/navigation';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/button';
import { ClientDetailHeader } from '@/features/records/clients/components/detail/client-detail-header';
import { ClientDetailTabs } from '@/features/records/clients/components/detail/client-detail-tabs';
import { ClientFormModal } from '@/features/records/clients/components/client-form/client-form-modal';
import { useClient } from '@/features/records/clients/api/clients-tab/client';
import { ClientMetricCards } from '../detail/client-metric-cards';

interface ClientDetailContentProps {
  clientId: string;
  activeTab: string;
}

/**
 * Client component that displays client detail page content
 * Uses TanStack Query to fetch client data (prefetched by boundary)
 */
export function ClientDetailContent({ clientId, activeTab }: Readonly<ClientDetailContentProps>) {
  const router = useRouter();
  const { data, isLoading, error } = useClient(clientId);
  const client = data?.data;

  const handleBack = () => {
    router.push('/records/clients');
  };

  if (isLoading) {
    return <div className="flex flex-1 flex-col gap-6 p-6">Loading...</div>;
  }

  if (error) {
    return <div className="flex flex-1 flex-col gap-6 p-6">Error loading client</div>;
  }

  if (!client) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="w-fit"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4 mr-2" strokeWidth={2} />
        Back to Clients
      </Button>

      <ClientDetailHeader client={client} />

      <ClientMetricCards client={client} />

      <ClientDetailTabs client={client} activeTab={activeTab} />

      <ClientFormModal />
    </div>
  );
}
