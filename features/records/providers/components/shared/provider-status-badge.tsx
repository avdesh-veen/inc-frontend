/**
 * Provider Status Badge Component
 * 
 * Badge component for displaying provider status.
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { ProviderStatus } from '@/features/records/providers/types';
import { cn } from '@/lib/utils';

interface ProviderStatusBadgeProps {
  status: ProviderStatus;
  size?: 'sm' | 'md';
}

export function ProviderStatusBadge({ status, size = 'md' }: ProviderStatusBadgeProps) {
  const getStatusColor = (status: ProviderStatus) => {
    switch (status) {
      case ProviderStatus.ACTIVE:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case ProviderStatus.PENDING:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        getStatusColor(status),
        sizeClasses[size],
        'font-medium'
      )}
    >
      {status}
    </Badge>
  );
}
