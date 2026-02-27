"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon } from "@hugeicons/core-free-icons";

interface NotificationBellProps {
  badgeCount?: number;
}

export function NotificationBell({ badgeCount = 3 }: Readonly<NotificationBellProps>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className="relative size-10 flex items-center justify-center cursor-pointer rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          aria-label={
            badgeCount > 0
              ? `Notifications. ${badgeCount} unread notifications`
              : "Notifications. No unread notifications"
          }
        >
          <HugeiconsIcon
            icon={Notification01Icon}
            strokeWidth={2}
            className="size-5 text-white/60"
            aria-hidden="true"
          />
          {badgeCount > 0 && (
            <span
              className={cn(
                "absolute -top-1 -right-1",
                "flex items-center justify-center",
                "size-4.5 shrink-0 px-1",
                "text-[10px] font-bold",
                "bg-gradient-to-br from-rose-500 to-pink-600 text-white",
                "rounded-full",
                "border-2 border-background-medium",
              )}
              aria-hidden="true"
            >
              {badgeCount > 9 ? "9+" : badgeCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn("w-80", "bg-background-medium/95 backdrop-blur-xl")}
        role="menu"
        aria-label="Notifications menu"
      >
        <DropdownMenuLabel className="text-base font-semibold">
          Notifications
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-foreground/15" />

        {/* Placeholder notification items */}
        <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
          <div className="font-medium text-sm">New task assigned</div>
          <div className="text-xs text-muted-foreground">
            You have been assigned to Case #12345
          </div>
          <div className="text-xs text-muted-foreground">2 hours ago</div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-foreground/15" />
        <DropdownMenuItem className="justify-center text-sm text-primary">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
