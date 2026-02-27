import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SuccessBadgeProps {
  rate: number;
  variant?: "badge" | "span";
}

export function SuccessBadge({ rate, variant = "badge" }: Readonly<SuccessBadgeProps>) {
  let colorClass = "bg-emerald-500/20 text-emerald-300";
  if (rate < 60) colorClass = "bg-rose-500/20 text-rose-300";
  else if (rate < 80) colorClass = "bg-amber-500/20 text-amber-300";

  if (variant === "span") {
    return (
      <span className={cn("px-2 py-0.5 rounded text-xs font-bold", colorClass)}>
        {rate}%
      </span>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn("text-xs rounded-lg border-0", colorClass)}
    >
      {rate}%
    </Badge>
  );
}
