"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type {
  FollowUpRulesStats,
  FollowUpRulesStatsCardProps,
} from "@/features/settings/types";

const STAT_CARDS: Array<{
  key: keyof FollowUpRulesStats;
  label: string;
  valueClass?: string;
  suffix?: string;
}> = [
  { key: "totalRules", label: "Total Rules" },
  { key: "active", label: "Active", valueClass: "text-emerald-400" },
  { key: "categories", label: "Categories", valueClass: "text-violet-400" },
  {
    key: "avgChaseTimeDays",
    label: "Avg Chase Time",
    valueClass: "text-cyan-400",
    suffix: "days",
  },
];

export function FollowUpRulesStatsCard({
  stats,
  isLoading = false,
}: Readonly<FollowUpRulesStatsCardProps>) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_CARDS.map(({ key, label, valueClass, suffix }) => (
        <StatsCard
          key={key}
          label={label}
          value={
            suffix ? (
              <>
                {stats[key]}
                <span className="text-sm font-normal text-white/50 ml-1.5">
                  {suffix}
                </span>
              </>
            ) : (
              stats[key]
            )
          }
          className={valueClass}
        />
      ))}
    </div>
  );
}

interface StatsCardProps {
  label: string;
  value?: number | string | React.ReactNode;
  className?: string;
}

function StatsCard({ label, value, className }: Readonly<StatsCardProps>) {
  return (
    <Card className={cn("backdrop-blur-sm transition-colors", className)}>
      <CardContent>
        <div className="text-xs text-white/50 mb-1">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function StatsCardSkeleton() {
  return (
    <Card className="backdrop-blur-sm transition-colors">
      <CardContent>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
