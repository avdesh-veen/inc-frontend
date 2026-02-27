"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PAYER_CATEGORY_CONFIG, type PayerListItem, type PayerRequest } from "@/features/records/payer/types";
import { usePayersList } from "@/features/records/payer/hooks/use-payers";

interface PayerTableProps {
  request: PayerRequest;
}

const thClass = "px-4 py-3 text-left text-[10px] font-bold text-white/50 uppercase";

/** Maps PayerType enum values from the API to PAYER_CATEGORY_CONFIG keys */
const TYPE_TO_CATEGORY: Record<string, string> = {
  government: "Government",
  commercial: "Commercial",
  workers_comp: "Workers Comp",
};

/** Fallback category key that is guaranteed to exist in PAYER_CATEGORY_CONFIG */
const DEFAULT_CATEGORY_KEY = Object.keys(PAYER_CATEGORY_CONFIG)[0] as keyof typeof PAYER_CATEGORY_CONFIG;

/** Resolve API type value to a PAYER_CATEGORY_CONFIG display key */
function resolveCategoryKey(type: string | null): keyof typeof PAYER_CATEGORY_CONFIG {
  if (!type) {
    return DEFAULT_CATEGORY_KEY;
  }

  const mappedKey = TYPE_TO_CATEGORY[type.toLowerCase()];
  return (mappedKey as keyof typeof PAYER_CATEGORY_CONFIG) ?? DEFAULT_CATEGORY_KEY;
}

export function PayerTable({ request }: Readonly<PayerTableProps>) {
  const router = useRouter();

  const { data, isLoading, isError } = usePayersList(request);

  const payers = data?.data?.items ?? [];

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow className="border-b border-white/5 bg-white/[0.02] hover:bg-transparent">
            {["Payer", "Category", "Subcategory", "States", "Delegated", "Panel", "TAT"].map((h) => (
              <TableHead key={h} className={thClass}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: (request.limit ?? 10) > 10 ? 10 : (request.limit ?? 10) }).map((_, i) => (
            <TableRow key={i} className="border-b border-white/5">
              <TableCell className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-xl" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </TableCell>
              {Array.from({ length: 6 }).map((_, j) => (
                <TableCell key={j} className="px-4 py-4">
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (isError) {
    return (
      <div className="py-16 text-center space-y-2">
        <p className="text-muted-foreground text-sm">Failed to load payers. Please try again.</p>
      </div>
    );
  }

  if (payers.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No payers found matching your filters.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-white/5 bg-white/[0.02] hover:bg-transparent">
          {["Payer", "Category", "Subcategory", "States", "Delegated", "Panel", "TAT"].map((h) => (
            <TableHead key={h} className={thClass}>{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {payers.map((payer) => (
          <PayerRow
            key={payer.id}
            payer={payer}
            onClick={() => router.push(`/records/payers/${payer.id}`)}
          />
        ))}
      </TableBody>
    </Table>
  );
}

function PayerRow({ payer, onClick }: Readonly<{ payer: PayerListItem; onClick: () => void }>) {
  const categoryKey = resolveCategoryKey(payer.type);
  const catConfig = PAYER_CATEGORY_CONFIG[categoryKey];
  const catBadgeBg = catConfig?.bgClass.split(" ")[0] ?? "bg-slate-500/20";

  const stateLabels = payer.states?.length
    ? payer.states.map((s) => s.code ?? s.name).join(", ")
    : "—";

  return (
    <TableRow
      className="border-b border-white/5 cursor-pointer hover:bg-white/[0.02]"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); }
      }}
      aria-label={`View details for ${payer.name}`}
    >
      {/* Payer name + abbreviation */}
      <TableCell className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className={cn("size-10 rounded-xl flex items-center justify-center", catBadgeBg)}>
            <span className="text-lg">{catConfig?.icon ?? "🏢"}</span>
          </div>
          <div>
            <p className="font-medium text-white">{payer.name}</p>
            {(payer.abbreviation ?? payer.shortName) && (
              <p className="text-[10px] text-white/40">{payer.abbreviation ?? payer.shortName}</p>
            )}
          </div>
        </div>
      </TableCell>

      {/* Category */}
      <TableCell className="px-4 py-4">
        <Badge
          variant="outline"
          className={cn("text-[10px] rounded-full border-0", catBadgeBg, catConfig?.colorClass ?? "text-slate-400")}
        >
          {catConfig?.icon} {categoryKey}
        </Badge>
      </TableCell>

      {/* Subcategory */}
      <TableCell className="px-4 py-4 text-xs text-white/60">
        {payer.subCategory ?? "—"}
      </TableCell>

      {/* States */}
      <TableCell className="px-4 py-4 text-sm text-white/60">
        {stateLabels}
      </TableCell>

      {/* Delegated */}
      <TableCell className="px-4 py-4">
        <Badge
          variant="outline"
          className={cn(
            "text-xs rounded-lg border-0",
            payer.isDelegated ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-500/20 text-slate-300",
          )}
        >
          {payer.isDelegated ? "Yes" : "No"}
        </Badge>
      </TableCell>

      {/* Panel status */}
      <TableCell className="px-4 py-4">
        <Badge
          variant="outline"
          className={cn(
            "text-xs rounded-lg border-0",
            payer.panelStatus ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300",
          )}
        >
          {payer.panelStatus ? "Open" : "Closed"}
        </Badge>
      </TableCell>

      {/* TAT */}
      <TableCell className="px-4 py-4 text-white font-medium">
        {payer.tatDays != null ? `${payer.tatDays} days` : "—"}
      </TableCell>
    </TableRow>
  );
}
