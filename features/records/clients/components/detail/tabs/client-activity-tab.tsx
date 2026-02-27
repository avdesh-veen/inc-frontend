/**
 * Client Activity Tab
 * 
 * Displays activity history for the client (preview only for this phase).
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { InformationCircleIcon, ActivityIcon } from '@hugeicons/core-free-icons';
import { ClientActivity } from '@/features/records/clients/types';
import { formatDistanceToNow } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { formatTimestamp, getActivityBadgeClass } from '@/features/records/clients/utils/helpers';

interface ClientActivityTabProps {
  clientId: string;
}

export function ClientActivityTab({ clientId }: Readonly<ClientActivityTabProps>) {
  const [activities, setActivities] = useState<ClientActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchActivity() {
      try {
        setActivities([]);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch activity:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivity();
  }, [clientId]);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info Alert */}
      <Alert>
        <HugeiconsIcon icon={InformationCircleIcon} className="h-4 w-4" />
        <AlertDescription>
          Showing recent activity preview. Full activity log with filters and export coming in future release.
        </AlertDescription>
      </Alert>

      <div className="rounded-xl border bg-card">
        {/* Header */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Activity History</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Audit trail of all changes and actions for this client
          </p>
        </div>

        {/* Activity Timeline */}
        {activities.length === 0 ? (
          <div className="p-12 text-center">
            <HugeiconsIcon icon={ActivityIcon} className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No activity yet</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={activity.id} className="relative">
                  {/* Timeline connector */}
                  {index < activities.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-border" />
                  )}

                  <div className="flex gap-4">
                    {/* Timeline dot */}
                    <div className="relative z-10 shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <HugeiconsIcon icon={ActivityIcon} className="h-4 w-4 text-primary" />
                      </div>
                    </div>

                    {/* Activity content */}
                    <div className="flex-1 pb-6">
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            {/* Action and timestamp */}
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className={getActivityBadgeClass(activity.action)}>
                                {activity.action}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatTimestamp(activity.timestamp)}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                ({formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })})
                              </span>
                            </div>

                            {/* Performed by */}
                            <p className="text-sm">
                              by <span className="font-medium">{activity.performedBy}</span>
                            </p>

                            {/* Details */}
                            {activity.details && (
                              <p className="text-sm text-muted-foreground">{activity.details}</p>
                            )}

                            {/* Related entity */}
                            {activity.relatedEntityType && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {activity.relatedEntityType}
                                </Badge>
                                {activity.relatedEntityId && (
                                  <span>ID: {activity.relatedEntityId}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
