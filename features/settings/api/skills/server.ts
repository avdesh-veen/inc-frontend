import "server-only";

import type { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  SkillApiItem,
  SkillsRequest,
  CreateSkillPayload,
  UpdateSkillPayload,
  CategoryWithSkills,
  UserWithSkillsItem,
  UserWithSkillsRequest,
} from "../../types";

function extractErrorMessage(res: ApiResponse<unknown>, fallback: string): string {
  const raw = res.message;
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) return raw.join(", ");
  return fallback;
}

export async function getSkillsListServer(
  request?: SkillsRequest,
): Promise<ApiResponse<PaginatedResponse<SkillApiItem>>> {
  const params =
    request && Object.keys(request).length > 0
      ? (request as Record<string, unknown>)
      : undefined;

  return fetchServer.get<ApiResponse<PaginatedResponse<SkillApiItem>>>(
    API_ENDPOINTS.skills.list,
    params ? { params } : {},
  );
}

export async function getCategoriesWithSkillsServer(): Promise<ApiResponse<CategoryWithSkills[]>> {
  return fetchServer.get<ApiResponse<CategoryWithSkills[]>>(
    API_ENDPOINTS.skills.categoriesWithSkills,
  );
}

export async function getUsersWithSkillsServer(
  request?: UserWithSkillsRequest,
): Promise<ApiResponse<PaginatedResponse<UserWithSkillsItem>>> {
  const params =
    request && Object.keys(request).length > 0
      ? (request as Record<string, unknown>)
      : undefined;

  return fetchServer.get<ApiResponse<PaginatedResponse<UserWithSkillsItem>>>(
    API_ENDPOINTS.users.withSkills,
    params ? { params } : {},
  );
}

export async function createSkillServer(
  data: CreateSkillPayload,
): Promise<ApiResponse<SkillApiItem>> {
  const res = await fetchServer.post<ApiResponse<SkillApiItem>>(
    API_ENDPOINTS.skills.create,
    data as unknown as BodyInit,
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    throw new Error(extractErrorMessage(res as ApiResponse<unknown>, "Create skill failed"));
  }
  return res;
}

export async function updateSkillServer(
  id: string,
  data: UpdateSkillPayload,
): Promise<ApiResponse<SkillApiItem>> {
  const res = await fetchServer.patch<ApiResponse<SkillApiItem>, UpdateSkillPayload>(
    API_ENDPOINTS.skills.update(id),
    data,
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    throw new Error(extractErrorMessage(res as ApiResponse<unknown>, "Update skill failed"));
  }
  return res;
}

export async function deleteSkillServer(id: string): Promise<ApiResponse<void>> {
  const res = await fetchServer.delete<ApiResponse<void>>(
    API_ENDPOINTS.skills.delete(id),
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    throw new Error(extractErrorMessage(res as ApiResponse<unknown>, "Delete skill failed"));
  }
  return res;
}
