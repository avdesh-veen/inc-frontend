/**
 * HTTP Status Utility
 *
 * Helper functions for checking HTTP status codes and responses.
 */

/**
 * Check if a value represents a 401 Unauthorized response or error.
 *
 * Accepts either a `Response` object (e.g. from `fetch`) or an `Error`-like
 * object that has a numeric `status` property.
 */
export function isUnauthorizedResponse(responseOrError: unknown): boolean {
  if (responseOrError instanceof Response) {
    return responseOrError.status === 401;
  }

  if (responseOrError instanceof Error && "status" in responseOrError) {
    return (responseOrError as { status: number }).status === 401;
  }

  return false;
}
