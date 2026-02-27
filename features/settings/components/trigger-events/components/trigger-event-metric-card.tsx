'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export interface TriggerEventMetricCardProps {
  label: string;
  value: number;
  subtitle?: string;
  variant?: 'default' | 'cyan' | 'amber' | 'violet' | 'emerald';
  className?: string;
  isLoading?: boolean;
}

const variantStyles: Record<NonNullable<TriggerEventMetricCardProps['variant']>, string> = {
  default: 'text-foreground',
  cyan: 'text-cyan-400',
  amber: 'text-amber-400',
  violet: 'text-violet-400',
  emerald: 'text-emerald-400',
};

export function TriggerEventMetricCard({
  label,
  value,
  subtitle,
  variant = 'default',
  isLoading = false,
}: Readonly<TriggerEventMetricCardProps>) {
  return (
    <Card>
      <CardContent>
        <p className="text-xs text-white/50 mb-1">{label}</p>
        {isLoading ? (
          <Skeleton className="h-8 w-12" />
        ) : (
          <p className={cn('text-2xl font-bold', variantStyles[variant])}>
            {value}
          </p>
        )}
        {subtitle && (
          <p className="text-[10px] text-white/30">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
