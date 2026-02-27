"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";
import type { NavigationItem } from "@/lib/constants/navigation";

import { useActiveRoute } from "@/hooks/use-active-route";

import {
  SidebarMenuItem as SidebarMenuItemBase,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";

interface SidebarMenuItemProps {
  item: NavigationItem;
}

/**
 * SidebarMenuItem - Individual navigation menu item component
 *
 * Renders a single navigation link with icon, label, and optional badge count.
 * Automatically highlights when the current route matches the item's href.
 *
 * @param props - Component props
 * @param props.item - Navigation item configuration
 * @returns Rendered menu item
 */
export function SidebarMenuItem({ item }: Readonly<SidebarMenuItemProps>) {
  const { isActive } = useActiveRoute();
  const active = isActive(item.href);

  return (
    <SidebarMenuItemBase>
      <SidebarMenuButton
        asChild
        isActive={active}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-2xl",
          "transition-all duration-200 ease-linear",
          "motion-reduce:transition-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          active && [
            "bg-primary/15 text-primary",
            "hover:bg-primary/20 hover:text-primary",
          ],
        )}
      >
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          aria-label={
            item.badge ? `${item.label} (${item.badge} items)` : item.label
          }
        >
          <HugeiconsIcon
            icon={item.icon}
            className="w-5 h-5"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span>{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <SidebarMenuBadge
              className={cn(
                "ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold",
                "bg-primary/20 text-primary",
              )}
              aria-label={`${item.badge} unread items`}
            >
              {item.badge}
            </SidebarMenuBadge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItemBase>
  );
}
