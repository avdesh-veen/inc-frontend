import "server-only";

import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { WaitReason } from "@/features/settings/types/wait-reasons";
import type {
  WaitReasonApiItem,
  CreateWaitReasonPayload,
  UpdateWaitReasonPayload,
} from "@/features/settings/types/wait-reasons-api";
import type { WaitReasonsRequest } from "./client";

function mapItem(item: WaitReasonApiItem): WaitReason {
  return {
    id: item.id,
    code: item.code,
    label: item.name,
    description: item.description ?? "",
    category: item.category === "external" ? "External" : "Internal",
    pausesSLA: item.pauseSla,
    warningDays: item.warningDays,
    criticalDays: item.criticalDays,
    autoChaseDays: item.autoChaseDays ?? 0,
    status: item.isActive ? "Active" : "Inactive",
    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
    updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
  };
}

function extractErrorMessage(res: ApiResponse<unknown>, fallback: string): string {
  const raw = res.message;
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) return raw.join(", ");
  return fallback;
}

export async function getWaitReasonsServer(
  request?: WaitReasonsRequest,
): Promise<ApiResponse<PaginatedResponse<WaitReason>>> {
  const res = await fetchServer.get<
    ApiResponse<PaginatedResponse<WaitReasonApiItem>>
  >(API_ENDPOINTS.waitReasons.list, {
    params: request as Record<string, unknown>,
  });

  const items = (res.data?.items ?? []).map(mapItem);
  return {
    ...res,
    data: res.data
      ? { ...res.data, items }
      : {
          items: [],
          meta: {
            currentPage: 1,
            itemCount: 0,
            itemsPerPage: 10,
            totalItems: 0,
            totalPages: 0,
          },
        },
  };
}

export async function createWaitReasonServer(
  data: CreateWaitReasonPayload,
): Promise<ApiResponse<{ id: string }>> {
  const res = await fetchServer.post<ApiResponse<{ id: string }>>(
    API_ENDPOINTS.waitReasons.create,
    data as unknown as BodyInit,
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    throw new Error(extractErrorMessage(res, "Create wait reason failed"));
  }
  return res;
}

export async function updateWaitReasonServer(
  id: string,
  data: UpdateWaitReasonPayload,
): Promise<ApiResponse<unknown>> {
  const res = await fetchServer.patch<ApiResponse<unknown>>(
    API_ENDPOINTS.waitReasons.update(id),
    data as unknown as BodyInit,
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    throw new Error(extractErrorMessage(res as ApiResponse<unknown>, "Update wait reason failed"));
  }
  return res;
}

export async function deleteWaitReasonServer(
  id: string,
): Promise<ApiResponse<{ success: boolean }>> {
  const res = await fetchServer.delete<ApiResponse<{ success: boolean }>>(
    API_ENDPOINTS.waitReasons.delete(id),
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    throw new Error(extractErrorMessage(res as ApiResponse<unknown>, "Delete wait reason failed"));
  }
  return res as ApiResponse<{ success: boolean }>;
}
