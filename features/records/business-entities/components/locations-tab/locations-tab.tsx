"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, Add01Icon } from "@hugeicons/core-free-icons";
import type { BusinessEntityDetail } from "@/features/records/business-entities/types";
import { LocationCard } from "./location-card";

interface LocationsTabProps {
  entity: BusinessEntityDetail;
}

export function LocationsTab({ entity }: Readonly<LocationsTabProps>) {
  const locations = entity.locations ?? [];
  const hasLocations = locations.length > 0;

  return (
    <Card className="rounded-[24px] border-white/10 bg-white/[0.02] backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Locations</h3>
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
              className="gap-1 bg-amber-500/20 text-amber-300 shadow-none hover:bg-amber-500/30"
            >
              <HugeiconsIcon
                icon={Add01Icon}
                className="h-4 w-4"
                strokeWidth={2}
              />
              Add Location
            </Button>
          </div>
        </div>

        {hasLocations ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-white/50">
              No locations on file for this entity.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
