/**
 * Client List Header
 * 
 * Page header with title and Add Client button.
 * Uses Zustand store to open the form modal.
 */

'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon } from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/button';
import { useClientStore } from '@/features/records/clients/hooks/use-client-store';
import { useHasPermission } from '@/features/auth/hooks';
import { RESOURCES, PERMISSIONS } from '@/features/auth/utils/permission-constants';

export function ClientListHeader() {
  const { openFormModal } = useClientStore();
  const { hasPermission: canCreate, isLoading: isLoadingCreate } = useHasPermission(
    RESOURCES.CLIENTS,
    PERMISSIONS.CLIENTS_CREATE
  );

  const canAddClient = canCreate
  const isLoading = isLoadingCreate


  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Clients</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your client organizations and their associated information.
        </p>
      </div>
      {
        !isLoading && canAddClient && 
        <Button 
        onClick={() => openFormModal()}
        className="gap-2"
        aria-label="Add new client"
      >
        <HugeiconsIcon icon={PlusSignIcon} className="size-4" strokeWidth={2} aria-hidden="true" />
        Add Client
      </Button>
      } 
    </div>
  );
}
