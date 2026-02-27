import "server-only";

import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import type { ClientAffiliation, ClientAffiliationRequest } from "../../types";

/**
 * Fetch client affiliations for a payer (server-side)
 */
export async function getClientAffiliationsServer(
  payerId: string,
  request?: ClientAffiliationRequest,
): Promise<ApiResponse<PaginatedResponse<ClientAffiliation>>> {
  const params: Record<string, string> = {};

  if (request?.page) params.page = String(request.page);
  if (request?.limit) params.limit = String(request.limit);
  if (request?.search) params.search = request.search;
  if (request?.clientId) params.clientId = request.clientId;
  if (request?.payerId) params.payerId = request.payerId;
  if (request?.delegationStatus) params.delegationStatus = request.delegationStatus;

  return fetchServer.get<ApiResponse<PaginatedResponse<ClientAffiliation>>>(
    API_ENDPOINTS.payers.clientAffiliations(payerId),
    { params },
  );
}
