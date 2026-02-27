"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  findNavigationItemByHref,
  findParentSection,
  getAllNavigationItems,
} from "@/lib/constants/navigation";

interface BreadcrumbSegment {
  label: string;
  href: string;
  isCurrentPage: boolean;
}

/**
 * Return a friendly breadcrumb label for the last segment when the path
 * is a known dynamic route (e.g. user/role detail) so the raw ID is not shown.
 */
function getDynamicSegmentLabel(pathname: string): string | null {
  const path = pathname.split("?")[0];
  const parts = path.split("/").filter(Boolean);

  // /administration/users-roles/:id (user detail)
  if (
    parts.length === 3 &&
    parts[0] === "administration" &&
    parts[1] === "users-roles" &&
    parts[2] !== "new" &&
    parts[2] !== "roles"
  ) {
    return "Update User";
  }

  // /administration/users-roles/new
  if (
    parts.length === 3 &&
    parts[0] === "administration" &&
    parts[1] === "users-roles" &&
    parts[2] === "new"
  ) {
    return "Add User";
  }

  // /administration/users-roles/roles/:id (role detail)
  if (
    parts.length === 4 &&
    parts[0] === "administration" &&
    parts[1] === "users-roles" &&
    parts[2] === "roles"
  ) {
    return "Role Details";
  }

  return null;
}

/**
 * Generate breadcrumb segments from the current pathname
 */
function generateBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  // Find the navigation item that matches the current path
  let navItem = findNavigationItemByHref(pathname);

  // If exact match not found, try to find by partial path match
  if (!navItem) {
    const allItems = getAllNavigationItems();

    // Find the most specific item where pathname starts with the item's base href
    // Sort by href length descending to match the longest (most specific) route first
    let bestMatch: typeof allItems[number] | null = null;
    let bestMatchLength = 0;

    for (const item of allItems) {
      const baseHref = item.href.split("?")[0];
      if (pathname === baseHref || pathname.startsWith(baseHref + "/")) {
        const len = baseHref.length;
        if (len > bestMatchLength) {
          bestMatch = item;
          bestMatchLength = len;
        }
      }
    }

    navItem = bestMatch || undefined;
  }

  if (!navItem) {
    // Fallback: generate from URL segments
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
      return [
        { label: "Dashboard", href: "/my-work/dashboard", isCurrentPage: true },
      ];
    }

    return segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const isLast = index === segments.length - 1;
      const dynamicLabel = isLast ? getDynamicSegmentLabel(pathname) : null;
      const label =
        dynamicLabel ??
        segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

      return {
        label,
        href,
        isCurrentPage: isLast,
      };
    });
  }

  const breadcrumbs: BreadcrumbSegment[] = [];

  // Add parent section if exists
  const parentSection = findParentSection(navItem.id);
  if (parentSection) {
    // Convert section label to title case
    const sectionLabel = parentSection.label
      .split(" ")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");

    breadcrumbs.push({
      label: sectionLabel,
      href: "#",
      isCurrentPage: false,
    });
  }

  // Add current page
  breadcrumbs.push({
    label: navItem.label,
    href: navItem.href,
    isCurrentPage: true,
  });

  return breadcrumbs;
}

export function BreadcrumbNav() {
  const pathname = usePathname();
  const breadcrumbs = React.useMemo(
    () => generateBreadcrumbs(pathname),
    [pathname],
  );

  // Skip the first breadcrumb as there's no actual page for section labels
  // like "Administration", "My Work", etc. - they are just category labels
  const displayBreadcrumbs = breadcrumbs.slice(1);

  // Get the current page title from the last breadcrumb.
  // If there are no display breadcrumbs (e.g., only a section label),
  // fall back to the last original breadcrumb before defaulting to "Dashboard".
  const lastDisplayLabel =
    displayBreadcrumbs.length > 0
      ? displayBreadcrumbs[displayBreadcrumbs.length - 1].label
      : undefined;

  const lastBreadcrumbLabel =
    breadcrumbs.length > 0
      ? breadcrumbs[breadcrumbs.length - 1].label
      : undefined;

  const pageTitle = lastDisplayLabel ?? lastBreadcrumbLabel ?? "Dashboard";

  return (
    <div className="flex flex-col gap-1">
      <Breadcrumb>
        <BreadcrumbList>
          {displayBreadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              <BreadcrumbItem>
                {crumb.isCurrentPage ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < displayBreadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-2xl font-bold text-white">{pageTitle}</h1>
    </div>
  );
}
