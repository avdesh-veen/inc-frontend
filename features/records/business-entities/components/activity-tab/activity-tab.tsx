"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon } from "@hugeicons/core-free-icons";
import type { BusinessEntityDetail } from "@/features/records/business-entities/types";
import { ActivityList } from "./activity-list";

interface ActivityTabProps {
  entity: BusinessEntityDetail;
}

const ACTIVITY_FILTERS = [
  { value: "all", label: "All Activity" },
  { value: "CREATE", label: "Creations" },
  { value: "UPDATE", label: "Updates" },
] as const;

export function ActivityTab({ entity: _entity }: Readonly<ActivityTabProps>) {
  const [filter, setFilter] = React.useState("all");

  return (
    <Card className="rounded-[24px] border-white/10 bg-white/[0.02] backdrop-blur-sm">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Activity History</h3>
            <p className="mt-1 text-xs text-white/50">
              All recorded actions for this business entity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger size="xs" className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_FILTERS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="muted" size="xs" className="gap-2">
              <HugeiconsIcon
                icon={Download01Icon}
                className="h-4 w-4"
                strokeWidth={2}
              />
              Export
            </Button>
          </div>
        </div>

        {/* Activity List */}
        <ActivityList filter={filter} />
      </CardContent>
    </Card>
  );
}
