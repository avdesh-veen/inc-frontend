import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { PaginatedResponse ,ApiResponse} from "@/lib/api/types";
import { ExternalRole } from "../../types/external-role-tab";
import { RoleRequest } from "../../types/role-tab";

export async function getExternalRoleList(
    request?: RoleRequest,
  ): Promise<ApiResponse<PaginatedResponse<ExternalRole>>> {
    return apiClient.get<ApiResponse<PaginatedResponse<ExternalRole>>>(
      API_ENDPOINTS.roles.list,
      {
        params: request as Record<string, unknown>,
      },
    );
  }