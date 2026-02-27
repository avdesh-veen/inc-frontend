"use server";

import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/lib/api/types";
import type { DecisionQueue, DefaultRouting } from "@/features/settings/types/approvals/decision-queue";
import { DecisionQueueFormSchema } from "@/features/settings/validations/approvals/decision-queue";
import { logger } from "@/lib/logger";

/**
 * Update decision queue configuration
 *
 * @param data - Decision queue configuration
 * @returns Updated decision queue configuration
 */
export async function updateDecisionQueueAction(
  data: DecisionQueueFormSchema & { id: string },
): Promise<ApiResponse<DecisionQueue | undefined>> {
  try {
    const response = await fetchServer.patch<ApiResponse<DecisionQueue>>(
      API_ENDPOINTS.approvals.decisionQueue.update(data.id),
      {
        enableDecisionQueue: data.enableDecisionQueue,
        businessHoursStart: data.businessHoursStart,
        businessHoursEnd: data.businessHoursEnd,
        autoEscalateAfterSlaBreachHours: data.autoEscalateAfterSlaBreachHours,
        maxReturnsBeforeEscalation: data.maxReturnsBeforeEscalation,
      },
    );

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
        error instanceof Error
          ? error.message
          : "Failed to update decision queue",
      statusCode: 500,
      data: undefined,
    };
  }
}

/**
 * Update default routing configuration
 *
 * @param data - Default routing configuration
 * @returns Updated default routing configuration
 */
export async function updateDefaultRoutingAction(
  data: { id: string, sla: number }[],
): Promise<ApiResponse<DefaultRouting[] | undefined>> {
  try {
    const response = await fetchServer.patch<ApiResponse<DefaultRouting[]>>(
      API_ENDPOINTS.approvals.defaultRouting.updateSla,
      { items: data },
    );

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
        error instanceof Error
          ? error.message
          : "Failed to update default routing",
      statusCode: 500,
      data: undefined,
    };
  }
}