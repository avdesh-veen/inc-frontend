/**
 * Provider Avatar Component
 * 
 * Displays provider initials with colored background.
 */

'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ProviderAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function ProviderAvatar({ name, size = 'md', className }: ProviderAvatarProps) {
  // Extract initials
  const initials = name
    .split(' ')
    .filter((part) => part.length > 0)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();


  const sizeClasses = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl',
    xl: 'h-20 w-20 text-2xl',
  };

  return (
    <Avatar className={cn(sizeClasses[size], 'rounded-2xl', className)}>
      <AvatarFallback
        className={cn('rounded-2xl font-bold bg-linear-to-br from-blue-500 to-violet-500 text-white')}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
