"use server";

import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/lib/api/types";
import type {
  ApprovalWorkflow,
  CreateApprovalWorkflowRequest,
  UpdateApprovalWorkflowRequest,
} from "@/features/settings/types/approvals/approval-workflows";
import { logger } from "@/lib/logger";
import { slugify } from "@/lib/utils";

/**
 * Server action to create a new approval workflow
 * Returns result object instead of throwing to preserve error messages in production
 */
export async function createApprovalWorkflowAction(
  request: CreateApprovalWorkflowRequest,
): Promise<ApiResponse<ApprovalWorkflow | undefined>> {
  try {
    const response = await fetchServer.post<
      ApiResponse<ApprovalWorkflow>,
      CreateApprovalWorkflowRequest
    >(API_ENDPOINTS.approvals.workflows.create, {
      ...request,
      code: request.code || slugify(request.name),
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
      message: "Failed to create approval workflow",
      statusCode: 500,
      data: undefined,
    };
  }
}

/**
 * Server action to update an existing approval workflow
 * Returns result object instead of throwing to preserve error messages in production
 */
export async function updateApprovalWorkflowAction(
  request: UpdateApprovalWorkflowRequest,
): Promise<ApiResponse<ApprovalWorkflow | undefined>> {
  try {
    const { id, ...data } = request;
    const response = await fetchServer.patch<ApiResponse<ApprovalWorkflow>>(
      API_ENDPOINTS.approvals.workflows.update(id),
      data,
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
      message: "Failed to update approval workflow",
      statusCode: 500,
      data: undefined,
    };
  }
}
