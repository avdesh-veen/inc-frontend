
import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import type { WorkType, WorkTypeStatistics, WorkTypeUsageStatistics } from "../../types/work-types";

/**
 * Work type request parameters interface
 * Matches the API payload parameters from the screenshot
 */
export interface WorkTypeRequest {
  search?: string;
  isActive?: boolean;
  categoryId?: string;
  complexityLevel?: 'low' | 'medium' | 'high';
  providerSignature?: boolean;
  psvRequired?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetch work types list with pagination (client-side)
 * 
 * @param request - Optional request parameters for filtering, sorting, and pagination
 * @returns Promise with paginated work types list
 */
export async function getWorkTypesClient(
  request?: WorkTypeRequest
): Promise<ApiResponse<PaginatedResponse<WorkType>>> {
  return apiClient.get<ApiResponse<PaginatedResponse<WorkType>>>(
    API_ENDPOINTS.workTypes.list,
    {
      params: request as Record<string, unknown>,
    }
  );
}

/**
 * Fetch single work type by ID (client-side)
 * 
 * @param id - Work type ID
 * @returns Promise with work type details
 */
export async function getWorkTypeByIdClient(
  id: string
): Promise<ApiResponse<WorkType>> {
  return apiClient.get<ApiResponse<WorkType>>(
    API_ENDPOINTS.workTypes.detail(id)
  );
}

/**
 * Delete a workflow stage by ID (client-side)
 * 
 * @param id - Workflow stage ID
 * @returns Promise with deletion confirmation
 */
export async function deleteWorkflowStageClient(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  return apiClient.delete<ApiResponse<{ success: boolean }>>(
    API_ENDPOINTS.workTypes.stages.delete(id)
  );
}

/**
 * Delete a gate requirement by ID (client-side)
 * 
 * @param id - Gate requirement ID
 * @returns Promise with deletion confirmation
 */
export async function deleteGateRequirementClient(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  return apiClient.delete<ApiResponse<{ success: boolean }>>(
    API_ENDPOINTS.workTypes.gateRequirements.delete(id)
  );
}

/**
 * Fetch overall work types statistics (client-side)
 * 
 * Returns statistical data including total work types count (non-deleted),
 * active work types count, total work categories count (non-deleted),
 * and average expected duration across all work types.
 * 
 * @returns Promise with work types statistics
 */
export async function getWorkTypeStatisticsClient(): Promise<ApiResponse<WorkTypeStatistics>> {
  return apiClient.get<ApiResponse<WorkTypeStatistics>>(
    API_ENDPOINTS.workTypes.statistics
  );
}

/**
 * Fetch usage statistics for a specific work type (client-side)
 * 
 * Returns usage statistics for a specific work type including times used in workflows,
 * average actual duration, efficiency percentage, expected duration, and complexity level.
 * 
 * Note: Times used, average duration, and efficiency metrics will be calculated
 * after case workflow implementation.
 * 
 * @param id - Work type ID
 * @returns Promise with work type usage statistics
 */
export async function getWorkTypeUsageStatisticsClient(
  id: string
): Promise<ApiResponse<WorkTypeUsageStatistics>> {
  return apiClient.get<ApiResponse<WorkTypeUsageStatistics>>(
    API_ENDPOINTS.workTypes.usageStatistics(id)
  );
}
