import type { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import type { WaitReason } from "@/features/settings/types/wait-reasons";

export interface CreateWaitReasonPayload {
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  warningDays: number;
  pauseSla: boolean;
  criticalDays: number;
  category: "external" | "internal";
  autoChaseDays: number;
}

export interface UpdateWaitReasonPayload {
  code?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
  warningDays?: number;
  pauseSla?: boolean;
  criticalDays?: number;
  category?: "external" | "internal";
  autoChaseDays?: number;
}

export interface WaitReasonApiItem {
  id: string;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  warningDays: number;
  pauseSla: boolean;
  criticalDays: number;
  category: string;
  autoChaseDays: number;
  createdAt?: string;
  updatedAt?: string;
}

export type WaitReasonsListResponse = ApiResponse<PaginatedResponse<WaitReason>>;
