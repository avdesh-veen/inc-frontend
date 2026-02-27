/**
 * API Client
 *
 * Centralized fetch wrapper for all HTTP requests.
 * Extends Next.js fetch with error handling and retry logic.
 * Uses cookies for authentication (automatically sent with requests).
 */

import type { ApiRequestConfig } from "./types";
import { logger } from "../logger";
import { AuthenticationError, NetworkError, TimeoutError } from "../error/wrappers";
import { COOKIE_NAMES } from "../constants/cookie-helper";
import { getCookie } from "../helpers/cookies";
import { refreshAccessToken } from "./refresh-token";

/**
 * Base configuration
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const DEFAULT_TIMEOUT = parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT || "30000",
  10,
);

/**
 * API Client class
 */
class ApiClient {
  private readonly baseUrl: string;
  private readonly defaultTimeout: number;

  constructor(baseUrl: string, timeout: number) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = timeout;
  }

  /**
   * Make HTTP request with error handling and retry logic
   */
  private async request<T, Body = unknown>(
    endpoint: string,
    config: ApiRequestConfig<Body> = {},
    isRetry = false,
  ): Promise<T> {
    const { params, timeout = this.defaultTimeout, ...fetchOptions } = config;

    // Build URL with query parameters
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      url = this.buildURLWithQueryParams(params, url);
    }

    // Setup headers
    const headers = this.buildHeaders(fetchOptions.headers || {});

    // Make request
    try {
      const response = await this.fetchWithTimeout(
        url,
        { ...fetchOptions, headers },
        timeout,
      );

      // Handle 401 Unauthorized - attempt token refresh
      if (response.status === 401 && !isRetry) {
        logger("Received 401, attempting token refresh", { endpoint });

        const newToken = await refreshAccessToken();

        if (newToken) {
          logger("Token refreshed, retrying request", { endpoint });
          return this.request<T, Body>(endpoint, config, true);
        } else {
          logger("Token refresh failed, redirecting to login", { endpoint });
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          throw new AuthenticationError("Authentication failed. Please log in again.");
        }
      }

      // Check if response is ok before parsing
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = 
          typeof (errorData as { message?: string })?.message === "string"
            ? (errorData as { message: string }).message
            : `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      return response.json() as Promise<T>;
    } catch (error) {
      logger(String(error), { endpoint, retriesExhausted: true, url });
      throw error;
    }
  }

  /**
   * Fetch with timeout support
   */
  private async fetchWithTimeout(
    url: string,
    config: RequestInit,
    timeout: number,
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
        ...(config.method === "GET" && {
          next: { revalidate: 60 },
        }),
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        throw new TimeoutError(`Request timeout after ${timeout}ms`);
      }

      throw new NetworkError("Failed to connect to server");
    }
  }

  /**
   * Build URL with query parameters
   */
  private buildURLWithQueryParams(
    params: Record<string, unknown>,
    baseUrl: string,
  ): string {
    const url = baseUrl;
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else if (value instanceof Date) {
        searchParams.append(key, value.toISOString());
      } else if (typeof value === "object") {
        searchParams.append(key, JSON.stringify(value));
      } else {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  /**
   * Build headers
   */
  private buildHeaders(headersInit: HeadersInit): Headers {
    const headers = new Headers(headersInit);

    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }

    if (process.env.NODE_ENV === "development") {
      headers.set("ngrok-skip-browser-warning", "true");
    }

    const token = getCookie(COOKIE_NAMES.AUTH_TOKEN);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * GET request
   */
  async get<T, Body = unknown>(endpoint: string, config?: ApiRequestConfig<Body>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  /**
   * POST request
   */
  async post<T, Body = unknown>(
    endpoint: string,
    data?: unknown,
    config?: ApiRequestConfig<Body>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      cache: "no-store",
    });
  }

  /**
   * PUT request
   */
  async put<T, Body = unknown>(
    endpoint: string,
    data?: unknown,
    config?: ApiRequestConfig<Body>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      cache: "no-store",
    });
  }

  /**
   * PATCH request
   */
  async patch<T, Body = unknown>(
    endpoint: string,
    data?: unknown,
    config?: ApiRequestConfig<Body>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      cache: "no-store",
    });
  }

  /**
   * DELETE request
   */
  async delete<T, Body = unknown>(endpoint: string, config?: ApiRequestConfig<Body>): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "DELETE",
      cache: "no-store",
    });
  }

  /**
   * GET request for binary data (Blob)
   */
  async getBlob(endpoint: string, config?: ApiRequestConfig<unknown>): Promise<Blob> {
    const { params, timeout = this.defaultTimeout, ...fetchOptions } = config || {};

    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      url = this.buildURLWithQueryParams(params, url);
    }

    const headers = this.buildHeaders(fetchOptions.headers || {});
    headers.set("Accept", "*/*");

    try {
      const response = await this.fetchWithTimeout(
        url,
        { ...fetchOptions, headers, method: "GET" },
        timeout,
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }

      return response.blob();
    } catch (error) {
      logger(String(error), { endpoint, url });
      throw error;
    }
  }
}

/**
 * Export singleton instance
 */
export const apiClient = new ApiClient(BASE_URL, DEFAULT_TIMEOUT);
