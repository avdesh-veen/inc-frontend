"use server";

import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { logger } from "@/lib/logger";
import type { ApiResponse } from "@/lib/api/types";
import type {
  RoleFromAPI,
  CreateRolePayload,
  UpdateRolePayload,
} from "./roles-api";

/**
 * Create a new role (server action)
 * Returns result object instead of throwing to preserve error messages in production
 */
export async function createRoleAction(
  data: CreateRolePayload,
): Promise<ApiResponse<RoleFromAPI | undefined>> {
  try {
    const response = await fetchServer.post<
      ApiResponse<RoleFromAPI>,
      CreateRolePayload
    >(API_ENDPOINTS.roles.create, data);

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
      message: "Failed to create role",
      statusCode: 500,
      data: undefined,
    };
  }
}

/**
 * Update an existing role (server action)
 * Returns result object instead of throwing to preserve error messages in production
 */
export async function updateRoleAction(
  id: string,
  data: Partial<UpdateRolePayload>,
): Promise<ApiResponse<RoleFromAPI | undefined>> {
  try {
    const response = await fetchServer.patch<
      ApiResponse<RoleFromAPI>,
      Partial<UpdateRolePayload>
    >(API_ENDPOINTS.roles.update(id), data);

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

    return {
      status: true,
      message: response.message,
      statusCode: response.statusCode,
      data: response.data,
    };
  } catch (error) {
    logger(String(error), { error });
    return {
      status: false,
      message:
        error instanceof Error ? error.message : "Failed to update role",
      statusCode: 500,
      data: undefined,
    };
  }
}
