"use server";

import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/lib/api/types";
import type { UpdateWorkTypeRulesStatusResponse } from "@/features/settings/types/approvals/work-type-rules";
import { logger } from "@/lib/logger";

export async function updateWorkTypeRulesStatusAction(
  id: string,
  isActive: boolean,
): Promise<ApiResponse<UpdateWorkTypeRulesStatusResponse | undefined>> {
  try {
    const response = await fetchServer.patch<
      ApiResponse<UpdateWorkTypeRulesStatusResponse>
    >(API_ENDPOINTS.approvals.workTypeRules.updateStatus(id), { isActive });

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
      message: "Failed to update work type rules status",
      statusCode: 500,
      data: undefined,
    };
  }
}
