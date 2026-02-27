import { CardContent } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useUserStats } from "../../hooks/use-users";

export function StatsGrid() {
  const { data, isLoading, isError } = useUserStats();
  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard label="Total Users" value={0} />
        <StatsCard label="Internal (Neolytix)" value={0} />
        <StatsCard label="External (Clients)" value={0} />
        <StatsCard label="Active Users" value={0} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatsCard label="Total Users" value={stats?.total} />
      <StatsCard label="Internal (Neolytix)" value={stats?.internal} className="text-blue-400" />
      <StatsCard label="External (Clients)" value={stats?.external} className="text-emerald-400" />
      <StatsCard label="Active Users" value={stats?.active} className="text-violet-400" />
    </div>
  );
}

interface StatsCardProps {
  label: string;
  value?: number | string;
  icon?: React.ReactNode;
  className?: string;
}

function StatsCard({ label, value, icon, className }: Readonly<StatsCardProps>) {
  return (
    <Card
      className={cn("backdrop-blur-sm transition-colors", className)}
    >
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{value}</span>
          {icon && <span className="text-muted-foreground">{icon}</span>}
        </div>
        <div className="text-xs text-white/50">{label}</div>
      </CardContent>
    </Card>
  );
}

function StatsCardSkeleton() {
  return (
    <Card className="backdrop-blur-sm transition-colors">
      <CardContent className="flex flex-col gap-1 pt-0">
        <div className="flex items-center justify-between">
          <Skeleton className="w-20 h-20" />
        </div>
      </CardContent>
    </Card>
  );
}
