import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  DecisionTable,
} from "@/features/settings/types/approvals/decision-table";
import { ApiResponse, PaginatedResponse } from "@/lib/api/types";

export async function getDecisionTableClient(): Promise<
  ApiResponse<PaginatedResponse<DecisionTable>>
> {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<DecisionTable>>>(
    API_ENDPOINTS.approvals.decisionTable.get,
  );
  return response;
}

export async function exportDecisionTableCsvClient(): Promise<Blob> {
  return apiClient.getBlob(API_ENDPOINTS.approvals.decisionTable.exportCsv);
}
