import "server-only";

import { ApiResponse } from "@/lib/api/types";
import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  ApprovalWorkflow,
  ApprovalWorkflowsRequest,
  ApprovalWorkflowsResponse,
} from "@/features/settings/types/approvals/approval-workflows";

/**
 * Fetch approval workflows from server
 *
 * @returns Approval workflows list
 */
export async function getApprovalWorkflowsServer(
  request: ApprovalWorkflowsRequest,
): Promise<ApiResponse<ApprovalWorkflowsResponse>> {
  return fetchServer.get<ApiResponse<ApprovalWorkflowsResponse>>(
    API_ENDPOINTS.approvals.workflows.list,
    {
      params: request as Record<string, unknown>,
    },
  );
}

/**
 * Fetch single approval workflow from server
 *
 * @param id - Workflow ID
 * @returns Approval workflow details
 */
export async function getApprovalWorkflowServer(
  id: string,
): Promise<ApiResponse<ApprovalWorkflow>> {
  return fetchServer.get<ApiResponse<ApprovalWorkflow>>(
    API_ENDPOINTS.approvals.workflows.detail(id),
  );
}
