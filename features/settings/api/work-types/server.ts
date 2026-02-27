/**
 * Work Types Server API
 * 
 * Server-side data fetching functions for work types.
 * Used in server components and boundary components.
 */

import "server-only";

import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { fetchServer } from "@/lib/api/server";
import type { WorkType, WorkTypeFormData, WorkTypeStatistics, WorkTypeUsageStatistics } from "../../types/work-types";

/**
 * Work type request parameters interface
 * Matches the API payload parameters from the screenshot
 */
export interface WorkTypeRequest {
  sort?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetch work types list with pagination (server-side)
 * 
 * @param request - Optional request parameters for filtering, sorting, and pagination
 * @returns Promise with paginated work types list
 */
export async function getWorkTypesServer(
  request?: WorkTypeRequest
): Promise<ApiResponse<PaginatedResponse<WorkType>>> {
  return fetchServer.get<ApiResponse<PaginatedResponse<WorkType>>>(
    API_ENDPOINTS.workTypes.list,
    {
      params: request as Record<string, unknown>,
    }
  );
}

/**
 * Fetch single work type by ID (server-side)
 * 
 * @param id - Work type ID
 * @returns Promise with work type details
 */
export async function getWorkTypeByIdServer(
  id: string
): Promise<ApiResponse<WorkType>> {
  return fetchServer.get<ApiResponse<WorkType>>(
    API_ENDPOINTS.workTypes.detail(id)
  );
}

/**
 * Create a new work type on the server
 *
 * @param data - Work type form data
 * @returns Promise with created work type
 */
export async function createWorkTypeServer(
  data: WorkTypeFormData,
): Promise<ApiResponse<WorkType>> {
  const res = await fetchServer.post<ApiResponse<WorkType>>(
    API_ENDPOINTS.workTypes.create,
    data as unknown as BodyInit,
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    const raw = res.message;
    let msg: string;
    if (typeof raw === "string") {
      msg = raw;
    } else if (Array.isArray(raw)) {
      msg = raw.join(", ");
    } else {
      msg = "Create work type failed";
    }
    throw new Error(msg);
  }
  return res;
}

/**
 * Update an existing work type on the server
 *
 * @param id - Work type ID
 * @param data - Partial work type form data
 * @returns Promise with updated work type
 */
export async function updateWorkTypeServer(
  id: string,
  data: Partial<WorkTypeFormData>,
): Promise<ApiResponse<WorkType>> {
  const res = await fetchServer.patch<ApiResponse<WorkType>>(
    API_ENDPOINTS.workTypes.update(id),
    data as unknown as BodyInit,
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    const raw = res.message;
    let msg: string;
    if (typeof raw === "string") {
      msg = raw;
    } else if (Array.isArray(raw)) {
      msg = raw.join(", ");
    } else {
      msg = "Update work type failed";
    }
    throw new Error(msg);
  }
  return res;
}

/**
 * Delete a work type on the server
 *
 * @param id - Work type ID
 * @returns Promise with deletion confirmation
 */
export async function deleteWorkTypeServer(
  id: string,
): Promise<ApiResponse<{ success: boolean }>> {
  const res = await fetchServer.delete<ApiResponse<{ success: boolean }>>(
    API_ENDPOINTS.workTypes.delete(id),
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    const raw = res.message;
    let msg: string;
    if (typeof raw === "string") {
      msg = raw;
    } else if (Array.isArray(raw)) {
      msg = raw.join(", ");
    } else {
      msg = "Delete work type failed";
    }
    throw new Error(msg);
  }
  return res as ApiResponse<{ success: boolean }>;
}

/**
 * Toggle work type active status on the server
 *
 * @param id - Work type ID
 * @param isActive - New active status
 * @returns Promise with updated work type
 */
export async function toggleWorkTypeStatusServer(
  id: string,
  isActive: boolean,
): Promise<ApiResponse<WorkType>> {
  const res = await fetchServer.patch<ApiResponse<WorkType>>(
    API_ENDPOINTS.workTypes.toggle(id),
    { isActive } as unknown as BodyInit,
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    const raw = res.message;
    let msg: string;
    if (typeof raw === "string") {
      msg = raw;
    } else if (Array.isArray(raw)) {
      msg = raw.join(", ");
    } else {
      msg = "Toggle work type status failed";
    }
    throw new Error(msg);
  }
  return res;
}

/**
 * Delete a workflow stage on the server
 *
 * @param id - Workflow stage ID
 * @returns Promise with deletion confirmation
 */
export async function deleteWorkflowStageServer(
  id: string,
): Promise<ApiResponse<{ success: boolean }>> {
  const res = await fetchServer.delete<ApiResponse<{ success: boolean }>>(
    API_ENDPOINTS.workTypes.stages.delete(id),
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    const raw = res.message;
    let msg: string;
    if (typeof raw === "string") {
      msg = raw;
    } else if (Array.isArray(raw)) {
      msg = raw.join(", ");
    } else {
      msg = "Delete workflow stage failed";
    }
    throw new Error(msg);
  }
  return res as ApiResponse<{ success: boolean }>;
}

/**
 * Delete a gate requirement on the server
 *
 * @param id - Gate requirement ID
 * @returns Promise with deletion confirmation
 */
export async function deleteGateRequirementServer(
  id: string,
): Promise<ApiResponse<{ success: boolean }>> {
  const res = await fetchServer.delete<ApiResponse<{ success: boolean }>>(
    API_ENDPOINTS.workTypes.gateRequirements.delete(id),
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    const raw = res.message;
    let msg: string;
    if (typeof raw === "string") {
      msg = raw;
    } else if (Array.isArray(raw)) {
      msg = raw.join(", ");
    } else {
      msg = "Delete gate requirement failed";
    }
    throw new Error(msg);
  }
  return res as ApiResponse<{ success: boolean }>;
}

/**
 * Fetch overall work types statistics (server-side)
 * 
 * Returns statistical data including total work types count (non-deleted),
 * active work types count, total work categories count (non-deleted),
 * and average expected duration across all work types.
 * 
 * @returns Promise with work types statistics
 */
export async function getWorkTypeStatisticsServer(): Promise<ApiResponse<WorkTypeStatistics>> {
  return fetchServer.get<ApiResponse<WorkTypeStatistics>>(
    API_ENDPOINTS.workTypes.statistics
  );
}

/**
 * Fetch usage statistics for a specific work type (server-side)
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
export async function getWorkTypeUsageStatisticsServer(
  id: string
): Promise<ApiResponse<WorkTypeUsageStatistics>> {
  return fetchServer.get<ApiResponse<WorkTypeUsageStatistics>>(
    API_ENDPOINTS.workTypes.usageStatistics(id)
  );
}
