"use server";

import { fetchServer } from "@/lib/api/server";
import { UserFormValues } from "../../validations/user-schema";
import { ApiResponse } from "@/lib/api/types";
import { User } from "../../types/user-tab";
import type { UserStatus } from "../../types/user-tab";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { logger } from "@/lib/logger";
import { updateUserSkillsServer } from "./server";

export type UpdateUserSkillsResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Create a new user
 * Returns result object instead of throwing to preserve error messages in production
 */
export async function createUser(
  formData: UserFormValues,
): Promise<ApiResponse<User | undefined>> {
  try {
    const response = await fetchServer.post<
      ApiResponse<User>,
      UserFormValues & { isOffshore: boolean; isActive: boolean }
    >(API_ENDPOINTS.users.create, {
      ...formData,
      isOffshore: !formData.offshoreRestriction,
      isActive: formData.status === "active",
    });

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
      message: "Failed to create user",
      statusCode: 500,
      data: undefined,
    };
  }
}

/**
 * Update an existing user
 * Returns result object instead of throwing to preserve error messages in production
 */
export async function updateUser(
  id: string,
  formData: Partial<UserFormValues>,
): Promise<ApiResponse<User | undefined>> {
  const isOffShoreUpdated =
    formData.offshoreRestriction !== undefined &&
    formData.offshoreRestriction !== null;
  const isStatusUpdated =
    formData.status !== undefined && formData.status !== null;

  try {
    const response = await fetchServer.patch<
      ApiResponse<User>,
      Partial<UserFormValues>
    >(API_ENDPOINTS.users.update(id), {
      ...formData,
      ...(isOffShoreUpdated && { isOffshore: !formData.offshoreRestriction }),
      ...(isStatusUpdated && {
        status: formData.status,
        isActive: formData.status === "active",
      }),
    });

    if (!response.status) {
      return {
        status: false,
        statusCode: response.statusCode,
        data: response.data,
        message:
          typeof response.message === "string"
            ? response.message
            : response.message.join(", "),
      };
    }

    return {
      status: true,
      message: response.message,
      statusCode: response.statusCode,
      data: response.data,
    };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Failed to update user",
      statusCode: 500,
      data: undefined,
    };
  }
}

/**
 * Update user activation status (activate / deactivate)
 */
export async function updateUserStatus(
  id: string,
  formData: { status: UserStatus },
): Promise<ApiResponse<User | undefined>> {
  try {
    const response = await fetchServer.patch<
      ApiResponse<User>,
      { status: UserStatus }
    >(API_ENDPOINTS.users.status(id), { ...formData });

    if (!response.status) {
      return {
        status: false,
        statusCode: response.statusCode,
        data: response.data,
        message:
          typeof response.message === "string"
            ? response.message
            : response.message.join(", "),
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
        error instanceof Error ? error.message : "Failed to update user status",
      statusCode: 500,
      data: undefined,
    };
  }
}

export async function updateUserSkillsAction(
  userId: string,
  skillIds: string[],
): Promise<UpdateUserSkillsResult> {
  try {
    await updateUserSkillsServer(userId, skillIds);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to update user skills";
    return { success: false, error: message };
  }
}
