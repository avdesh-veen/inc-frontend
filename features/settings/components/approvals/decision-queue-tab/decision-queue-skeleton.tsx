"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

/**
 * Skeleton for DecisionQueueConfig component
 * Matches the form layout with switch toggle, selects, and escalation alert
 */
export function DecisionQueueConfigSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-5 w-56" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Enable Decision Queue Toggle */}
          <div className="col-span-full flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>

          {/* Business Start Hours Select */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Business End Hours Select */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Escalation Rules Alert */}
          <div className="col-span-full p-4 border rounded-lg bg-warning/10 space-y-3">
            <Skeleton className="h-5 w-32" />
            <div className="flex flex-wrap gap-2">
              <div className="flex-1 space-y-2 min-w-[200px]">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="flex-1 space-y-2 min-w-[200px]">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const ROUTING_ROW_KEYS = [
  "routing-row-1",
  "routing-row-2",
  "routing-row-3",
  "routing-row-4",
] as const;

/**
 * Skeleton for RoutingConfig component
 * Matches the table layout with 4 columns and multiple rows
 */
export function RoutingConfigSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <Skeleton className="h-5 w-52" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          {/* Table Header */}
          <div className="flex border-b py-3">
            <Skeleton className="h-4 w-32 flex-1" />
            <Skeleton className="h-4 w-28 flex-1" />
            <Skeleton className="h-4 w-20 flex-1" />
            <Skeleton className="h-4 w-24 flex-1" />
          </div>

          {/* Table Rows */}
          {ROUTING_ROW_KEYS.map((key) => (
            <div key={key} className="flex items-center border-b py-4">
              <Skeleton className="h-4 w-36 flex-1" />
              <div className="flex-1">
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-16 flex-1" />
              <Skeleton className="h-4 w-8 flex-1" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const SLA_ROW_KEYS = ["sla-row-1", "sla-row-2", "sla-row-3"] as const;

/**
 * Skeleton for SLAByType component
 * Matches the card layout with placeholder content
 */
export function SLAByTypeSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <Skeleton className="h-5 w-24" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Placeholder rows for SLA content */}
          {SLA_ROW_KEYS.map((key) => (
            <div key={key} className="flex items-center justify-between py-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Combined skeleton for the entire Approvals page
 * Renders all three config skeletons in the correct layout
 */
export function DecisionQueueTabSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <DecisionQueueConfigSkeleton />
      <SLAByTypeSkeleton />
      <div className="md:col-span-2">
        <RoutingConfigSkeleton />
      </div>
    </div>
  );
}
