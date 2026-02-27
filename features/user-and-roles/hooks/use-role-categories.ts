/**
 * Role Categories Query Hooks
 *
 * Custom hooks using TanStack Query for role categories data operations.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import {
  fetchRoleCategories,
  type RoleCategoriesAPIResponse,
  type RoleCategoriesFilters,
} from "../api/roles-tab/role-categories-api";

/**
 * Hook to fetch role categories with optional filters
 * Data is prefetched server-side via RoleFormBoundary
 */
export function useRoleCategories(filters?: RoleCategoriesFilters) {
  return useQuery<RoleCategoriesAPIResponse, Error>({
    queryKey: queryKeys.usersRoles.roleCategories.list(filters),
    queryFn: () => fetchRoleCategories(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes (categories don't change often)
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
