import { ApiResponse } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  DecisionQueue,
  DefaultRouting,
} from "@/features/settings/types/approvals/decision-queue";

/**
 * Fetch decision queue from client
 *
 * @returns Decision queue configuration
 */
export async function getDecisionQueueClient(): Promise<
  ApiResponse<DecisionQueue>
> {
  const response = await apiClient.get<ApiResponse<DecisionQueue>>(
    API_ENDPOINTS.approvals.decisionQueue.get,
  );
  return response;
}

/**
 * Fetch default routing from client
 *
 * @returns Default routing configuration
 */
export async function getDefaultRoutingClient(): Promise<
  ApiResponse<DefaultRouting[]>
> {
  const response = await apiClient.get<ApiResponse<DefaultRouting[]>>(
    API_ENDPOINTS.approvals.defaultRouting.get,
  );
  return response;
}
