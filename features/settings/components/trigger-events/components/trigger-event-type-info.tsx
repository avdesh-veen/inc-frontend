"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FlashIcon,
  Tap01Icon,
  Clock01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { Alert, AlertTitle } from "@/components/ui/alert";

interface EventTypeInfo {
  icon: typeof FlashIcon;
  title: string;
  description: string;
  colorClass: string;
}

const eventTypes: EventTypeInfo[] = [
  {
    icon: FlashIcon,
    title: "System Events",
    description:
      "Fired automatically when platform actions occur (submissions, status changes, document requests)",
    colorClass: "text-cyan-300",
  },
  {
    icon: Tap01Icon,
    title: "Manual Events",
    description:
      "Fired when an analyst clicks a button to log an action (contact made, voicemail left)",
    colorClass: "text-amber-300",
  },
  {
    icon: Clock01Icon,
    title: "Scheduled Events",
    description:
      "Fired by time-based conditions (expiring credentials, anniversary dates)",
    colorClass: "text-violet-300",
  },
];

export interface TriggerEventTypeInfoProps {
  className?: string;
}

export function TriggerEventTypeInfo({
  className,
}: Readonly<TriggerEventTypeInfoProps>) {
  return (
    <Alert className={className}>
      <HugeiconsIcon
        icon={InformationCircleIcon}
        className="size-5 text-blue-400 mt-0.5 shrink-0"
        strokeWidth={2}
        aria-hidden="true"
      />
      <div className="flex-1">
        <AlertTitle className="text-sm font-medium text-blue-300">
          Understanding Trigger Event Types
        </AlertTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-2">
          {eventTypes.map((eventType) => (
            <div key={eventType.title}>
              <div className="flex items-center gap-1.5">
                <HugeiconsIcon
                  icon={eventType.icon}
                  className={`size-3.5 ${eventType.colorClass}`}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span className={`text-xs font-medium ${eventType.colorClass}`}>
                  {eventType.title}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {eventType.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Alert>
  );
}
