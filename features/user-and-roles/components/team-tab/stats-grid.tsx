import { CardContent } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTeamStats } from "../../hooks/use-teams";

export function TeamStatsGrid() {
  const { data, isLoading, isError } = useTeamStats();
  const stats = data?.data;

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

  if (isError || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Teams" value={0} className="text-destructive" />
        <StatsCard
          label="Total Members"
          value={0}
          className="text-destructive"
        />
        <StatsCard
          label="Avg Team Size"
          value={0}
          className="text-destructive"
        />
        <StatsCard
          label="Active Teams"
          value={0}
          className="text-destructive"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        label="Total Teams"
        value={stats.total}
        className={stats.total === 0 ? "text-destructive" : undefined}
      />
      <StatsCard
        label="Total Members"
        value={stats.totalMembers}
        className={
          stats.totalMembers === 0 ? "text-destructive" : "text-blue-400"
        }
      />
      <StatsCard
        label="Avg Team Size"
        value={stats.avgTeamSize}
        className={
          stats.avgTeamSize === 0 ? "text-destructive" : "text-emerald-400"
        }
      />
      <StatsCard
        label="Active Teams"
        value={stats.active}
        className={stats.active === 0 ? "text-destructive" : "text-violet-400"}
      />
    </div>
  );
}

interface StatsCardProps {
  label: string;
  value?: number | string;
  icon?: React.ReactNode;
  className?: string;
}

function StatsCard({ label, value, icon, className }: StatsCardProps) {
  return (
    <Card className={cn("backdrop-blur-sm transition-colors", className)}>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {icon && <span className="text-muted-foreground">{icon}</span>}
        </div>
        <div className="text-xs text-foreground/50">{label}</div>
      </CardContent>
    </Card>
  );
}

function StatsCardSkeleton() {
  return (
    <Card className="backdrop-blur-sm transition-colors gap-2">
      <Skeleton className="w-15 h-10" />
      <Skeleton className="w-30 h-7" />
    </Card>
  );
}
