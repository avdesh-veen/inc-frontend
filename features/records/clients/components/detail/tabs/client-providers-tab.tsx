/**
 * Client Providers Tab
 * 
 * Displays list of providers associated with the client.
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import { ClientProvider } from '@/features/records/clients/types';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { getClientInitials, getAvatarColor, getStatusBadgeClass, getResponsivenessColorClass } from '@/features/records/clients/utils/helpers';

interface ClientProvidersTabProps {
  clientId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ClientProvidersTab({ clientId }: Readonly<ClientProvidersTabProps>) {
  const [providers] = useState<ClientProvider[]>([]);

  return (
    <div className="rounded-xl border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h3 className="text-lg font-semibold">
          {providers.length} Provider{providers.length !== 1 ? 's' : ''}
        </h3>
        <Button size="default">
          <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4 mr-2" />
          Add Provider
        </Button>
      </div>

      {/* Table */}
      {providers.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground">
          <p>No providers yet</p>
        </div>
      ) : (
        <div className="rounded-lg border border-white/5 overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-[minmax(250px,2fr)_180px_120px_200px] gap-4 items-center py-2 px-4 bg-white/2 border-b border-white/5">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Provider
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Specialty
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Status
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Responsiveness
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
