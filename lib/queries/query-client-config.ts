/**
 * Query Client Configuration
 *
 * Global TanStack Query configuration with optimized defaults
 * for the InCredibly application.
 */

import { cache } from "react";
import { DefaultOptions, QueryClient } from "@tanstack/react-query";
import { logger } from "../logger";

/**
 * Default query options — shared between server and client instances.
 */
export const defaultQueryOptions: DefaultOptions = {
  queries: {
    // Data is considered fresh for 5 minutes
    staleTime: 5 * 60 * 1000,

    // Unused data is garbage collected after 5 minutes
    gcTime: 5 * 60 * 1000,

    // Retry failed queries 3 times
    retry: 3,

    // Exponential backoff for retries (1s, 2s, 4s)
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * Math.pow(2, attemptIndex), 30000),

    // Don't refetch on window focus
    refetchOnWindowFocus: false,

    // Refetch when network reconnects
    refetchOnReconnect: true,

    // Refetch on mount only if data is stale
    refetchOnMount: true,
  },
  mutations: {
    retry: false,
    onError: (error) => {
      if (process.env.NODE_ENV === "development") {
        logger(`[Mutation Error] ${error.message}`, { error });
      }
    },
  },
};

function makeQueryClient() {
  return new QueryClient({ defaultOptions: defaultQueryOptions });
}

/**
 * Server-side: React.cache ensures one QueryClient per request.
 * All server components in the same render tree share the same instance,
 * so prefetched data from any boundary is included in the dehydrated state.
 *
 * Client-side: module-level singleton reused across the entire session.
 */
let browserQueryClient: QueryClient | undefined;

export const getQueryClient = cache((): QueryClient => {
  if (typeof window === "undefined") {
    // Server: React.cache scopes this to one instance per request
    return makeQueryClient();
  }

  // Client: true singleton — preserves the cache across re-renders
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
});
