"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { TaskDaily01Icon } from "@hugeicons/core-free-icons";

interface ActivityListProps {
  filter: string;
}

export function ActivityList({ filter }: Readonly<ActivityListProps>) {
  void filter;
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <HugeiconsIcon
        icon={TaskDaily01Icon}
        className="mx-auto mb-3 h-12 w-12 text-white/20"
        strokeWidth={1.5}
      />
      <p className="text-sm text-white/50">No activity recorded yet</p>
      <p className="mt-1 text-xs text-white/30">
        Activities will appear here as actions are performed
      </p>
    </div>
  );
}
