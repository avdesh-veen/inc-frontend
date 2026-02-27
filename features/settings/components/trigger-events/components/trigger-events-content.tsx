'use client';

import * as React from "react";
import { TriggerEventMetricCard } from "./trigger-event-metric-card";
import { TriggerEventTypeInfo } from "./trigger-event-type-info";
import { TriggerEventsListViewClient } from "./trigger-events-list-view-client";
import { useTriggerEventsList, useTriggerEventsStats } from "@/features/settings/hooks/use-trigger-events";
import type { FilterType } from "./trigger-event-filters";

const DEFAULT_LIMIT = 10;

export function TriggerEventsContent(request?: Record<string, unknown>) {
  const [page, setPage] = React.useState(1);
  const [activeFilter, setActiveFilter] = React.useState<FilterType>("all");

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const { data: eventsData, isLoading: isEventsLoading } = useTriggerEventsList({
    ...request,
    page,
    limit: DEFAULT_LIMIT,
    ...(activeFilter !== "all" ? { type: activeFilter } : {}),
  });
  const { data: statsData, isLoading: isStatsLoading } = useTriggerEventsStats();

  const events = eventsData?.data?.items ?? [];
  const meta = eventsData?.data?.meta;
  const stats = statsData?.data ?? {
    totalEvents: 0,
    systemEvents: 0,
    manualEvents: 0,
    scheduledEvents: 0,
    withRulesEvents: 0,
  };

  const filterMetrics = {
    total: stats.totalEvents,
    system: stats.systemEvents,
    manual: stats.manualEvents,
    scheduled: stats.scheduledEvents,
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
        <TriggerEventMetricCard
          label="Total Events"
          value={stats.totalEvents}
          isLoading={isStatsLoading}
        />
        <TriggerEventMetricCard
          label="System"
          value={stats.systemEvents}
          subtitle="Auto-fired"
          variant="cyan"
          isLoading={isStatsLoading}
        />
        <TriggerEventMetricCard
          label="Manual"
          value={stats.manualEvents}
          subtitle="Analyst action"
          variant="amber"
          isLoading={isStatsLoading}
        />
        <TriggerEventMetricCard
          label="Scheduled"
          value={stats.scheduledEvents}
          subtitle="Time-based"
          variant="violet"
          isLoading={isStatsLoading}
        />
        <TriggerEventMetricCard
          label="With Rules"
          value={stats.withRulesEvents}
          subtitle="Active rules"
          variant="emerald"
          isLoading={isStatsLoading}
        />
      </div>

      <TriggerEventTypeInfo className="bg-linear-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 flex gap-3 p-4" />

      <TriggerEventsListViewClient
        events={events}
        isLoading={isEventsLoading}
        meta={meta}
        onPageChange={setPage}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        metrics={filterMetrics}
      />
    </div>
  );
}
