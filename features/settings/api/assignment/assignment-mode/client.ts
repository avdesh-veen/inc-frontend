import { ApiResponse } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  AssignmentModeConfig,
  AssignmentMetrics,
} from "@/features/settings/types/assignment";

/**
 * Fetch all assignment modes from client
 * 
 * @returns List of assignment mode configurations
 */
export async function getAssignmentModesClient(): Promise<AssignmentModeConfig[]> {
  const response = await apiClient.get<ApiResponse<AssignmentModeConfig[]>>(
    API_ENDPOINTS.assignment.modes.list
  );
  // Return the data array directly, handling both array and object responses
  if (Array.isArray(response.data)) {
    return response.data;
  }
  // If data is a single object, wrap it in an array
  return response.data ? [response.data as unknown as AssignmentModeConfig] : [];
}

/**
 * Fetch assignment metrics from client
 * 
 * @returns Assignment metrics data
 */
export async function getAssignmentMetricsClient(): Promise<AssignmentMetrics> {
  const response = await apiClient.get<ApiResponse<AssignmentMetrics>>(
    API_ENDPOINTS.assignment.metrics
  );
  return response.data;
}

/**
 * Update assignment mode preferences
 * 
 * @param id - Assignment mode ID
 * @param data - Preferences to update (matches API request body)
 * @returns Updated assignment mode configuration
 */
export async function updateAssignmentModeClient(
  id: string,
  data: {
    considerAnalystAvailability?: boolean;
    preferRecentTaskAnalyst?: boolean;
    autoReassignOnAbsence?: boolean;
    clientAffinityEnabled?: boolean;
    isActive?: boolean;
  }
): Promise<ApiResponse<AssignmentModeConfig>> {
  return apiClient.patch<ApiResponse<AssignmentModeConfig>>(
    API_ENDPOINTS.assignment.modes.update(id),
    data
  );
}
