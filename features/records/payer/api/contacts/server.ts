import "server-only";

import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import type {
  PayerContactItem,
  PayerContactDetail,
  PayerContactRequest,
  UpdatePayerContactRequest,
} from "../../types";

/**
 * Fetch contacts for a payer (server-side)
 */
export async function getPayerContactsServer(
  payerId: string,
  request?: PayerContactRequest,
): Promise<ApiResponse<PaginatedResponse<PayerContactItem>>> {
  const params: Record<string, string> = {};

  if (request?.page) params.page = String(request.page);
  if (request?.limit) params.limit = String(request.limit);
  if (request?.search) params.search = request.search;
  if (request?.type) params.type = request.type;
  if (request?.isPrimary !== undefined) params.isPrimary = String(request.isPrimary);
  if (request?.isActive !== undefined) params.isActive = String(request.isActive);
  if (request?.payerId) params.payerId = request.payerId;
  if (request?.stateId) params.stateId = request.stateId;

  return fetchServer.get<ApiResponse<PaginatedResponse<PayerContactItem>>>(
    API_ENDPOINTS.payers.contacts(payerId),
    { params },
  );
}

/**
 * Fetch a single contact by ID for a payer (server-side)
 */
export async function getPayerContactByIdServer(
  payerId: string,
  id: string,
): Promise<ApiResponse<PayerContactDetail>> {
  return fetchServer.get<ApiResponse<PayerContactDetail>>(
    API_ENDPOINTS.payers.contactById(payerId, id),
  );
}

/**
 * Update a contact by ID for a payer (server-side)
 */
export async function updatePayerContactServer(
  payerId: string,
  id: string,
  data: UpdatePayerContactRequest,
): Promise<ApiResponse<PayerContactItem>> {
  return fetchServer.put<ApiResponse<PayerContactItem>, UpdatePayerContactRequest>(
    API_ENDPOINTS.payers.contactById(payerId, id),
    data,
  );
}

/**
 * Delete a contact by ID for a payer (server-side)
 */
export async function deletePayerContactServer(
  payerId: string,
  id: string,
): Promise<ApiResponse<void>> {
  return fetchServer.delete<ApiResponse<void>>(
    API_ENDPOINTS.payers.contactById(payerId, id),
  );
}
