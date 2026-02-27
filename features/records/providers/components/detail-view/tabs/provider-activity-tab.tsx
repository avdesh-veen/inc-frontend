/**
 * Provider Activity Tab
 * 
 * Activity tab showing provider activity history and audit log.
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Provider } from '@/features/records/providers/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { Upload01Icon } from '@hugeicons/core-free-icons';
import { format } from 'date-fns';

interface ProviderActivityTabProps {
  provider: Provider;
}

export function ProviderActivityTab({ provider: _provider }: Readonly<ProviderActivityTabProps>) {
  const activities = [
    {
      id: '1',
      action: 'Created new provider record',
      badge: 'CREATE',
      date: new Date('2024-01-15T10:30:00'),
      performer: 'Admin User',
      details: '"Initial provider setup completed"',
      color: 'bg-emerald-500/20 text-emerald-400',
    },
    {
      id: '2',
      action: 'Updated license information',
      badge: 'UPDATE',
      date: new Date('2024-01-16T14:15:00'),
      performer: 'System',
      details: 'PA Medical License expiration: 12/31/2026',
      color: 'bg-blue-500/20 text-blue-400',
    },
    {
      id: '3',
      action: 'Document uploaded',
      badge: 'UPDATE',
      date: new Date('2024-01-17T09:20:00'),
      performer: 'Admin User',
      details: 'DEA_Certificate.pdf uploaded',
      color: 'bg-blue-500/20 text-blue-400',
    },
    {
      id: '4',
      action: 'Client association added',
      badge: 'UPDATE',
      date: new Date('2024-01-18T11:45:00'),
      performer: 'Coordinator',
      details: 'Linked to Keystone Health Partners',
      color: 'bg-blue-500/20 text-blue-400',
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-white/5 bg-white/[0.02]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Activity History</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              All recorded actions for this provider
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activity</SelectItem>
                <SelectItem value="create">Created</SelectItem>
                <SelectItem value="update">Updated</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" className="gap-1.5">
              <HugeiconsIcon icon={Upload01Icon} className="size-3.5" strokeWidth={2} />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${activity.color}`}
                  >
                    {activity.badge === 'CREATE' ? '✓' : '↻'}
                  </div>
                  {index < activities.length - 1 && (
                    <div className="w-0.5 flex-1 bg-white/5 mt-2" />
                  )}
                </div>

                <div className="flex-1 pb-8">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-foreground">
                          {activity.action}
                        </h4>
                        <Badge
                          variant="outline"
                          className={`${activity.color} border-current text-xs`}
                        >
                          {activity.badge}
                        </Badge>
                      </div>
                      {activity.details && (
                        <p className="text-sm text-muted-foreground italic">
                          {activity.details}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        by {activity.performer}
                      </p>
                    </div>
                    <time className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(activity.date, 'MMM dd, yyyy h:mm a')}
                    </time>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
