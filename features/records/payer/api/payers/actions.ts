"use server";

import { revalidatePath } from "next/cache";
import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/lib/api/types";
import type { PayerListItem, PayerDetail, CreatePayerRequest, UpdatePayerRequest } from "../../types";

/**
 * Fetch a single payer by ID (server action for client components)
 */
export async function getPayerByIdAction(
  id: string,
): Promise<ApiResponse<PayerDetail>> {
  return fetchServer.get<ApiResponse<PayerDetail>>(
    API_ENDPOINTS.payers.detail(id),
  );
}

/**
 * Create a new payer
 */
export async function createPayerAction(
  data: CreatePayerRequest,
): Promise<ApiResponse<PayerListItem>> {
  const response = await fetchServer.post<ApiResponse<PayerListItem>, CreatePayerRequest>(
    API_ENDPOINTS.payers.create,
    data,
  );
  revalidatePath("/records/payers");
  return response;
}

/**
 * Update an existing payer
 */
export async function updatePayerAction(
  id: string,
  data: UpdatePayerRequest,
): Promise<ApiResponse<PayerListItem>> {
  const response = await fetchServer.patch<ApiResponse<PayerListItem>, UpdatePayerRequest>(
    API_ENDPOINTS.payers.update(id),
    data,
  );
  revalidatePath("/records/payers");
  revalidatePath(`/records/payers/${id}`);
  return response;
}

/**
 * Delete a payer
 */
export async function deletePayerAction(
  id: string,
): Promise<ApiResponse<void>> {
  const response = await fetchServer.delete<ApiResponse<void>>(
    API_ENDPOINTS.payers.delete(id),
  );
  revalidatePath("/records/payers");
  return response;
}
