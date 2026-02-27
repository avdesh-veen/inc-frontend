import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { WaitReason } from "@/features/settings/types/wait-reasons";
import type { WaitReasonApiItem } from "@/features/settings/types/wait-reasons-api";

export type WaitReasonsRequest = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  category?: "internal" | "external";
  pauseSla?: boolean;
};

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

export async function getWaitReasonsClient(
  request?: WaitReasonsRequest
): Promise<ApiResponse<PaginatedResponse<WaitReason>>> {
  const res = await apiClient.get<
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

export async function getActiveWaitReasonsClient(): Promise<
  ApiResponse<WaitReason[]>
> {
  const res = await apiClient.get<ApiResponse<WaitReasonApiItem[]>>(
    API_ENDPOINTS.waitReasons.active
  );
  const items = (res.data ?? []).map(mapItem);
  return { ...res, data: items };
}
