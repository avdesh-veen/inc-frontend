"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PAYER_CATEGORY_CONFIG, type PayerDetail } from "@/features/records/payer/types";

export function PayerDetailHeader({ payer }: Readonly<{ payer: PayerDetail }>) {
  const router = useRouter();

  const categoryKey = payer.type
    ? payer.type.charAt(0).toUpperCase() + payer.type.slice(1).toLowerCase()
    : "";
  const catConfig = PAYER_CATEGORY_CONFIG[categoryKey];
  const bgClass = catConfig?.bgClass.split(" ")[0] ?? "bg-slate-500/20";

  const stateNames = payer.states.map((s) => s.code).join(", ");

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          {/* Payer icon */}
          <div
            className={cn(
              "w-20 h-20 rounded-2xl flex items-center justify-center shrink-0",
              bgClass,
            )}
            aria-hidden="true"
          >
            <span className="text-4xl">{catConfig?.icon ?? "🏢"}</span>
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground">{payer.name}</h1>

            {payer.abbreviation && (
              <p className="text-sm text-muted-foreground mt-0.5">
                Abbreviation: {payer.abbreviation}
              </p>
            )}

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {payer.type && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs rounded-full border-0",
                    bgClass,
                    catConfig?.colorClass ?? "text-slate-400",
                  )}
                >
                  {catConfig?.icon} {payer.type}
                </Badge>
              )}
              {payer.subCategory && (
                <Badge
                  variant="outline"
                  className="text-xs rounded-lg border-0 bg-white/10 text-white/70"
                >
                  {payer.subCategory}
                </Badge>
              )}
              {payer.parent && (
                <span className="text-xs text-muted-foreground">
                  Parent: {payer.parent}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground flex-wrap">
              {stateNames && <span>States: {stateNames}</span>}
              {stateNames && payer.submissionMethod && (
                <span aria-hidden="true">&bull;</span>
              )}
              {payer.submissionMethod && (
                <span>Submission: {payer.submissionMethod}</span>
              )}
              {payer.tatDays !== null && (
                <>
                  <span aria-hidden="true">&bull;</span>
                  <span>TAT: {payer.tatDays} days</span>
                </>
              )}
            </div>
          </div>

          {/* Status + Edit */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-sm rounded-xl border-0 px-3 py-1.5",
                  payer.isDelegated
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-slate-500/20 text-slate-300",
                )}
              >
                {payer.isDelegated ? "Delegated" : "Non-Delegated"}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "text-sm rounded-xl border-0 px-3 py-1.5",
                  payer.panelStatus
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-rose-500/20 text-rose-300",
                )}
              >
                Panel {payer.panelStatus ? "Open" : "Closed"}
              </Badge>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/records/payers/${payer.id}/edit`)}
              className="gap-2 text-sm"
              aria-label={`Edit ${payer.name}`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
