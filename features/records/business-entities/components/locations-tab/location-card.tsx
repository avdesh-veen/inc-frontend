"use client";

import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Call02Icon, UserIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type {
  EntityLocation,
  LocationType,
} from "@/features/records/business-entities/types";

interface LocationCardProps {
  location: EntityLocation;
  className?: string;
}

function getTypeBadge(type: LocationType) {
  switch (type) {
    case "service":
      return { label: "Service", className: "bg-emerald-500/20 text-emerald-300" };
    case "billing":
      return { label: "Billing", className: "bg-blue-500/20 text-blue-300" };
    case "mailing":
      return { label: "Mailing", className: "bg-slate-500/20 text-slate-300" };
  }
}

export function LocationCard({
  location,
  className,
}: Readonly<LocationCardProps>) {
  const typeBadge = getTypeBadge(location.type);
  const hasHours = location.hoursOfOperation && location.hoursOfOperation.length > 0;
  const hasPayerIds = location.payerLocationIds && location.payerLocationIds.length > 0;

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-colors hover:border-white/20",
        className,
      )}
    >
      {/* Tags */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex flex-wrap gap-2">
          <Badge className={typeBadge.className} size="xs">
            {typeBadge.label}
          </Badge>
          {location.isPrimary && (
            <Badge className="bg-amber-500/20 text-amber-300" size="xs">
              Primary
            </Badge>
          )}
          {location.isAdaAccessible && (
            <Badge
              className="bg-blue-500/20 text-blue-300"
              size="xs"
              title="ADA Accessible"
            >
              ♿ ADA
            </Badge>
          )}
          {location.isPrivate && (
            <Badge
              className="bg-slate-500/20 text-slate-300"
              size="xs"
              title="Do Not Publish in Directory"
            >
              🔒 Private
            </Badge>
          )}
        </div>
      </div>

      {/* NPI Reference */}
      {location.npiRef && (
        <p className="mb-2 text-xs text-violet-400">
          NPI-2: {location.npiRef}
          {location.npiLabel && ` (${location.npiLabel})`}
        </p>
      )}

      {/* Address */}
      <div className="space-y-2">
        <p className="font-medium text-white">{location.address}</p>
        <p className="text-white/60">{location.cityStateZip}</p>

        {/* Phone */}
        {location.phone && (
          <p className="mt-3 flex items-center gap-2 text-sm text-white/50">
            <HugeiconsIcon
              icon={Call02Icon}
              className="h-4 w-4 shrink-0"
              strokeWidth={2}
            />
            {location.phone}
          </p>
        )}

        {/* Manager */}
        {location.manager && (
          <p className="flex items-center gap-2 text-sm text-white/50">
            <HugeiconsIcon
              icon={UserIcon}
              className="h-4 w-4 shrink-0"
              strokeWidth={2}
            />
            Manager: {location.manager}
          </p>
        )}

        {/* Hours of Operation */}
        {hasHours && (
          <div className="mt-3 border-t border-white/5 pt-3">
            <p className="mb-2 text-xs font-medium uppercase text-white/40">
              Hours of Operation
            </p>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {location.hoursOfOperation!.map((h) => (
                <span key={h.day} className="text-white/60">
                  {h.day}:{" "}
                  <span className="text-white/80">{h.hours}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Payer Location IDs */}
        {hasPayerIds && (
          <div className="mt-3 border-t border-white/5 pt-3">
            <p className="mb-2 text-xs font-medium uppercase text-white/40">
              Payer Location IDs
            </p>
            <div className="flex flex-wrap gap-2">
              {location.payerLocationIds!.map((p) => (
                <span
                  key={`${p.payerName}-${p.locationId}`}
                  className="rounded bg-white/5 px-2 py-1 text-xs"
                >
                  <span className="text-white/60">{p.payerName}:</span>{" "}
                  <span className="font-mono text-white">{p.locationId}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
