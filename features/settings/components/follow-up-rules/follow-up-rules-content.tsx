"use client";

import * as React from "react";
import { FollowUpRulesList } from "./components/follow-up-rules-list";
import { FollowUpRulesStatsCard } from "./components/stats-grid";
import {
  useFollowUpRules,
  useFollowUpRulesStatistics,
} from "@/features/settings/hooks/use-follow-up-rules";
import type {
  FollowUpRulesContentProps,
  FollowUpRulesStats,
  FollowUpRulesStatistics,
} from "@/features/settings/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";

const DEFAULT_LIMIT = 10;

function statsFromApi(
  data: FollowUpRulesStatistics | undefined,
): FollowUpRulesStats {
  return {
    totalRules: data?.totalRulesCount ?? 0,
    active: data?.activeRulesCount ?? 0,
    categories: data?.categoriesCount ?? 0,
    avgChaseTimeDays: data?.avgChaseTime ?? 0,
  };
}

export function FollowUpRulesContent({
  request,
}: Readonly<FollowUpRulesContentProps>) {
  const [page, setPage] = React.useState(1);

  const { data, isError, error } = useFollowUpRules({ ...request, page, limit: DEFAULT_LIMIT });
  const items = data?.data?.items ?? [];
  const meta = data?.data?.meta;
  const {
    data: statsData,
    isLoading: isStatsLoading,
    isFetching: isStatsFetching,
  } = useFollowUpRulesStatistics();
  const stats = statsFromApi(statsData?.data);

  if (isError) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-sm text-destructive">
          {error?.message ?? "Failed to load follow-up rules."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FollowUpRulesStatsCard
        stats={stats}
        isLoading={isStatsLoading || isStatsFetching}
      />
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
       <HugeiconsIcon icon={InformationCircleIcon} className="text-blue-400 size-5 mt-0.5" />
        <div>
          <div className="text-sm font-medium text-blue-300">
            Automatic Follow-Up System
          </div>
          <div className="text-xs text-white/60 mt-1">
            Follow-up tasks are automatically created when trigger events occur.
            The system monitors waiting tasks and generates chase reminders
            based on these rules.
          </div>
        </div>
      </div>
      <FollowUpRulesList rules={items} meta={meta} onPageChange={setPage} />
    </div>
  );
}
