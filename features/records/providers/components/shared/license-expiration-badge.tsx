/**
 * License Expiration Badge Component
 * 
 * Badge component for license expiration dates with color-coding.
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface LicenseExpirationBadgeProps {
  expirationDate: Date | null;
}

export function LicenseExpirationBadge({ expirationDate }: LicenseExpirationBadgeProps) {

  if (!expirationDate) {
    return <span className="text-sm text-muted-foreground">N/A</span>;
  }



  return (
    <Badge
      variant="outline"
      className={cn('bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs font-medium')}
    >
      Expires {format(expirationDate, 'yyyy-MM-dd')}
    </Badge>
  );
}
