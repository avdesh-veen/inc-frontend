/**
 * Client Portal Users Tab
 * 
 * Displays portal users for the client (read-only).
 */

'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlusSignIcon, InformationCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@/lib/utils';
import { getClientInitials, getStatusBadgeClass, formatDateShort } from '@/features/records/clients/utils/helpers';

interface ClientPortalUsersTabProps {
  clientId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ClientPortalUsersTab({ clientId }: Readonly<ClientPortalUsersTabProps>) {


  return (
    <div className="space-y-4">
      {/* Info Alert */}
      <Alert>
        <HugeiconsIcon icon={InformationCircleIcon} className="h-4 w-4" />
        <AlertDescription>
          Portal users are read-only. User management is handled by backend integration.
        </AlertDescription>
      </Alert>

      <div className="rounded-xl border bg-card">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">
            Portal User
          </h3>
          <Button size="default">
            <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        </div>

        {/* Table */}
        
          <div className="rounded-lg border border-white/5 overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-[minmax(250px,2fr)_160px_140px_140px_120px] gap-4 items-center py-2 px-4 bg-white/2 border-b border-white/5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                User
              </span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Business Entity
              </span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Role
              </span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Last Login
              </span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Status
              </span>
            </div>


          </div>
        
      </div>
    </div>
  );
}
