/**
 * Payers Boundary Component (Server)
 *
 * Server component that prefetches data for the payers list.
 * Uses HydrationBoundary to pass prefetched data to client components,
 * so the initial render is instant with no client-side network request.
 */

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/queries/query-client-config";
import { queryKeys } from "@/lib/queries/query-keys";
import { getPayersListServer } from "../api/payers/server";
import type { PayerRequest } from "../types";

interface PayersBoundaryProps {
  children: React.ReactNode;
  request?: PayerRequest;
}

export async function PayersBoundary({ children, request }: Readonly<PayersBoundaryProps>) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.payers.list(request),
    queryFn: () => getPayersListServer(request),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
