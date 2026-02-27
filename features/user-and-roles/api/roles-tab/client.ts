import { PaginatedResponse, ApiResponse } from "@/lib/api/types";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import { RoleRequest, Role } from "../../types/role-tab";
import { RoleDetailAPIResponse } from "./roles-api";

export async function getRolesListClient(
  request?: RoleRequest,
): Promise<ApiResponse<PaginatedResponse<Role>>> {
  return apiClient.get<ApiResponse<PaginatedResponse<Role>>>(
    API_ENDPOINTS.roles.list,
    {
      params: request as Record<string, unknown>,
    },
  );
}

/**
 * Fetch role detail by ID (client-side)
 * Returns full role details with permissions
 */
export async function getRoleDetailClient(
  id: string
): Promise<RoleDetailAPIResponse> {
  return apiClient.get<RoleDetailAPIResponse>(`/roles/${id}`);
}
