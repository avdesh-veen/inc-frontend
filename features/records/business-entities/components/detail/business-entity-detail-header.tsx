"use client";

import Link from "next/link";

import { Building03Icon, Pen01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/lib/constants/navigation";
import type { BusinessEntityDetail } from "@/features/records/business-entities/types";
import { cn } from "@/lib/utils";

interface BusinessEntityDetailHeaderProps {
  entity: BusinessEntityDetail;
}

export function BusinessEntityDetailHeader({
  entity,
}: Readonly<BusinessEntityDetailHeaderProps>) {
  const clientHref = `/records/clients/${entity.clientId}`;
  const entityTypeLabel = entity.entityType ?? entity.type;
  const subtypeLabel = entity.subtype ?? entity.type;
  const primaryNpi2 = entity.primaryNpi2 ?? entity.groupNpis?.[0] ?? "—";

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500">
            <HugeiconsIcon
              icon={Building03Icon}
              className="h-10 w-10 text-white"
              strokeWidth={1.5}
            />
          </div>
          <div className="min-w-0 flex-1">
            <Link
              href={clientHref}
              className="mb-1 block cursor-pointer text-xs font-medium uppercase tracking-wider text-amber-400/80 hover:text-amber-300"
            >
              {entity.clientName} →
            </Link>
            <h2 className="text-2xl font-bold text-white">
              {entity.entityName}
            </h2>
            <p className="text-white/50">
              {entityTypeLabel} • {subtypeLabel}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/50">
              <span>
                Tax ID:{" "}
                <span className="font-mono text-white/70">{entity.taxId}</span>
              </span>
              <span>•</span>
              <span>
                Primary NPI-2:{" "}
                <span className="font-mono text-white/70">{primaryNpi2}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 sm:shrink-0">
          <Badge
            className={cn(
              entity.status === "active"
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-white/10 text-white/70"
            )}
          >
            {entity.status === "active" ? "Active" : "Inactive"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link
              href={appRoutes.records.businessEntityDetails(entity.id, "overview")}
              className="inline-flex items-center"
            >
              <HugeiconsIcon
                icon={Pen01Icon}
                className="h-4 w-4"
                strokeWidth={2}
              />
              Edit
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
