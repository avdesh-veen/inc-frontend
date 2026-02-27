import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import type { Role, RoleRequest } from "../types/role-tab";
import { getRolesListClient, getRoleDetailClient } from "../api/roles-tab/client";
import { RoleDetailAPIResponse } from "../api/roles-tab/roles-api";

/**
 * Hook to fetch roles list
 *
 * @returns Query hook with roles list data
 */
export function useRolesList(request?: RoleRequest) {
  return useQuery<ApiResponse<PaginatedResponse<Role>>, Error>({
    queryKey: queryKeys.usersRoles.roles.list(request),
    queryFn: () => getRolesListClient(request),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch role detail by ID
 * Returns full role details with permissions
 *
 * @param id - Role ID
 * @returns Query hook with role detail data
 */
export function useRoleDetail(id: string) {
  return useQuery<RoleDetailAPIResponse, Error>({
    queryKey: queryKeys.usersRoles.roles.detail(id),
    queryFn: () => getRoleDetailClient(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
