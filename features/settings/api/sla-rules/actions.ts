"use server";

import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/lib/api/types";
import type {
  SLATarget,
  SLAOverride,
  EscalationRules,
  FPRMetrics,
  SLATargetFormData,
  SLAOverrideFormData,
} from "@/features/settings/types/sla-rules";
import { logger } from "@/lib/logger";

/**
 * Server action result type
 */
type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Create a new SLA target
 * Returns result object instead of throwing to preserve error messages in production
 */
export async function createSLATargetAction(
  formData: SLATargetFormData
): Promise<ApiResponse<SLATarget | undefined>> {
  try {
    const response = await fetchServer.post<
      ApiResponse<SLATarget>,
      SLATargetFormData
    >(API_ENDPOINTS.settings.slaRules.targets.create, formData);

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
      message: "Failed to create SLA target",
      statusCode: 500,
      data: undefined,
    };
  }
}

/**
 * Update an existing SLA target
 * Returns result object instead of throwing to preserve error messages in production
 */
export async function updateSLATargetAction(
  id: string,
  data: Partial<SLATarget>
): Promise<ApiResponse<SLATarget | undefined>> {
  try {
    const response = await fetchServer.patch<ApiResponse<SLATarget>>(
      API_ENDPOINTS.settings.slaRules.targets.update(id),
      data
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
      message: "Failed to update SLA target",
      statusCode: 500,
      data: undefined,
    };
  }
}

/**
 * Server action to delete SLA target
 * 
 * @param id - SLA target ID
 * @returns Action result
 */
export async function deleteSLATargetAction(id: string): Promise<ActionResult> {
  try {
    await fetchServer.delete(API_ENDPOINTS.settings.slaRules.targets.delete(id));
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete SLA target',
    };
  }
}

/**
 * Create a new SLA override
 * Returns result object instead of throwing to preserve error messages in production
 */
export async function createSLAOverrideAction(
  data: SLAOverrideFormData
): Promise<ApiResponse<SLAOverride | undefined>> {
  try {
    const response = await fetchServer.post<
      ApiResponse<SLAOverride>,
      SLAOverrideFormData
    >(API_ENDPOINTS.settings.slaRules.overrides.create, data);

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
      message: "Failed to create SLA override",
      statusCode: 500,
      data: undefined,
    };
  }
}

/**
 * Update an existing SLA override
 * Returns result object instead of throwing to preserve error messages in production
 */
export async function updateSLAOverrideAction(
  id: string,
  data: Partial<SLAOverride>
): Promise<ApiResponse<SLAOverride | undefined>> {
  try {
    const response = await fetchServer.patch<ApiResponse<SLAOverride>>(
      API_ENDPOINTS.settings.slaRules.overrides.update(id),
      data
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
      message: "Failed to update SLA override",
      statusCode: 500,
      data: undefined,
    };
  }
}

/**
 * Server action to delete SLA override
 * 
 * @param id - SLA override ID
 * @returns Action result
 */
export async function deleteSLAOverrideAction(id: string): Promise<ActionResult> {
  try {
    await fetchServer.delete(API_ENDPOINTS.settings.slaRules.overrides.delete(id));
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete SLA override',
    };
  }
}

/**
 * Server action to update escalation rules
 * 
 * @param id - Escalation rule ID
 * @param status - Escalation rule status (enabled/disabled)
 * @returns Action result
 */
export async function updateEscalationRulesAction(
  id: string,
  status: boolean
): Promise<ActionResult<EscalationRules>> {
  try {
    const response = await fetchServer.patch<ApiResponse<EscalationRules>>(
      API_ENDPOINTS.settings.slaRules.escalationRules.update(id),
      { status }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update escalation rules',
    };
  }
}

/**
 * Server action to update FPR metrics
 * 
 * @param id - FPR metrics ID
 * @param data - FPR metrics data to update
 * @returns Action result
 */
export async function updateFPRMetricsAction(
  id: string,
  data: Partial<FPRMetrics>
): Promise<ActionResult<FPRMetrics>> {
  try {
    const response = await fetchServer.patch<ApiResponse<FPRMetrics>>(
      API_ENDPOINTS.settings.slaRules.fprMetrics.update(id),
      data
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update FPR metrics',
    };
  }
}
