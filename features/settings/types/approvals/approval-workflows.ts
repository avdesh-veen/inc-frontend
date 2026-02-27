export interface ApprovalChainStep {
  id: string;
  approvalWorkflowId: string;
  stepOrder: number;
  approverRole: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  code: string;
  triggerEventId: string;
  triggerEventName?: string;
  conditions: string;
  slaHours: number;
  escalationTarget: string;
  isActive: boolean;
  usageCount: number;
  approvalChainSteps: ApprovalChainStep[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalWorkflowsRequest {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  triggerEventId?: string;
}

export interface ApprovalWorkflowsResponse {
  items: ApprovalWorkflow[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    itemCount: number;
  };
}

export interface CreateApprovalWorkflowRequest {
  name: string;
  code?: string;
  triggerEventId: string;
  conditions: string;
  slaHours: number;
  escalationTarget: string;
  isActive: boolean;
  approvalChainSteps: Omit<ApprovalChainStep, "id" | "approvalWorkflowId" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt">[];
}

export interface UpdateApprovalWorkflowRequest extends Partial<CreateApprovalWorkflowRequest> {
  id: string;
}

export interface DeleteApprovalWorkflowRequest {
  id: string;
}
