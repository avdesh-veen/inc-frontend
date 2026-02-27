"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { SourceCodeIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type {
  GroupNpiDetail,
  NpiLocationType,
} from "@/features/records/business-entities/types";

interface GroupNpiCardProps {
  npiDetail: GroupNpiDetail;
  className?: string;
}

function getLocationBadge(type: NpiLocationType) {
  switch (type) {
    case "primary":
      return { label: "Primary", className: "bg-emerald-500/20 text-emerald-300" };
    case "service":
      return { label: "Service", className: "bg-slate-500/20 text-slate-300" };
    case "billing":
      return { label: "Billing", className: "bg-blue-500/20 text-blue-300" };
  }
}

export function GroupNpiCard({
  npiDetail,
  className,
}: Readonly<GroupNpiCardProps>) {
  const locationCount = npiDetail.locations.length;

  return (
    <Card
      className={cn(
        "rounded-2xl border-white/5 bg-white/[0.02] backdrop-blur-sm p-5",
        className,
      )}
    >
      <CardContent>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500">
              <HugeiconsIcon
                icon={SourceCodeIcon}
                className="h-6 w-6 text-white"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p className="font-medium text-white">{npiDetail.label}</p>
              <p className="font-mono text-sm text-white/50">
                NPI-2: {npiDetail.npi}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {npiDetail.isPrimary && (
              <Badge className="bg-emerald-500/20 text-emerald-300" size="xs">
                Primary
              </Badge>
            )}
            {locationCount > 0 && (
              <Badge className="bg-slate-500/20 text-slate-300" size="xs">
                {locationCount} Location{locationCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>

        {locationCount > 0 && (
          <div className="mt-4 border-l-2 border-white/10 pl-4">
            <div className="mb-3 text-xs font-bold uppercase text-white/40">
              Service Locations
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {npiDetail.locations.map((location) => {
                const badge = getLocationBadge(location.type);
                return (
                  <div
                    key={location.id}
                    className="rounded-xl border border-white/5 bg-white/[0.02] p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <Badge className={badge.className} size="xs">
                        {badge.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-white">{location.address}</p>
                    <p className="text-sm text-white/50">
                      {location.cityStateZip}
                    </p>
                    {location.phone && (
                      <p className="mt-2 text-xs text-white/40">
                        {location.phone}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
