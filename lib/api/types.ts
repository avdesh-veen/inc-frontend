/**
 * API Type Definitions
 *
 * Type definitions for API requests, responses, and error handling.
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = void> {
  status: boolean;
  statusCode: number;
  message: string | string[];
  data: T;
  path?: string;
  timestamp?: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  itemCount: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Request configuration extending fetch options
 */
export type ApiRequestConfig<Body> = RequestInit & {
  /**
   * Query parameters to append to URL
   */
  params?: Record<string, unknown | string>;

  /**
   * Number of retry attempts
   * @default 3
   */
  retries?: number;

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;

  body?: Body;
}
