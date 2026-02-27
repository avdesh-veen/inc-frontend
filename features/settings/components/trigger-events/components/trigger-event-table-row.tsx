/**
 * TriggerEventTableRow Component
 *
 * Server-side table row component for displaying a single trigger event.
 * Uses shadcn/ui Table and Badge components.
 */

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FlashIcon, Tap01Icon, Clock01Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";

import type {
  TriggerEvent,
  TriggerEventType,
  TriggerEventWorkCategory,
} from "../../../types/trigger-events";
import { TriggerEventActions } from "./trigger-event-actions";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Helper to show tooltip only if text is truncated
function TruncatedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [truncated, setTruncated] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setTruncated(
      el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight,
    );
  }, [text]);

  const contentDiv = (
    <div ref={ref} className={className}>
      {text}
    </div>
  );

  if (truncated) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{contentDiv}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-70">
          {text}
        </TooltipContent>
      </Tooltip>
    );
  }
  return contentDiv;
}

// Type badge styles mapping
const typeBadgeStyles: Record<TriggerEventType, string> = {
  system: "bg-cyan-500/20 text-cyan-300",
  manual: "bg-amber-500/20 text-amber-300",
  scheduled: "bg-violet-500/20 text-violet-300",
};

// Type icons mapping
const typeIcons: Record<TriggerEventType, typeof FlashIcon> = {
  system: FlashIcon,
  manual: Tap01Icon,
  scheduled: Clock01Icon,
};

// Category badge styles mapping
const categoryBadgeStyles: Record<string, string> = {
  All: "bg-muted text-muted-foreground",
  Enrollment: "bg-chart-3/20 text-chart-3",
  Credentialing: "bg-primary/20 text-primary",
  Licensing: "bg-chart-2/20 text-chart-2",
  CAQH: "bg-chart-1/20 text-chart-1",
};

export interface TriggerEventTableRowProps {
  /**
   * The trigger event to display
   */
  event: TriggerEvent;

  /**
   * Callback when edit is clicked
   */
  onEdit: (eventId: string) => void;
}

export function TriggerEventTableRow({
  event,
  onEdit,
}: Readonly<TriggerEventTableRowProps>) {
  const TypeIcon = typeIcons[event.type];

  return (
    <TableRow>
      <TableCell className="max-w-40 align-top">
        <TruncatedText
          text={event.name}
          className="font-medium text-foreground truncate"
        />
        <TruncatedText
          text={event.description}
          className="mt-0.5 text-xs text-muted-foreground truncate"
        />
      </TableCell>

      <TableCell>
        <Badge variant="outline" size="sm">
          {event.code}
        </Badge>
      </TableCell>

      <TableCell>
        <Badge
          size="sm"
          className={cn("gap-1.5 rounded-md", typeBadgeStyles[event.type])}
        >
          <HugeiconsIcon
            icon={TypeIcon}
            className="size-3.5"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
        </Badge>
      </TableCell>

      <TableCell>
        {(() => {
          const works = (event?.triggerEventWorkCategories || []).filter(
            (work): work is TriggerEventWorkCategory & { workCategory: NonNullable<TriggerEventWorkCategory['workCategory']> } => 
              work.workCategory !== null && work.workCategory !== undefined,
          );
          const maxVisible = 2;
          const visible = works.slice(0, maxVisible);
          const extra = works.length - maxVisible;
          const allChips = (
            <div className="flex flex-wrap gap-1.5">
              {works.map((work) => (
                <Badge
                  size="sm"
                  key={work.workCategory.id}
                  className={cn(
                    "rounded-md",
                    categoryBadgeStyles[work.workCategory.code] || "bg-muted text-muted-foreground",
                  )}
                >
                  {work.workCategory.code}
                </Badge>
              ))}
            </div>
          );
          const displayChips = (
            <div className="flex gap-1.5">
              {visible.map((work) => (
                <Badge
                  size="sm"
                  key={work.workCategory.id}
                  className={cn(
                    " rounded-md",
                    categoryBadgeStyles[work.workCategory.code] || "bg-muted text-muted-foreground",
                  )}
                >
                  {work.workCategory.code}
                </Badge>
              ))}
              {extra > 0 ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge size="sm" variant="outline" className="rounded-full">
                      +{extra}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-80 bg-white/3 backdrop-blur-2xl"
                  >
                    {allChips}
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </div>
          );
          return displayChips;
        })()}
      </TableCell>

      <TableCell className="text-xs text-muted-foreground">
        {event.firedBy || "—"}
      </TableCell>

      <TableCell className="text-center">
        {event.rulesCount && event.rulesCount > 0 ? (
          <Badge variant="tertiaryLight" className="rounded-full">
            {event.rulesCount}
          </Badge>
        ) : (
          <Badge variant="tertiaryLight" className="rounded-full">
            0
          </Badge>
        )}
      </TableCell>

      <TriggerEventActions event={event} onEdit={onEdit} />
    </TableRow>
  );
}
