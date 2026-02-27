import "server-only";

import { getToken } from "@/features/auth/api/login/server";
import type { ApiRequestConfig } from "./types";
import { AuthenticationError, TimeoutError } from "../error/wrappers";
import { logger } from "../logger";
import { isUnauthorizedResponse } from "./http-status";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const DEFAULT_TIMEOUT = 30000;

class FetchServer {
  private readonly baseUrl: string;
  private readonly defaultTimeout: number;

  constructor(baseUrl: string, timeout: number) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = timeout;
  }

  private async request<T, Body = unknown>(
    endpoint: string,
    config: ApiRequestConfig<Body> = {},
  ): Promise<T> {
    const { params, timeout = this.defaultTimeout, body: requestBody, ...fetchOptions } = config;

    // Setup abort controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Build URL
    const url = this.buildURL(endpoint, params as Record<string, string>);

    // Build body
    const body = this.buildBody(requestBody);

    // Build headers (pass hasBody flag)
    const headers = await this.buildHeaders(fetchOptions.headers || {}, !!body);

    // Make request
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        body,
        credentials: "include",
        signal: controller.signal,
        ...(config.method === "GET" && {
          next: { revalidate: 60 },
        }),
      });

      // Clear timeout
      clearTimeout(timeoutId);

      // Handle 401 Unauthorized
      if (isUnauthorizedResponse(response)) {
        logger("Unauthorized request (server) - token may be expired or invalid", { endpoint });
        throw new AuthenticationError("Unauthorized request (server) - token may be expired or invalid");
      }

      const data = (await response.json()) as T;
      if (!response.ok) {
        const message =
          typeof (data as { message?: string | string[] })?.message === "string"
            ? (data as { message: string }).message
            : Array.isArray((data as { message?: string[] })?.message)
              ? (data as { message: string[] }).message.join(", ")
              : `Request failed (${response.status})`;
        throw new Error(message);
      }
      return data;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new TimeoutError(`Request timeout after ${timeout}ms`);
      }

      logger(String(error), { endpoint, retriesExhausted: true, url });

      // Clear timeout
      clearTimeout(timeoutId);

      // Throw error
      throw error;
    }
  }

  async get<T>(endpoint: string, config: Omit<ApiRequestConfig<unknown>, "body"> = {}): Promise<T> {
    return this.request<T, unknown>(endpoint, config);
  }

  async post<T, Body = unknown>(
    endpoint: string,
    data: Body,
    config: Omit<ApiRequestConfig<unknown>, "body"> = {},
  ): Promise<T> {
    return this.request<T, Body>(endpoint, { ...config, method: "POST", body: data } as ApiRequestConfig<Body>);
  }

  async put<T, Body = unknown>(
    endpoint: string,
    data: Body,
    config: Omit<ApiRequestConfig<unknown>, "body"> = {},
  ): Promise<T> {
    return this.request<T, Body>(endpoint, { ...config, method: "PUT", body: data } as ApiRequestConfig<Body>);
  }

  async patch<T, Body = unknown>(
    endpoint: string,
    data: Body,
    config: Omit<ApiRequestConfig<unknown>, "body"> = {},
  ): Promise<T> {
    return this.request<T, Body>(endpoint, {
      ...config,
      method: "PATCH",
      body: data,
    } as ApiRequestConfig<Body>);
  }

  async delete<T>(endpoint: string, config: Omit<ApiRequestConfig<unknown>, "body"> = {}): Promise<T> {
    return this.request<T, unknown>(endpoint, { ...config, method: "DELETE" });
  }

  private buildURL(endpoint: string, params?: Record<string, string>): string {
    const base = `${this.baseUrl}${endpoint}`;
    if (!params || Object.keys(params).length === 0) return base;
    return `${base}?${new URLSearchParams(params).toString()}`;
  }

  private async buildHeaders(headers: HeadersInit, hasBody: boolean): Promise<Headers> {
    const token = await getToken();
    const newHeaders = new Headers(headers);

    if (token) {
      newHeaders.set("Authorization", `Bearer ${token}`);
    }

    // Set Content-Type for requests with body if not already set
    if (hasBody && !newHeaders.has("Content-Type")) {
      newHeaders.set("Content-Type", "application/json");
    }

    return newHeaders;
  }

  private buildBody(data: unknown): string | undefined {
    return data ? JSON.stringify(data) : undefined;
  }
}

export const fetchServer = new FetchServer(BASE_URL, DEFAULT_TIMEOUT);
