import { ApiResponse } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  ApprovalWorkflow,
  ApprovalWorkflowsRequest,
  ApprovalWorkflowsResponse,
  DeleteApprovalWorkflowRequest,
} from "@/features/settings/types/approvals/approval-workflows";

/**
 * Fetch approval workflows from client
 *
 * @returns Approval workflows list
 */
export async function getApprovalWorkflowsClient(
  request?: ApprovalWorkflowsRequest,
): Promise<ApiResponse<ApprovalWorkflowsResponse>> {
  return apiClient.get<ApiResponse<ApprovalWorkflowsResponse>>(
    API_ENDPOINTS.approvals.workflows.list,
    {
      params: request as Record<string, unknown>,
    },
  );
}

/**
 * Fetch single approval workflow from client
 *
 * @param id - Workflow ID
 * @returns Approval workflow details
 */
export async function getApprovalWorkflowClient(
  id: string,
): Promise<ApiResponse<ApprovalWorkflow>> {
  return apiClient.get<ApiResponse<ApprovalWorkflow>>(
    API_ENDPOINTS.approvals.workflows.detail(id),
  );
}

/**
 * Delete an approval workflow
 *
 * @param request - Delete workflow request
 * @returns Success response
 */
export async function deleteApprovalWorkflowClient(
  request: DeleteApprovalWorkflowRequest,
): Promise<ApiResponse<void>> {
  return apiClient.delete<ApiResponse<void>>(
    API_ENDPOINTS.approvals.workflows.delete(request.id),
  );
}
