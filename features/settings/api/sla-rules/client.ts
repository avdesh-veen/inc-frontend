import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  SLATarget,
  SLATargetRequest,
  SLAOverride,
  SLAOverrideRequest,
  EscalationRules,
  FPRMetrics,
  SLATargetFormData,
  SLAOverrideFormData,
  ClientDropdownItem,
  PayerDropdownItem,
} from "@/features/settings/types/sla-rules";

// ============================================================================
// Client API Functions (for use in hooks)
// ============================================================================

/**
 * Fetch SLA targets from client with pagination
 */
export async function getSLATargetsClient(
  request?: SLATargetRequest
): Promise<ApiResponse<PaginatedResponse<SLATarget>>> {
  return apiClient.get<ApiResponse<PaginatedResponse<SLATarget>>>(
    API_ENDPOINTS.settings.slaRules.targets.list,
    { params: request as Record<string, unknown> }
  );
}

/**
 * Fetch SLA overrides from client with pagination
 */
export async function getSLAOverridesClient(
  request?: SLAOverrideRequest
): Promise<ApiResponse<PaginatedResponse<SLAOverride>>> {
  return apiClient.get<ApiResponse<PaginatedResponse<SLAOverride>>>(
    API_ENDPOINTS.settings.slaRules.overrides.list,
    { params: request as Record<string, unknown> }
  );
}

/**
 * Fetch clients dropdown for SLA overrides
 */
export async function getSLAClientsDropdownClient(): Promise<ApiResponse<PaginatedResponse<ClientDropdownItem>>> {
  return apiClient.get<ApiResponse<PaginatedResponse<ClientDropdownItem>>>(
    API_ENDPOINTS.settings.slaRules.clientsDropdown,
    { params: { page: 1, limit: 100 } }
  );
}

/**
 * Fetch payers dropdown for SLA overrides
 */
export async function getSLAPayersDropdownClient(): Promise<ApiResponse<PaginatedResponse<PayerDropdownItem>>> {
  return apiClient.get<ApiResponse<PaginatedResponse<PayerDropdownItem>>>(
    API_ENDPOINTS.settings.followUpRules.payersDropdown,
    { params: { page: 1, limit: 100 } }
  );
}

/**
 * Fetch escalation rules from client
 */
export async function getEscalationRulesClient(): Promise<EscalationRules[]> {
  const response = await apiClient.get<ApiResponse<EscalationRules[]>>(
    API_ENDPOINTS.settings.slaRules.escalationRules.get
  );
  return response.data;
}

/**
 * Fetch FPR metrics from client
 */
export async function getFPRMetricsClient(): Promise<FPRMetrics> {
  const response = await apiClient.get<ApiResponse<FPRMetrics>>(
    API_ENDPOINTS.settings.slaRules.fprMetrics.get
  );
  return response.data;
}

/**
 * Create SLA target
 */
export async function createSLATargetClient(
  data: SLATargetFormData
): Promise<SLATarget> {
  const response = await apiClient.post<ApiResponse<SLATarget>>(
    API_ENDPOINTS.settings.slaRules.targets.create,
    data
  );
  return response.data;
}

/**
 * Update SLA target
 */
export async function updateSLATargetClient(
  id: string,
  data: Partial<SLATarget>
): Promise<SLATarget> {
  const response = await apiClient.patch<ApiResponse<SLATarget>>(
    API_ENDPOINTS.settings.slaRules.targets.update(id),
    data
  );
  return response.data;
}

/**
 * Delete SLA target
 */
export async function deleteSLATargetClient(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.settings.slaRules.targets.delete(id));
}

/**
 * Create SLA override
 */
export async function createSLAOverrideClient(
  data: SLAOverrideFormData
): Promise<SLAOverride> {
  const response = await apiClient.post<ApiResponse<SLAOverride>>(
    API_ENDPOINTS.settings.slaRules.overrides.create,
    data
  );
  return response.data;
}

/**
 * Update SLA override
 */
export async function updateSLAOverrideClient(
  id: string,
  data: Partial<SLAOverride>
): Promise<SLAOverride> {
  const response = await apiClient.patch<ApiResponse<SLAOverride>>(
    API_ENDPOINTS.settings.slaRules.overrides.update(id),
    data
  );
  return response.data;
}

/**
 * Delete SLA override
 */
export async function deleteSLAOverrideClient(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.settings.slaRules.overrides.delete(id));
}

/**
 * Update escalation rules
 */
export async function updateEscalationRulesClient(
  id: string,
  data: Partial<EscalationRules>
): Promise<EscalationRules> {
  const response = await apiClient.patch<ApiResponse<EscalationRules>>(
    API_ENDPOINTS.settings.slaRules.escalationRules.update(id),
    data
  );
  return response.data;
}

/**
 * Update FPR metrics
 */
export async function updateFPRMetricsClient(
  id: string,
  data: Partial<FPRMetrics>
): Promise<FPRMetrics> {
  const response = await apiClient.patch<ApiResponse<FPRMetrics>>(
    API_ENDPOINTS.settings.slaRules.fprMetrics.update(id),
    data
  );
  return response.data;
}
