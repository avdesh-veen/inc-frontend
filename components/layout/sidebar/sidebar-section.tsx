"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import type { NavigationSection } from "@/lib/constants/navigation";

import { useActiveRoute } from "@/hooks/use-active-route";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SidebarMenuItem } from "./sidebar-menu-item";

interface SidebarSectionProps {
  section: NavigationSection;
}

/**
 * SidebarSection - Navigation section container component
 *
 * Renders a group of navigation items under a section header. Supports both
 * collapsible and non-collapsible sections. Auto-expands when a child item
 * is active.
 *
 * @param props - Component props
 * @param props.section - Navigation section configuration
 * @returns Rendered navigation section
 */
export function SidebarSection({ section }: Readonly<SidebarSectionProps>) {
  const { isParentActive } = useActiveRoute();
  const isActive = isParentActive(section.id);
  const [isOpen, setIsOpen] = React.useState(isActive);

  // Auto-expand when a child item becomes active
  React.useEffect(() => {
    if (isActive) {
      setIsOpen(true);
    }
  }, [isActive]);

  if (!section.collapsible) {
    return (
      <SidebarGroup className="mb-6" aria-label={section.label}>
        <SidebarGroupLabel
          className={cn(
            "px-4 mb-3 text-[10px] font-bold text-white/50 uppercase tracking-widest",
          )}
        >
          {section.label}
        </SidebarGroupLabel>
        <SidebarMenu className="space-y-1">
          {section.items.map((item) => (
            <SidebarMenuItem key={item.id} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
      <SidebarGroup aria-label={section.label}>
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel
            className={cn(
              "px-4 mb-3 text-[10px] font-bold text-white/50 uppercase tracking-widest",
              "flex items-center justify-between cursor-pointer",
              "transition-colors duration-200 ease-linear",
              "motion-reduce:transition-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
            aria-expanded={isOpen}
            aria-controls={`section-${section.id}`}
          >
            {/* <span>{section.label}</span> */}
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              className={cn(
                "w-4 h-4 transition-transform duration-200 ease-linear",
                "motion-reduce:transition-none",
                isOpen && "rotate-180",
              )}
              strokeWidth={2}
              aria-hidden="true"
            />
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent id={`section-${section.id}`}>
          <SidebarMenu className="space-y-1">
            {section.items.map((item) => (
              <SidebarMenuItem key={item.id} item={item} />
            ))}
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
