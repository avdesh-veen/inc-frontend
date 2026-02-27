import "server-only";

import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CreateFollowUpRulePayload,
  FollowUpRule,
  FollowUpRuleApiItem,
  FollowUpRuleDetail,
  FollowUpRuleDropdownItem,
  FollowUpRulesRequest,
  FollowUpRulesStatistics,
} from "@/features/settings/types";
import { mapFollowUpRuleFromApi } from "@/features/settings/components/follow-up-rules/utils";

function extractErrorMessage(res: ApiResponse<unknown>, fallback: string): string {
  const raw = res.message;
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) return raw.join(", ");
  return fallback;
}

export async function getFollowUpRulesServer(
  request?: FollowUpRulesRequest,
): Promise<ApiResponse<PaginatedResponse<FollowUpRule>>> {
  const config =
    request && Object.keys(request).length > 0
      ? { params: request as Record<string, unknown> }
      : {};
  const res = await fetchServer.get<
    ApiResponse<PaginatedResponse<FollowUpRuleApiItem>>
  >(API_ENDPOINTS.settings.followUpRules.list, config);
  const items = (res.data?.items ?? []).map(mapFollowUpRuleFromApi);
  return {
    ...res,
    data: res.data ? { ...res.data, items } : { items: [], meta: { currentPage: 1, itemCount: 0, itemsPerPage: 10, totalItems: 0, totalPages: 0 } },
  };
}

export async function getFollowUpRuleServer(
  id: string,
): Promise<ApiResponse<FollowUpRuleDetail & { id: string }>> {
  return fetchServer.get<ApiResponse<FollowUpRuleDetail & { id: string }>>(
    API_ENDPOINTS.settings.followUpRules.detail(id),
  );
}

export async function getFollowUpRulesPayersDropdownServer(): Promise<
  ApiResponse<FollowUpRuleDropdownItem[]>
> {
  return fetchServer.get<ApiResponse<FollowUpRuleDropdownItem[]>>(
    API_ENDPOINTS.settings.followUpRules.payersDropdown,
  );
}

export async function getFollowUpRulesTriggerEventsDropdownServer(): Promise<
  ApiResponse<FollowUpRuleDropdownItem[]>
> {
  return fetchServer.get<ApiResponse<FollowUpRuleDropdownItem[]>>(
    API_ENDPOINTS.settings.followUpRules.triggerEventsDropdown,
  );
}

export async function getFollowUpRulesStatesDropdownServer(): Promise<
  ApiResponse<FollowUpRuleDropdownItem[]>
> {
  return fetchServer.get<ApiResponse<FollowUpRuleDropdownItem[]>>(
    API_ENDPOINTS.settings.followUpRules.statesDropdown,
    { params: { page: 1, limit: 50 } },
  );
}

export async function getFollowUpRulesStatisticsServer(): Promise<
  ApiResponse<FollowUpRulesStatistics>
> {
  return fetchServer.get<ApiResponse<FollowUpRulesStatistics>>(
    API_ENDPOINTS.settings.followUpRules.statistics,
  );
}

export async function createFollowUpRuleServer(
  data: CreateFollowUpRulePayload,
): Promise<ApiResponse<{ id: string }>> {
  const res = await fetchServer.post<ApiResponse<{ id: string }>>(
    API_ENDPOINTS.settings.followUpRules.create,
    data as unknown as BodyInit,
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    throw new Error(extractErrorMessage(res, "Create follow-up rule failed"));
  }
  return res;
}

export async function updateFollowUpRuleServer(
  id: string,
  data: CreateFollowUpRulePayload,
): Promise<ApiResponse<void>> {
  const res = await fetchServer.patch<ApiResponse<void>>(
    API_ENDPOINTS.settings.followUpRules.update(id),
    data as unknown as BodyInit,
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    throw new Error(extractErrorMessage(res as ApiResponse<unknown>, "Update follow-up rule failed"));
  }
  return res;
}

export async function deleteFollowUpRuleServer(
  id: string,
): Promise<ApiResponse<{ success: boolean }>> {
  const res = await fetchServer.delete<ApiResponse<{ success: boolean }>>(
    API_ENDPOINTS.settings.followUpRules.delete(id),
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    throw new Error(extractErrorMessage(res as ApiResponse<unknown>, "Delete follow-up rule failed"));
  }
  return res as ApiResponse<{ success: boolean }>;
}

export async function toggleFollowUpRuleStatusServer(
  id: string,
  isActive: boolean,
): Promise<ApiResponse<void>> {
  const res = await fetchServer.patch<ApiResponse<void>>(
    API_ENDPOINTS.settings.followUpRules.toggle(id),
    { isActive } as unknown as BodyInit,
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    throw new Error(extractErrorMessage(res as ApiResponse<unknown>, "Toggle follow-up rule status failed"));
  }
  return res;
}
