"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BreadcrumbNav } from "./breadcrumb-nav";
import { SearchBar } from "./search-bar";
import { NotificationBell } from "./notification-bell";
import { ThemeToggle } from "./theme-toggle";

/**
 * Defer rendering Radix-heavy toolbar actions until after mount to avoid
 * server/client ID mismatch (hydration error) from Radix useId().
 */
function TopNavToolbar() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div
        className="flex h-9 w-48 items-center gap-3 opacity-0"
        role="presentation"
        aria-hidden
      >
        <span className="h-9 flex-1" />
        <span className="h-9 w-9" />
        <span className="h-9 w-9" />
      </div>
    );
  }
  return (
    <>
      <SearchBar />
      <NotificationBell />
      <ThemeToggle />
    </>
  );
}

/**
 * TopNav - Top navigation bar component
 *
 * Displays the main navigation bar with sidebar trigger, breadcrumb navigation,
 * search bar, notifications, and theme toggle. Features glass morphism styling
 * and sticky positioning.
 *
 * @component
 * @example
 * ```tsx
 * <TopNav />
 * ```
 *
 * Features:
 * - Sticky positioning at top of viewport
 * - Glass morphism effect with backdrop blur
 * - Sidebar trigger button (Cmd/Ctrl+B)
 * - Dynamic breadcrumb navigation
 * - Global search bar with ⌘K shortcut
 * - Notification bell with badge count
 * - Theme toggle (dark/light)
 * - Responsive layout
 * - Keyboard accessible
 *
 * Layout:
 * - Left: Sidebar trigger + Breadcrumb
 * - Right: Search + Notifications + Theme toggle
 *
 * @param props - Standard HTML header element props
 * @param props.className - Optional CSS class for custom styling
 * @returns Rendered top navigation bar
 */
export function TopNav({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "backdrop-blur-xl",
        "bg-navbar-bg border-b border-sidebar-border",
        "transition-all duration-200 ease-linear",
        "motion-reduce:transition-none",
        className,
      )}
      role="banner"
      aria-label="Top navigation"
      {...props}
    >
      <div className="flex h-21.25 items-center gap-4 px-8">
        {/* Left Section: Sidebar Trigger + Breadcrumb */}
        <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger
            className="size-10 flex items-center justify-center cursor-pointer rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors [&>svg]:size-5 [&>svg]:text-white/60"
            aria-label="Toggle sidebar"
          />
          <BreadcrumbNav />
        </div>

        {/* Right Section: Search + Notifications + Theme Toggle (client-only to avoid Radix hydration mismatch) */}
        <div
          className="flex items-center gap-3"
          role="toolbar"
          aria-label="Top navigation actions"
        >
          <TopNavToolbar />
        </div>
      </div>
    </header>
  );
}
