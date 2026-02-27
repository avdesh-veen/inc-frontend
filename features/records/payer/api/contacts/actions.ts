"use server";

import { revalidatePath } from "next/cache";
import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import type {
  PayerContactItem,
  PayerContactDetail,
  PayerContactRequest,
  CreatePayerContactRequest,
  UpdatePayerContactRequest,
} from "../../types";
import {
  getPayerContactsServer,
  getPayerContactByIdServer,
  updatePayerContactServer,
  deletePayerContactServer,
} from "./server";

/**
 * Server action to fetch contacts for a payer
 */
export async function getPayerContactsAction(
  payerId: string,
  request?: PayerContactRequest,
): Promise<ApiResponse<PaginatedResponse<PayerContactItem>>> {
  return getPayerContactsServer(payerId, request);
}

/**
 * Server action to fetch a single contact by ID for a payer
 */
export async function getPayerContactByIdAction(
  payerId: string,
  id: string,
): Promise<ApiResponse<PayerContactDetail>> {
  return getPayerContactByIdServer(payerId, id);
}

/**
 * Server action to create a contact for a payer
 */
export async function createPayerContactAction(
  payerId: string,
  data: CreatePayerContactRequest,
): Promise<ApiResponse<PayerContactItem>> {
  const response = await fetchServer.post<
    ApiResponse<PayerContactItem>,
    CreatePayerContactRequest
  >(API_ENDPOINTS.payers.contacts(payerId), data);
  revalidatePath(`/records/payers/${payerId}`);
  return response;
}

/**
 * Server action to update a contact by ID for a payer
 */
export async function updatePayerContactAction(
  payerId: string,
  id: string,
  data: UpdatePayerContactRequest,
): Promise<ApiResponse<PayerContactItem>> {
  const response = await updatePayerContactServer(payerId, id, data);
  revalidatePath(`/records/payers/${payerId}`);
  return response;
}

/**
 * Server action to delete a contact by ID for a payer
 */
export async function deletePayerContactAction(
  payerId: string,
  id: string,
): Promise<ApiResponse<void>> {
  const response = await deletePayerContactServer(payerId, id);
  revalidatePath(`/records/payers/${payerId}`);
  return response;
}
