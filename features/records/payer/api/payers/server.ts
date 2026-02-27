import "server-only";

import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import type { PayerListItem, PayerDetail, PayerRequest } from "../../types";

/**
 * Get payers list with filters (server-side)
 */
export async function getPayersListServer(
  request?: PayerRequest,
): Promise<ApiResponse<PaginatedResponse<PayerListItem>>> {
  const params: Record<string, string> = {};

  if (request?.page) params.page = String(request.page);
  if (request?.limit) params.limit = String(request.limit);
  if (request?.search) params.search = request.search;
  if (request?.type) params.type = request.type;
  if (request?.parent) params.parent = request.parent;
  if (request?.subCategory) params.subCategory = request.subCategory;
  if (request?.isDelegated !== undefined) params.isDelegated = String(request.isDelegated);
  if (request?.panelStatus !== undefined) params.panelStatus = String(request.panelStatus);
  if (request?.isActive !== undefined) params.isActive = String(request.isActive);
  if (request?.approvalStatus) params.approvalStatus = request.approvalStatus;
  if (request?.tab) params.tab = request.tab;
  if (request?.sort) params.sort = request.sort;
  if (request?.stateIds?.length) {
    request.stateIds.forEach((id, i) => { params[`stateIds[${i}]`] = id; });
  }

  return fetchServer.get<ApiResponse<PaginatedResponse<PayerListItem>>>(
    API_ENDPOINTS.payers.list,
    { params },
  );
}

/**
 * Get payer by ID (server-side)
 */
export async function getPayerByIdServer(
  id: string,
): Promise<ApiResponse<PayerDetail>> {
  return fetchServer.get<ApiResponse<PayerDetail>>(
    API_ENDPOINTS.payers.detail(id),
  );
}
