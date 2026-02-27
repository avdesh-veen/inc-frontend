"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const settingsNavigationSections = [
  {
    id: "workflow",
    label: "Workflow",
    defaultExpanded: true,
    items: [
      {
        id: "work-types",
        label: "Work Types",
        href: "/settings/workflow/work-types",
      },
      { 
        id: "skills", label: "Skills", href: "/settings/workflow/skills" },
      {
        id: "sla-rules",
        label: "SLA Rules",
        href: "/settings/workflow/sla-rules",
      },
      {
        id: "approvals",
        label: "Approvals",
        href: "/settings/workflow/approvals",
      },
      {
        id: "assignment",
        label: "Assignment",
        href: "/settings/workflow/assignment",
      },
      {
        id: "trigger-events",
        label: "Trigger Events",
        href: "/settings/workflow/trigger-events",
      },
      {
        id: "follow-up-rules",
        label: "Follow Up Rules",
        href: "/settings/workflow/follow-up-rules",
      },
      {
        id: "wait-reasons",
        label: "Wait Reasons",
        href: "/settings/workflow/wait-reasons",
      },
    ],
  },
] as const;
/**
 * SettingsSidebar - Navigation sidebar for settings
 */
export function SettingsSidebar() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(
      settingsNavigationSections
        .filter((section) => section.defaultExpanded)
        .map((section) => section.id),
    ),
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  return (
    <aside className="w-56 shrink-0">
      <div className="rounded-[24px] bg-white/3 backdrop-blur-2xl border border-white/6 p-4 sticky top-4">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">
          Configuration
        </h3>

        <nav className="space-y-2" aria-label="Settings navigation">
          {settingsNavigationSections.map((section) => (
            <SettingsSidebarSection
              key={section.id}
              section={section}
              isExpanded={expandedSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
              currentPath={pathname}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}

/**
 * SettingsSidebarSection - Individual section in sidebar
 */
interface SettingsSidebarSectionProps {
  section: (typeof settingsNavigationSections)[number];
  isExpanded: boolean;
  onToggle: () => void;
  currentPath: string;
}

function SettingsSidebarSection({
  section,
  isExpanded,
  onToggle,
  currentPath,
}: Readonly<SettingsSidebarSectionProps>) {
  // Check if any item in this section is active
  const hasActiveTab = section.items.some((item) => currentPath === item.href);

  return (
    <div className="mb-2 last:mb-0">
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors",
          hasActiveTab
            ? "bg-settings-active-bg text-settings-active-text"
            : "text-text-70 hover:bg-glass-bg",
        )}
        aria-expanded={isExpanded}
        aria-controls={`section-${section.id}`}
      >
        {/* <HugeiconsIcon icon={Setting07Icon} className="size-5" strokeWidth={2} />  */}
        <span>⚙️</span>
        <span className="flex-1 text-sm font-medium">{section.label}</span>
        <svg
          className={cn(
            "w-4 h-4 text-text-50 transition-transform",
            isExpanded && "rotate-180",
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div id={`section-${section.id}`} className="ml-6 mt-1 space-y-1">
          {section.items.map((item) => {
            const isActive = currentPath === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "w-full text-left px-3 py-1.5 rounded-md text-sm block transition-colors",
                  isActive
                    ? "bg-settings-active-bg-hover text-settings-active-text"
                    : "text-text-50 hover:text-foreground hover:bg-glass-bg",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
