import "server-only";

import { PaginatedResponse, ApiResponse } from "@/lib/api/types";
import { Role } from "../../types/role-tab";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { fetchServer } from "@/lib/api/server";
import { RoleRequest } from "../../types/role-tab";
import { RoleDetailAPIResponse } from "./roles-api";
import type { ResourcesAPIResponse } from "./resources-api";
import type { RoleCategoriesAPIResponse, RoleCategoriesFilters } from "./role-categories-api";

export async function getRolesListServer(
  request?: RoleRequest,
): Promise<ApiResponse<PaginatedResponse<Role>>> {
  return fetchServer.get<ApiResponse<PaginatedResponse<Role>>>(
    API_ENDPOINTS.roles.list,
    {
      params: request as Record<string, unknown>,
    },
  );
}

/**
 * Fetch role detail by ID (server-side)
 * Returns full role details with permissions
 */
export async function getRoleDetailServer(
  id: string
): Promise<RoleDetailAPIResponse> {
  return fetchServer.get<RoleDetailAPIResponse>(`/roles/${id}`);
}

/**
 * Fetch resources with permissions (server-side)
 * Returns all resources with their available permissions for role form
 */
export async function getResourcesServer(): Promise<ResourcesAPIResponse> {
  return fetchServer.get<ResourcesAPIResponse>(API_ENDPOINTS.roles.resources);
}

/**
 * Fetch role categories (server-side)
 * Returns paginated list of role categories
 */
export async function getRoleCategoriesServer(
  filters?: RoleCategoriesFilters
): Promise<RoleCategoriesAPIResponse> {
  return fetchServer.get<RoleCategoriesAPIResponse>(
    API_ENDPOINTS.roles.categories,
    {
      params: filters as Record<string, unknown>,
    }
  );
}
