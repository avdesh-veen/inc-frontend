"use server";

import { revalidatePath } from "next/cache";
import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/lib/api/types";
import { CreateClientRequest, UpdateClientRequest } from "../../types";
import { logger } from "@/lib/logger";

/**
 * Create a new client
 */
export async function createClientAction(
  data: CreateClientRequest
): Promise<ApiResponse<{ id: string } | undefined>> {
  try {
    const response = await fetchServer.post<
      ApiResponse<{ id: string } | undefined>,
      CreateClientRequest
    >(API_ENDPOINTS.clients.create, data);

    if (!response.status) {
      return {
        status: false,
        message:
          typeof response.message === "string"
            ? response.message
            : response.message.join(", "),
        statusCode: response.statusCode,
        data: response.data,
      };
    }

    revalidatePath("/records/clients");
    
    return {
      status: true,
      message: response.message,
      statusCode: response.statusCode,
      data: response.data,
    };
  } catch (error) {
    logger(String(error), { error });
    if (error instanceof Error) {
      return {
        status: false,
        message: error.message,
        statusCode: 500,
        data: undefined,
      };
    }

    return {
      status: false,
      message: "Failed to create client",
      statusCode: 500,
      data: undefined,
    };
  }
}

/**
 * Update an existing client
 */
export async function updateClientAction(
  id: string,
  data: UpdateClientRequest
): Promise<ApiResponse<unknown | undefined>> {
  try {
    const response = await fetchServer.patch<
      ApiResponse<unknown>,
      UpdateClientRequest
    >(API_ENDPOINTS.clients.update(id), data);

    if (!response.status) {
      return {
        status: false,
        message:
          typeof response.message === "string"
            ? response.message
            : response.message.join(", "),
        statusCode: response.statusCode,
        data: response.data,
      };
    }

    revalidatePath("/records/clients");
    revalidatePath(`/records/clients/${id}`);
    
    return {
      status: true,
      message: response.message,
      statusCode: response.statusCode,
      data: response.data,
    };
  } catch (error) {
    logger(String(error), { error });
    if (error instanceof Error) {
      return {
        status: false,
        message: error.message,
        statusCode: 500,
        data: undefined,
      };
    }

    return {
      status: false,
      message: "Failed to update client",
      statusCode: 500,
      data: undefined,
    };
  }
}

/**
 * Delete a client
 */
export async function deleteClientAction(
  id: string
): Promise<ApiResponse<unknown | undefined>> {
  try {
    const response = await fetchServer.delete<ApiResponse<unknown>>(
      API_ENDPOINTS.clients.delete(id)
    );

    if (!response.status) {
      return {
        status: false,
        message:
          typeof response.message === "string"
            ? response.message
            : response.message.join(", "),
        statusCode: response.statusCode,
        data: response.data,
      };
    }

    revalidatePath("/records/clients");
    
    return {
      status: true,
      message: response.message,
      statusCode: response.statusCode,
      data: response.data,
    };
  } catch (error) {
    logger(String(error), { error });
    if (error instanceof Error) {
      return {
        status: false,
        message: error.message,
        statusCode: 500,
        data: undefined,
      };
    }

    return {
      status: false,
      message: "Failed to delete client",
      statusCode: 500,
      data: undefined,
    };
  }
}

