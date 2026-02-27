"use server";

import { revalidatePath } from "next/cache";
import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import type {
  ClientAffiliation,
  ClientAffiliationRequest,
  CreateClientAffiliationRequest,
} from "../../types";
import { getClientAffiliationsServer } from "./server";

/**
 * Server action to fetch client affiliations for a payer
 */
export async function getClientAffiliationsAction(
  payerId: string,
  request?: ClientAffiliationRequest,
): Promise<ApiResponse<PaginatedResponse<ClientAffiliation>>> {
  return getClientAffiliationsServer(payerId, request);
}

/**
 * Server action to create a client affiliation for a payer
 */
export async function createClientAffiliationAction(
  payerId: string,
  data: CreateClientAffiliationRequest,
): Promise<ApiResponse<ClientAffiliation>> {
  const response = await fetchServer.post<
    ApiResponse<ClientAffiliation>,
    CreateClientAffiliationRequest
  >(API_ENDPOINTS.payers.clientAffiliations(payerId), data);
  revalidatePath(`/records/payers/${payerId}`);
  return response;
}
