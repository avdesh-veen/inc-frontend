"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

import { SidebarFooter } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserMenu } from "./user-menu";

import { useCurrentUser } from "@/features/auth/hooks/use-auth";

/**
 * Get user initials from full name
 * @param name - User's full name
 * @returns Two-letter initials (first + last, or first two letters)
 */
function getUserInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * SidebarUser - User profile section component for sidebar footer
 *
 * Displays user avatar, name, and role with a dropdown menu for user actions.
 * Shows avatar with fallback initials and gradient background.
 * Automatically fetches current user data and integrates logout functionality.
 *
 * @param props - Component props
 * @returns Rendered user profile section
 */
export function SidebarUser() {
  const { data: userData } = useCurrentUser();

  const firstName = userData?.data?.firstName?.trim() ?? "";
  const lastName = userData?.data?.lastName?.trim() ?? "";
  const displayName = [firstName, lastName].filter(Boolean).join(" ");
  const displayRole = userData?.data?.roleName ?? "No role";
  const trimmedDisplayName = displayName.trim();
  const initials = trimmedDisplayName
    ? getUserInitials(trimmedDisplayName)
    : "…";

  return (
    <SidebarFooter className={cn("p-4 border-t")}>
      <UserMenu>
        <button
          className={cn(
            "flex items-center gap-3 w-full p-3 rounded-2xl",
            "bg-transparent hover:bg-sidebar-accent cursor-pointer transition-colors",
            "transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary/50",
          )}
          aria-label="Open user menu"
        >
          <Avatar size="default">
            <AvatarFallback
              className={cn(
                "bg-rose-500/20 dark:bg-gradient-to-br dark:from-rose-500 dark:to-pink-600",
                "text-white/70 dark:text-white text-sm font-bold",
              )}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0 text-left">
            <span className="text-sm font-medium text-sidebar-foreground truncate">
              {displayName}
            </span>
            <span className="text-xs text-sidebar-foreground/50 truncate">
              {displayRole}
            </span>
          </div>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            className="text-sidebar-foreground/50 shrink-0"
          />
        </button>
      </UserMenu>
    </SidebarFooter>
  );
}
