import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApplyDefaultWorkTypeRulesRequest, ApplyDefaultWorkTypeRulesResponse, WorkTypeRulesRequest, WorkTypeRulesResponse } from "@/features/settings/types/approvals/work-type-rules";

/**
 * Fetch work type rules from client
 *
 * @returns Work type rules configuration
 */
export async function getWorkTypeRulesClient(request?: WorkTypeRulesRequest): Promise<
  ApiResponse<PaginatedResponse<WorkTypeRulesResponse>>
> {
  return apiClient.get<ApiResponse<PaginatedResponse<WorkTypeRulesResponse>>>(
    API_ENDPOINTS.approvals.workTypeRules.get,
    {
      params: request as Record<string, unknown>,
    },
  );
}

export async function applyDefaultWorkTypeRulesClient(request?: ApplyDefaultWorkTypeRulesRequest): Promise<
  ApiResponse<ApplyDefaultWorkTypeRulesResponse>
> {
  return apiClient.post<ApiResponse<ApplyDefaultWorkTypeRulesResponse>>(
    API_ENDPOINTS.approvals.workTypeRules.applyDefault,
    request,
  );
}