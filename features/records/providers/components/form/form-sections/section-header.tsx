/**
 * Section Header Component
 * 
 * Reusable section header for form sections with icon, title, and optional description.
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  /** Icon to display (from Hugeicons) */
  icon: React.ReactNode;
  /** Section title */
  title: string;
  /** Optional description or subtitle */
  description?: string;
  /** Icon color (Tailwind color class) */
  iconColor?: string;
  /** Additional className for the container */
  className?: string;
}

export function SectionHeader({
  icon,
  title,
  description,
  iconColor = 'text-emerald-400',
  className,
}: Readonly<SectionHeaderProps>) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <div className={cn('flex-shrink-0', iconColor)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
