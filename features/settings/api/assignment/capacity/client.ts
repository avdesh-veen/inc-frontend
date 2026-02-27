import { ApiResponse } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { CapacitySettings } from "@/features/settings/types/assignment";

/**
 * Fetch capacity settings from client
 * 
 * @returns Capacity settings data
 */
export async function getCapacitySettingsClient(): Promise<CapacitySettings> {
  const response = await apiClient.get<ApiResponse<CapacitySettings>>(
    API_ENDPOINTS.assignment.capacity.get
  );
  return response.data;
}

/**
 * Update capacity settings
 * 
 * @param id - Capacity settings ID
 * @param data - Capacity settings data to update
 * @returns Updated capacity settings
 */
export async function updateCapacitySettingsClient(
  id: string,
  data: {
    maxTasksAllowed?: number;
    maxActiveTasksPerAnalyst?: number;
    warningThresholdPercent?: number;
    enableForecastingAlerts?: boolean;
    forecastHorizonDays?: number;
  }
): Promise<ApiResponse<CapacitySettings>> {
  return apiClient.patch<ApiResponse<CapacitySettings>>(
    API_ENDPOINTS.assignment.capacity.update(id),
    data
  );
}
