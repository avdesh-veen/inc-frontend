/**
 * Client Metric Cards
 *
 * Displays key metrics for a client in card format.
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Client } from "@/features/records/clients/types";
import { cn } from "@/lib/utils";
import {
  getHealthScoreColor,
  getHealthScoreColorClass,
} from "@/features/records/clients/utils/helpers";

interface ClientMetricCardsProps {
  client: Client;
}

export function ClientMetricCards({
  client,
}: Readonly<ClientMetricCardsProps>) {
  const metrics = [
    {
      id: "providers",
      title: "PROVIDERS",
      value:
        (client as unknown as { providerCount?: number }).providerCount ?? 0,
      description: "Total associated providers",
    },
    {
      id: "enrollments",
      title: "ACTIVE ENROLLMENTS",
      value:
        (client as unknown as { activeEnrollments?: number })
          .activeEnrollments ?? 0,
      description: "Current enrollment requests",
    },
    {
      id: "tat",
      title: "AVG TAT",
      value: `${(client as unknown as { avgTat?: number }).avgTat ?? 0} days`,
      description: "Average turnaround time",
    },
    {
      id: "health",
      title: "HEALTH SCORE",
      value: client.healthScore ?? 0,
      description: "Overall client health",
      isHealthScore: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.id} className="bg-glass-bg border-border">
          <CardContent className="pt-6 pb-6">
            <div className="space-y-3">
              <div className="text-xxs font-semibold text-muted-foreground uppercase tracking-wider">
                {metric.title}
              </div>
              {metric.isHealthScore ? (
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Progress
                      value={metric.value as number}
                      className={cn(
                        "h-2",
                        getHealthScoreColorClass(metric.value as number),
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-2xl font-bold tabular-nums",
                      getHealthScoreColor(metric.value as number),
                    )}
                  >
                    {metric.value}
                  </span>
                </div>
              ) : (
                <div className="text-3xl font-bold tabular-nums tracking-tight">
                  {metric.value}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
