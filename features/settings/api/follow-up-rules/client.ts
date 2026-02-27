import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  FollowUpRule,
  FollowUpRuleDetail,
  FollowUpRulesRequest,
  FollowUpRuleApiItem,
  FollowUpRuleDropdownItem,
  FollowUpRulesStatistics,
} from "@/features/settings/types";
import { mapFollowUpRuleFromApi } from "@/features/settings/components/follow-up-rules/utils";

export async function getFollowUpRulesClient(
  request?: FollowUpRulesRequest,
): Promise<ApiResponse<PaginatedResponse<FollowUpRule>>> {
  const params =
    request && Object.keys(request).length > 0
      ? (request as Record<string, unknown>)
      : undefined;
  const res = await apiClient.get<
    ApiResponse<PaginatedResponse<FollowUpRuleApiItem>>
  >(API_ENDPOINTS.settings.followUpRules.list, params ? { params } : {});
  const items = (res.data?.items ?? []).map(mapFollowUpRuleFromApi);
  return {
    ...res,
    data: res.data ? { ...res.data, items } : { items: [], meta: { currentPage: 1, itemCount: 0, itemsPerPage: 10, totalItems: 0, totalPages: 0 } },
  };
}

export async function getFollowUpRuleClient(
  id: string,
): Promise<ApiResponse<FollowUpRuleDetail & { id: string }>> {
  return apiClient.get<ApiResponse<FollowUpRuleDetail & { id: string }>>(
    API_ENDPOINTS.settings.followUpRules.detail(id),
  );
}

export async function getFollowUpRulesPayersDropdownClient(): Promise<
  ApiResponse<FollowUpRuleDropdownItem[]>
> {
  return apiClient.get<ApiResponse<FollowUpRuleDropdownItem[]>>(
    API_ENDPOINTS.settings.followUpRules.payersDropdown,
  );
}

export async function getFollowUpRulesTriggerEventsDropdownClient(): Promise<
  ApiResponse<FollowUpRuleDropdownItem[]>
> {
  return apiClient.get<ApiResponse<FollowUpRuleDropdownItem[]>>(
    API_ENDPOINTS.settings.followUpRules.triggerEventsDropdown,
  );
}

export async function getFollowUpRulesStatesDropdownClient(): Promise<
  ApiResponse<FollowUpRuleDropdownItem[]>
> {
  return apiClient.get<ApiResponse<FollowUpRuleDropdownItem[]>>(
    API_ENDPOINTS.settings.followUpRules.statesDropdown,
    { params: { page: 1, limit: 50 } },
  );
}

export async function getFollowUpRulesStatisticsClient(): Promise<
  ApiResponse<FollowUpRulesStatistics>
> {
  return apiClient.get<ApiResponse<FollowUpRulesStatistics>>(
    API_ENDPOINTS.settings.followUpRules.statistics,
  );
}
