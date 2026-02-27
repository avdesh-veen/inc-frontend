import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import type { PayerListItem, PayerDetail, PayerRequest } from "../../types";

/**
 * Get payers list with filters (client-side)
 */
export async function getPayersListClient(
  request?: PayerRequest,
): Promise<ApiResponse<PaginatedResponse<PayerListItem>>> {
  const params: Record<string, unknown> = {};

  if (request?.page) params.page = request.page;
  if (request?.limit) params.limit = request.limit;
  if (request?.search) params.search = request.search;
  if (request?.type) params.type = request.type;
  if (request?.parent) params.parent = request.parent;
  if (request?.subCategory) params.subCategory = request.subCategory;
  if (request?.isDelegated !== undefined) params.isDelegated = request.isDelegated;
  if (request?.panelStatus !== undefined) params.panelStatus = request.panelStatus;
  if (request?.isActive !== undefined) params.isActive = request.isActive;
  if (request?.approvalStatus) params.approvalStatus = request.approvalStatus;
  if (request?.tab) params.tab = request.tab;
  if (request?.sort) params.sort = request.sort;
  if (request?.stateIds?.length) params.stateIds = request.stateIds;

  const response = await apiClient.get<ApiResponse<PaginatedResponse<PayerListItem>>>(
    API_ENDPOINTS.payers.list,
    { params },
  );

  return response;
}

/**
 * Get payer by ID (client-side)
 */
export async function getPayerByIdClient(
  id: string,
): Promise<ApiResponse<PayerDetail>> {
  return apiClient.get<ApiResponse<PayerDetail>>(
    API_ENDPOINTS.payers.detail(id),
  );
}
