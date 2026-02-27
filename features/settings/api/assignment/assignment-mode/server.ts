import "server-only";

import { ApiResponse } from "@/lib/api/types";
import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  AssignmentModeConfig,
  AssignmentMetrics,
} from "@/features/settings/types/assignment";

/**
 * Fetch all assignment modes from server
 * 
 * @returns List of assignment mode configurations
 */
export async function getAssignmentModesServer(): Promise<AssignmentModeConfig[]> {
  const response = await fetchServer.get<ApiResponse<AssignmentModeConfig[]>>(
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
 * Fetch assignment metrics from server
 * 
 * @returns Assignment metrics data
 */
export async function getAssignmentMetricsServer(): Promise<AssignmentMetrics> {
  const response = await fetchServer.get<ApiResponse<AssignmentMetrics>>(
    API_ENDPOINTS.assignment.metrics
  );
  return response.data;
}
