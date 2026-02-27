import "server-only";

import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  WorkTypeRulesResponse,
  WorkTypeRulesRequest,
} from "@/features/settings/types/approvals/work-type-rules";

/**
 * Fetch work type rules from server
 *
 * @returns Work type rules configuration
 */
export async function getWorkTypeRulesServer(
  request?: WorkTypeRulesRequest,
): Promise<ApiResponse<PaginatedResponse<WorkTypeRulesResponse>>> {
  return fetchServer.get<ApiResponse<PaginatedResponse<WorkTypeRulesResponse>>>(
    API_ENDPOINTS.approvals.workTypeRules.get,
    {
      params: request as Record<string, unknown>,
    },
  );
}
