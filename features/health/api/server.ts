import { API_ENDPOINTS, getEndpoint } from "@/lib/api/endpoints";
import { ApiResponse } from "@/lib/api/types";
import "server-only";

export async function getHealthStatus(): Promise<ApiResponse<string | null>> {
  const endpoint = getEndpoint(API_ENDPOINTS.health.status);
  const response = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      status: false,
      statusCode: response.status,
      message: "Failed to fetch health status",
      data: "Failed to fetch health status",
    };
  }

  return (await response.json()) as ApiResponse<string | null>;
}
