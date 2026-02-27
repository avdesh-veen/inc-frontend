/**
 * Client Detail Header
 * 
 * Displays client name, badges, meta information, and actions.
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Client } from '@/features/records/clients/types';
import { useClientStore } from '@/features/records/clients/hooks/use-client-store';
import { HugeiconsIcon } from '@hugeicons/react';
import { Building02Icon, Edit01Icon } from '@hugeicons/core-free-icons';
import { getTierBadgeClass, getTierLabel, formatCurrency, formatTaxId } from '@/features/records/clients/utils/helpers';
import { useHasPermission } from '@/features/auth/hooks';
import { RESOURCES, PERMISSIONS } from '@/features/auth/utils/permission-constants';

interface ClientDetailHeaderProps {
  client: Client;
}

export function ClientDetailHeader({ client }: Readonly<ClientDetailHeaderProps>) {
  const { openFormModal } = useClientStore();
  const { hasPermission: canUpdate, isLoading: isLoadingUpdate } = useHasPermission(
    RESOURCES.CLIENTS,
    PERMISSIONS.CLIENTS_UPDATE
  );

  const canEditClient = canUpdate;
  const isLoading = isLoadingUpdate;

  const handleEdit = () => {
    openFormModal(client.id);
  };

  return (
    <div className="flex items-center gap-6 bg-glass-bg p-6 rounded-xl">
      <div className={`w-20 h-20 rounded-2xl ${getTierBadgeClass(client.accountTier)} flex items-center justify-center`}>
        <HugeiconsIcon 
          icon={Building02Icon}
          className={`w-10 h-10 ${getTierBadgeClass(client.accountTier)}`}
        />
      </div>
      
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-foreground">
          {client.organizationName}
        </h2>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span>Tax ID: {formatTaxId(client.taxId)}</span>
          {client.npi && (
            <>
              <span>•</span>
              <span>NPI: {client.npi}</span>
            </>
          )}
          <span>•</span>
          <span>{client.address?.city}, {client.address?.state}</span>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={`px-3 py-1.5 rounded-xl text-sm font-bold ${getTierBadgeClass(client.accountTier)}`}
          >
            {getTierLabel(client.accountTier)}
          </Badge>
          <Badge 
            variant="outline" 
            className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
              client.isActive 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-600' 
                : 'bg-gray-500/20 text-gray-400 border-gray-600'
            }`}
          >
            {client.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Est. Revenue: {client.estAnnualRevenue ? formatCurrency(client.estAnnualRevenue) : '$0'}/yr
        </p>
        {
          !isLoading && canEditClient && 
          <Button 
            onClick={handleEdit} 
            variant="outline" 
            size="default"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-white/5"
          >
            <HugeiconsIcon 
              icon={Edit01Icon}
              className="w-4 h-4"
            />
            Edit
          </Button>
        }
      </div>
    </div>
  );
}
