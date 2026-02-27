/**
 * Client Not Found Page
 * 
 * Displayed when a client with the given ID doesn't exist.
 */

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export default function ClientNotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Alert variant="destructive" className="max-w-lg">
          <HugeiconsIcon icon={AlertCircleIcon} className="h-4 w-4" />
          <AlertTitle>Client Not Found</AlertTitle>
          <AlertDescription>
            The client you&apos;re looking for doesn&apos;t exist or has been removed.
          </AlertDescription>
        </Alert>
        
        <Button onClick={() => router.push('/records/clients')} variant="outline">
          Back to Clients
        </Button>
      </div>
    </div>
  );
}
