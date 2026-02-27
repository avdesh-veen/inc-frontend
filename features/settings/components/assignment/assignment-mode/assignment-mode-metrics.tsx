/**
 * Assignment Mode Metrics Component (Client)
 * 
 * Displays key metrics for assignment configuration.
 */

'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAssignmentMetrics } from '@/features/settings/hooks/use-assignment';

export function AssignmentModeMetrics() {
  const { data: metrics, isLoading } = useAssignmentMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card className="p-4">
        <p className="text-xs text-text-50 mb-1">Active Analysts</p>
        <p className="text-2xl font-bold text-foreground">{metrics?.activeAnalystCount || 0}</p>
      </Card>
      <Card className="p-4">
        <p className="text-xs text-text-50 mb-1">Skill Sets</p>
        <p className="text-2xl font-bold text-violet-400">{metrics?.skillSetsCount || 0}</p>
      </Card>
      <Card className="p-4">
        <p className="text-xs text-text-50 mb-1">Avg Capacity</p>
        <p className="text-2xl font-bold text-emerald-400">{metrics?.avgCapacityPercentage || 0}%</p>
      </Card>
      <Card className="p-4">
        <p className="text-xs text-text-50 mb-1">Auto-Assignment</p>
        <p className="text-2xl font-bold text-cyan-400">
          {metrics?.autoAssignment ? 'ON' : 'OFF'}
        </p>
      </Card>
    </div>
  );
}
