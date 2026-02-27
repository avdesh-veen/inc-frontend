/**
 * Trigger Events Display Component (Client)
 * 
 * Displays assignment trigger events that initiate routing.
 * Uses React Query hook to fetch data from the server.
 */

'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTriggerEventsList } from '@/features/settings/hooks/use-trigger-events';

export function TriggerEventsDisplay() {
  const { data: response, isLoading, error } = useTriggerEventsList({
    page: 1,
    limit: 50,
    isActive: true,
  });

  const triggerEvents = response?.data?.items || [];

  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="text-base font-bold text-foreground mb-4">Assignment Trigger Events</h3>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <h3 className="text-base font-bold text-foreground mb-4">Assignment Trigger Events</h3>
        <p className="text-sm text-red-500">Error loading trigger events: {error.message}</p>
      </Card>
    );
  }

  if (triggerEvents.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-base font-bold text-foreground mb-4">Assignment Trigger Events</h3>
        <p className="text-sm text-text-50">No trigger events available</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-base font-bold text-foreground mb-4">Assignment Trigger Events</h3>
      <p className="text-xs text-text-50 mb-4">
        Assignment routing is triggered by these workflow events:
      </p>
      <div className="grid grid-cols-3 gap-3">
        {triggerEvents.map((event) => (
          <div
            key={event.id}
            className="p-3 rounded-xl bg-glass-bg border border-border-5"
          >
            <code className="text-xs text-cyan-400">{event.code}</code>
            <p className="text-xs text-text-50 mt-1">{event.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
