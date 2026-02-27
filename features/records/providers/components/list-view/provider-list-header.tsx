/**
 * Provider List Header
 * 
 * Page header with title and Add Provider button.
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon } from '@hugeicons/core-free-icons';

export function ProviderListHeader() {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-foreground">All Providers</h3>
      <Button 
        asChild
        className="btn-primary px-4 py-2 rounded-xl font-semibold text-sm"
        aria-label="Add new provider"
      >
        <Link href="/records/providers/new">
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" strokeWidth={2} />
          Add Provider
        </Link>
      </Button>
    </div>
  );
}
