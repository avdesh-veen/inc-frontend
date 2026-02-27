"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  getAllNavigationItems,
  findParentSection,
} from "@/lib/constants/navigation";
import type {
  NavigationItem,
  NavigationSection,
} from "@/lib/constants/navigation";

interface ActiveRouteResult {
  activeItem: NavigationItem | null;
  activeSection: NavigationSection | null;
  isActive: (href: string) => boolean;
  isParentActive: (sectionId: string) => boolean;
}

/**
 * Extracts the pathname from a href string, removing any query parameters
 * @param href - The href which may contain query parameters
 * @returns The pathname without query parameters
 */
function getPathFromHref(href: string): string {
  // Handle query strings by extracting only the pathname
  const queryIndex = href.indexOf("?");
  return queryIndex !== -1 ? href.substring(0, queryIndex) : href;
}

/**
 * Hook to detect the currently active navigation item and section
 * based on the current pathname
 */
export function useActiveRoute(): ActiveRouteResult {
  const pathname = usePathname();

  const result = useMemo(() => {
    const allItems = getAllNavigationItems();

    // Find exact match first (comparing pathnames without query strings)
    let activeItem = allItems.find(
      (item) => getPathFromHref(item.href) === pathname
    );

    // If no exact match, find the closest parent route
    if (!activeItem) {
      activeItem = allItems.find((item) => {
        const itemPath = getPathFromHref(item.href);
        // Match if pathname starts with the item's href path
        // e.g., /records/clients/123 matches /records/clients
        return pathname.startsWith(itemPath) && itemPath !== "/";
      });
    }

    const activeSection = activeItem ? findParentSection(activeItem.id) : null;

    return {
      activeItem: activeItem || null,
      activeSection: activeSection || null,
    };
  }, [pathname]);

  const isActive = (href: string): boolean => {
    const hrefPath = getPathFromHref(href);

    if (hrefPath === "/") {
      return pathname === "/";
    }
    return pathname === hrefPath || pathname.startsWith(hrefPath + "/");
  };

  const isParentActive = (sectionId: string): boolean => {
    return result.activeSection?.id === sectionId;
  };

  return {
    ...result,
    isActive,
    isParentActive,
  };
}
