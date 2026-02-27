import "server-only";

import { ApiResponse } from "@/lib/api/types";
import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  DecisionQueue,
  DefaultRouting
} from "@/features/settings/types/approvals/decision-queue";

/**
 * Fetch decision queue from server
 * 
 * @returns Decision queue configuration
 */
export async function getDecisionQueueServer(): Promise<ApiResponse<DecisionQueue>> {
  const response = await fetchServer.get<ApiResponse<DecisionQueue>>(
    API_ENDPOINTS.approvals.decisionQueue.get
  );

  return response;
}

/**
 * Fetch default routing from server
 * 
 * @returns Default routing configuration
 */
export async function getDefaultRoutingServer(): Promise<ApiResponse<DefaultRouting[]>> {
  const response = await fetchServer.get<ApiResponse<DefaultRouting[]>>(
    API_ENDPOINTS.approvals.defaultRouting.get
  );
  return response;
}