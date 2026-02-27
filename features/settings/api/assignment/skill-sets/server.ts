import "server-only";

import { ApiResponse } from "@/lib/api/types";
import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { SkillSet } from "@/features/settings/types/assignment";

/**
 * Fetch skill sets from server
 * 
 * @returns List of skill sets
 */
export async function getSkillSetsServer(): Promise<
  ApiResponse<SkillSet[]>
> {
  return fetchServer.get<ApiResponse<SkillSet[]>>(
    API_ENDPOINTS.assignment.skillSets.list
  );
}
