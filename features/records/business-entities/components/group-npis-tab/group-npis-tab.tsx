"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, Add01Icon } from "@hugeicons/core-free-icons";
import type { BusinessEntityDetail } from "@/features/records/business-entities/types";
import { GroupNpiCard } from "./group-npi-card";

interface GroupNpisTabProps {
  entity: BusinessEntityDetail;
}

export function GroupNpisTab({ entity }: Readonly<GroupNpisTabProps>) {
  const npiDetails =
    entity.groupNpiDetails && entity.groupNpiDetails.length > 0
      ? entity.groupNpiDetails
      : entity.groupNpis?.map((npi) => ({ npi, label: npi, isPrimary: false, locations: [] })) ?? [];
  const hasDetails = npiDetails.length > 0;

  return (
    <Card className="rounded-[24px] border-white/10 bg-white/[0.02] backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            Group NPIs (NPI-2)
          </h3>
          <div className="flex gap-2">
            <Button variant="muted" size="xs" className="gap-2">
              <HugeiconsIcon
                icon={Download01Icon}
                className="h-3.5 w-3.5"
                strokeWidth={2}
              />
              Export
            </Button>
            <Button
              variant="default"
              size="sm"
              className="gap-1"
            >
              <HugeiconsIcon
                icon={Add01Icon}
                className="h-4 w-4"
                strokeWidth={2}
              />
              Add Group NPI
            </Button>
          </div>
        </div>

        {hasDetails ? (
          <div className="space-y-4">
            {npiDetails.map((detail) => (
              <GroupNpiCard key={detail.npi} npiDetail={detail} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-white/50">
              No group NPIs on file for this entity.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
