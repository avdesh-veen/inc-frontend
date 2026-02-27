/**
 * Assignment Mode Card Component
 * 
 * Selectable card for choosing assignment mode.
 * Uses custom radio button styling for visual feedback.
 */

'use client';

import { cn } from '@/lib/utils';
import type { AssignmentMode } from '@/features/settings/types/assignment';

interface AssignmentModeCardProps {
  id: AssignmentMode;
  name: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}

export function AssignmentModeCard({
  name,
  description,
  isActive,
  onClick,
}: Readonly<AssignmentModeCardProps>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'p-4 rounded-xl border-2 cursor-pointer transition-all text-left w-full',
        isActive
          ? 'border-violet-500 bg-violet-500/10'
          : 'border-border-10 hover:border-border-10'
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        {/* Radio button */}
        <div
          className={cn(
            'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
            isActive ? 'border-violet-500' : 'border-text-50'
          )}
          aria-hidden="true"
        >
          {isActive && (
            <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
          )}
        </div>
        <p className="font-medium text-foreground">{name}</p>
      </div>
      <p className="text-xs text-text-50 ml-8">{description}</p>
    </button>
  );
}
