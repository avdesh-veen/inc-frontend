/**
 * Base API error class
 * All API errors extend from this class
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly fieldErrors?: Record<string, string[]>;
  public readonly timestamp?: string;
  public readonly path?: string;

  constructor(
    message: string,
    statusCode: number,
    options?: {
      code?: string;
      fieldErrors?: Record<string, string[]>;
      timestamp?: string;
      path?: string;
    },
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = options?.code;
    this.fieldErrors = options?.fieldErrors;
    this.timestamp = options?.timestamp;
    this.path = options?.path;

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Check if error is retryable based on status code
   */
  isRetryable(): boolean {
    // Retry on network errors and 5xx server errors
    return this.statusCode >= 500 && this.statusCode < 600;
  }
}

/**
 * Validation error (400)
 * Used when request validation fails
 */
export class ValidationError extends ApiError {
  constructor(
    message: string,
    fieldErrors?: Record<string, string[]>,
    options?: { code?: string; timestamp?: string; path?: string },
  ) {
    super(message, 400, { ...options, fieldErrors });
    this.name = "ValidationError";
  }
}

/**
 * Authentication error (401)
 * Used when authentication fails or token is invalid
 */
export class AuthenticationError extends ApiError {
  constructor(
    message: string = "Authentication required",
    options?: { code?: string; timestamp?: string; path?: string },
  ) {
    super(message, 401, options);
    this.name = "AuthenticationError";
  }
}

/**
 * Authorization error (403)
 * Used when user lacks permission for requested resource
 */
export class AuthorizationError extends ApiError {
  constructor(
    message: string = "Insufficient permissions",
    options?: { code?: string; timestamp?: string; path?: string },
  ) {
    super(message, 403, options);
    this.name = "AuthorizationError";
  }
}

/**
 * Not found error (404)
 * Used when requested resource doesn't exist
 */
export class NotFoundError extends ApiError {
  constructor(
    message: string = "Resource not found",
    options?: { code?: string; timestamp?: string; path?: string },
  ) {
    super(message, 404, options);
    this.name = "NotFoundError";
  }
}

/**
 * Conflict error (409)
 * Used for duplicate resource or constraint violations
 */
export class ConflictError extends ApiError {
  constructor(
    message: string = "Resource conflict",
    fieldErrors?: Record<string, string[]>,
    options?: { code?: string; timestamp?: string; path?: string },
  ) {
    super(message, 409, { ...options, fieldErrors });
    this.name = "ConflictError";
  }
}

/**
 * Network error
 * Used when network request fails (no response from server)
 */
export class NetworkError extends Error {
  public readonly isNetworkError = true;

  constructor(message: string = "Network request failed") {
    super(message);
    this.name = "NetworkError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkError);
    }
  }

  /**
   * Network errors are always retryable
   */
  isRetryable(): boolean {
    return true;
  }
}

/**
 * Timeout error
 * Used when request exceeds timeout duration
 */
export class TimeoutError extends Error {
  constructor(message: string = "Request timeout") {
    super(message);
    this.name = "TimeoutError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TimeoutError);
    }
  }

  /**
   * Timeout errors are retryable
   */
  isRetryable(): boolean {
    return true;
  }
}
