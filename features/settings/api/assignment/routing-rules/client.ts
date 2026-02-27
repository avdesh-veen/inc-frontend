import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { AssignmentRule, RoutingRule } from "@/features/settings/types/assignment";
import type { RoutingRuleFormData } from "@/features/settings/validations/assignment-schemas";

/**
 * Fetch routing rules from client
 * 
 * @returns List of routing rules
 */

export async function getRoutingRulesClient(request?: Record<string, unknown>): Promise<
  ApiResponse<PaginatedResponse<AssignmentRule>>
> {
  return apiClient.get<ApiResponse<PaginatedResponse<AssignmentRule>>>(
    API_ENDPOINTS.assignment.routingRules.list,
    {
      params: request as Record<string, unknown>,
    },
  );
}

/**
 * Create a new routing rule
 * 
 * @param data - Routing rule form data
 * @returns Created routing rule
 */
export async function createRoutingRuleClient(
  data: RoutingRuleFormData
): Promise<ApiResponse<RoutingRule>> {
  // Transform workCategory to workCategoryId for POST API
  const { workCategory, ...rest } = data;
  const payload = {
    ...rest,
    workCategoryId: workCategory,
  };

  return apiClient.post<ApiResponse<RoutingRule>>(
    API_ENDPOINTS.assignment.routingRules.create,
    payload
  );
}

/**
 * Update an existing routing rule
 * 
 * @param id - Routing rule ID
 * @param data - Routing rule form data
 * @returns Updated routing rule
 */
export async function updateRoutingRuleClient(
  id: string,
  data: RoutingRuleFormData
): Promise<ApiResponse<RoutingRule>> {
  return apiClient.patch<ApiResponse<RoutingRule>>(
    API_ENDPOINTS.assignment.routingRules.update(id),
    data
  );
}

/**
 * Delete a routing rule
 * 
 * @param id - Routing rule ID
 * @returns Success response
 */
export async function deleteRoutingRuleClient(
  id: string
): Promise<ApiResponse<null>> {
  return apiClient.delete<ApiResponse<null>>(
    API_ENDPOINTS.assignment.routingRules.delete(id)
  );
}
