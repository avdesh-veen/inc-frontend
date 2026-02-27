/**
 * Back Button Component
 * 
 * Client component for navigation back to provider list.
 */

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/records/providers');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className="w-fit"
    >
      Back to Providers
    </Button>
  );
}
