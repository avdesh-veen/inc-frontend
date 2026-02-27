"use server";

import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/lib/api/types";
import type { AssignmentModeConfig } from "@/features/settings/types/assignment";

/**
 * Server action to update assignment mode preferences
 * 
 * @param id - Assignment mode ID
 * @param data - Preferences to update
 * @returns Updated assignment mode configuration
 */
export async function updateAssignmentModeAction(
  id: string,
  data: {
    considerAnalystAvailability?: boolean;
    preferRecentTaskAnalyst?: boolean;
    autoReassignOnAbsence?: boolean;
    clientAffinityEnabled?: boolean;
    isActive?: boolean;
  }
): Promise<ApiResponse<AssignmentModeConfig>> {
  return fetchServer.patch<ApiResponse<AssignmentModeConfig>>(
    API_ENDPOINTS.assignment.modes.update(id),
    data
  );
}
