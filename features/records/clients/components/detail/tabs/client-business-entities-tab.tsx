/**
 * Client Business Entities Tab
 * 
 * Placeholder tab for business entities (view-only for Phase 1).
 */

'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { InformationCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
interface ClientBusinessEntitiesTabProps {
  clientId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ClientBusinessEntitiesTab({ clientId }: Readonly<ClientBusinessEntitiesTabProps>) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <Alert>
        <HugeiconsIcon icon={InformationCircleIcon} className="h-4 w-4" />
        <AlertDescription>
          Business entities view is coming soon. Column definitions are to be determined.
        </AlertDescription>
      </Alert>
    </div>
  );
}
