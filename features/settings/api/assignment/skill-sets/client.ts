import { ApiResponse } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { SkillSet } from "@/features/settings/types/assignment";

/**
 * Fetch skill sets from client
 * 
 * @returns List of skill sets
 */
export async function getSkillSetsClient(request?: Record<string, unknown>): Promise<
  ApiResponse<SkillSet[]>
> {
  return apiClient.get<ApiResponse<SkillSet[]>>(
    API_ENDPOINTS.assignment.skillSets.list,
    {
      params: request as Record<string, unknown>,
    },
  );
}
