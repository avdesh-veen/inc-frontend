"use server";

import { ApiResponse } from "@/lib/api/types";
import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { RoutingRule } from "@/features/settings/types/assignment";
import type { RoutingRuleFormData } from "@/features/settings/validations/assignment-schemas";

/**
 * Server action to create a new routing rule
 * 
 * @param data - Routing rule form data
 * @returns Created routing rule
 */
export async function createRoutingRuleAction(
  data: RoutingRuleFormData
): Promise<ApiResponse<RoutingRule>> {
  return fetchServer.post<ApiResponse<RoutingRule>>(
    API_ENDPOINTS.assignment.routingRules.create,
    data
  );
}

/**
 * Server action to update an existing routing rule
 * 
 * @param id - Routing rule ID
 * @param data - Routing rule form data
 * @returns Updated routing rule
 */
export async function updateRoutingRuleAction(
  id: string,
  data: RoutingRuleFormData
): Promise<ApiResponse<RoutingRule>> {
  return fetchServer.patch<ApiResponse<RoutingRule>>(
    API_ENDPOINTS.assignment.routingRules.update(id),
    data
  );
}

/**
 * Server action to delete a routing rule
 * 
 * @param id - Routing rule ID
 * @returns Success response
 */
export async function deleteRoutingRuleAction(
  id: string
): Promise<ApiResponse<null>> {
  return fetchServer.delete<ApiResponse<null>>(
    API_ENDPOINTS.assignment.routingRules.delete(id)
  );
}
