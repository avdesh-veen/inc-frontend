"use server";

import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/lib/api/types";
import type { CapacitySettings } from "@/features/settings/types/assignment";

/**
 * Server action to update capacity settings
 * 
 * @param id - Capacity settings ID
 * @param data - Capacity settings data to update
 * @returns Updated capacity settings
 */
export async function updateCapacitySettingsAction(
  id: string,
  data: {
    maxTasksAllowed?: number;
    maxActiveTasksPerAnalyst?: number;
    warningThresholdPercent?: number;
    enableForecastingAlerts?: boolean;
    forecastHorizonDays?: number;
  }
): Promise<ApiResponse<CapacitySettings>> {
  return fetchServer.patch<ApiResponse<CapacitySettings>>(
    API_ENDPOINTS.assignment.capacity.update(id),
    data
  );
}
