"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { getPhase1Navigation, hasPermission } from "@/lib/constants/navigation";
import { SidebarSection } from "./sidebar-section";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarUser } from "./sidebar-user";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";

/**
 * AppSidebar - Main application sidebar navigation component
 *
 * Displays the primary navigation menu with brand header, navigation sections,
 * and user profile. Features glass morphism styling, collapsible sections,
 * responsive behavior, and permission-based filtering.
 *
 * Always renders the same structure (never return null) so server and client
 * tree match and Radix/useId hydration stays in sync.
 *
 * @param props - All props from shadcn/ui Sidebar component
 * @returns Rendered sidebar navigation
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const phase1Navigation = getPhase1Navigation();
  const { data: user } = useCurrentUser();

  const visibleItems = phase1Navigation
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => hasPermission(user?.data ?? null, item)),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <Sidebar
      className={cn(
        "border-r",
        "backdrop-blur-xl",
        "transition-all duration-200 ease-linear",
        "motion-reduce:transition-none",
      )}
      aria-label="Main navigation"
      {...props}
    >
      <SidebarBrand />

      <SidebarContent
        className="px-3 py-6 overflow-y-auto"
        aria-label="Primary navigation menu"
      >
        {visibleItems.map((section) => (
          <SidebarSection key={section.id} section={section} />
        ))}
      </SidebarContent>

      <SidebarUser />
    </Sidebar>
  );
}
