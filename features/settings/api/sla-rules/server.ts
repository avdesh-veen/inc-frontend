import "server-only";

import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  SLATarget,
  SLATargetRequest,
  SLAOverride,
  SLAOverrideRequest,
  EscalationRules,
  FPRMetrics,
  ClientDropdownItem,
  PayerDropdownItem,
} from "@/features/settings/types/sla-rules";

/**
 * Fetch SLA targets from server with pagination
 * 
 * @param request - Query parameters for filtering and pagination
 * @returns Paginated SLA targets list
 */
export async function getSLATargetsServer(
  request?: SLATargetRequest
): Promise<ApiResponse<PaginatedResponse<SLATarget>>> {
  return fetchServer.get<ApiResponse<PaginatedResponse<SLATarget>>>(
    API_ENDPOINTS.settings.slaRules.targets.list,
    { params: request as Record<string, unknown> }
  );
}

/**
 * Fetch SLA overrides from server with pagination
 * 
 * @param request - Query parameters for pagination
 * @returns Paginated SLA overrides list
 */
export async function getSLAOverridesServer(
  request?: SLAOverrideRequest
): Promise<ApiResponse<PaginatedResponse<SLAOverride>>> {
  return fetchServer.get<ApiResponse<PaginatedResponse<SLAOverride>>>(
    API_ENDPOINTS.settings.slaRules.overrides.list,
    { params: request as Record<string, unknown> }
  );
}

/**
 * Fetch clients dropdown from server
 */
export async function getSLAClientsDropdownServer(
  request?: Record<string, unknown>
): Promise<ApiResponse<PaginatedResponse<ClientDropdownItem>>> {
  return fetchServer.get<ApiResponse<PaginatedResponse<ClientDropdownItem>>>(
    API_ENDPOINTS.settings.slaRules.clientsDropdown,
    { params: request }
  );
}

/**
 * Fetch payers dropdown from server
 */
export async function getSLAPayersDropdownServer(
  request?: Record<string, unknown>
): Promise<ApiResponse<PaginatedResponse<PayerDropdownItem>>> {
  return fetchServer.get<ApiResponse<PaginatedResponse<PayerDropdownItem>>>(
    API_ENDPOINTS.settings.followUpRules.payersDropdown,
    { params: request }
  );
}

/**
 * Fetch escalation rules from server
 * 
 * @returns Escalation rules configuration
 */
export async function getEscalationRulesServer(): Promise<EscalationRules[]> {
  const response = await fetchServer.get<ApiResponse<EscalationRules[]>>(
    API_ENDPOINTS.settings.slaRules.escalationRules.get
  );
  return response.data;
}

/**
 * Fetch FPR metrics from server
 * 
 * @returns FPR metrics configuration
 */
export async function getFPRMetricsServer(): Promise<FPRMetrics> {
  const response = await fetchServer.get<ApiResponse<FPRMetrics>>(
    API_ENDPOINTS.settings.slaRules.fprMetrics.get
  );
  return response.data;
}
