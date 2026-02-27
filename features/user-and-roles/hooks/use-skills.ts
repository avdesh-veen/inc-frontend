import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { Skill } from "../types/user-tab";
import { getSkillsListClient } from "../api/user-form/client";

/**
 * Hook to fetch skills list
 *
 * @param request - Optional pagination parameters
 * @returns Query hook with skills list data
 */
export function useSkillsList(request?: { page?: number; limit?: number }) {
  return useQuery<ApiResponse<PaginatedResponse<Skill>>, Error>({
    queryKey: queryKeys.usersRoles.skills.list(request),
    queryFn: () => getSkillsListClient(request),
  });
}