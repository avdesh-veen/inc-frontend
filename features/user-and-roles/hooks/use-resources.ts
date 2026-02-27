/**
 * Resources Query Hooks
 *
 * Custom hooks using TanStack Query for resources data operations.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import {
  fetchResources,
  type ResourcesAPIResponse,
} from "../api/roles-tab/resources-api";

/**
 * Hook to fetch resources with permissions
 * Data is prefetched server-side via RoleFormBoundary
 */
export function useResources() {
  return useQuery<ResourcesAPIResponse, Error>({
    queryKey: queryKeys.usersRoles.resources.list(),
    queryFn: fetchResources,
    staleTime: 10 * 60 * 1000, // 10 minutes (resources don't change often)
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
