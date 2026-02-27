"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { SidebarHeader } from "@/components/ui/sidebar";
import { appRoutes } from "@/lib/constants/navigation";
import { AppLogo } from "@/components/shared/app-logo";

/**
 * Props for the SidebarBrand component
 */
interface SidebarBrandProps {
  /** Optional CSS class name for custom styling */
  className?: string;
}

/**
 * SidebarBrand - Brand header component for the sidebar
 *
 * Displays the application logo, title with gradient effect, and version number.
 * Clicking the logo navigates to the dashboard.
 *
 * @param props - Component props
 * @param props.className - Optional CSS class for custom styling
 * @returns Rendered brand header
 */
export function SidebarBrand({ className }: Readonly<SidebarBrandProps>) {
  return (
    <SidebarHeader className={cn("p-6 border-b border-white/5", className)}>
      <Link
        href={appRoutes.myWork.dashboard}
        className="flex items-center gap-3 group transition-opacity hover:opacity-90"
        aria-label="Navigate to dashboard"
      >
        <AppLogo />
      </Link>
    </SidebarHeader>
  );
}
