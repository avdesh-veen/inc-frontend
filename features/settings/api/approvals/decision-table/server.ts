import "server-only";

import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  DecisionTable,
} from "@/features/settings/types/approvals/decision-table";
import { ApiResponse, PaginatedResponse } from "@/lib/api/types";

export async function getDecisionTableServer(): Promise<
  ApiResponse<PaginatedResponse<DecisionTable>>
> {
  return fetchServer.get<ApiResponse<PaginatedResponse<DecisionTable>>>(
    API_ENDPOINTS.approvals.decisionTable.get,
  );
}
