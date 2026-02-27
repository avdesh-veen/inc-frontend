import "server-only";

import { ApiResponse } from "@/lib/api/types";
import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { RoutingRule } from "@/features/settings/types/assignment";

/**
 * Fetch routing rules from server
 * 
 * @returns List of routing rules
 */
export async function getRoutingRulesServer(): Promise<
  ApiResponse<RoutingRule[]>
> {
  return fetchServer.get<ApiResponse<RoutingRule[]>>(
    API_ENDPOINTS.assignment.routingRules.list
  );
}

/**
 * Fetch a single routing rule by ID from server
 * 
 * @param id - Routing rule ID
 * @returns Single routing rule
 */
export async function getRoutingRuleByIdServer(
  id: string
): Promise<ApiResponse<RoutingRule>> {
  return fetchServer.get<ApiResponse<RoutingRule>>(
    API_ENDPOINTS.assignment.routingRules.detail(id)
  );
}
