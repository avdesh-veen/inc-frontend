import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/queries/query-client-config";
import { getClientByIdServer } from "../../api/clients-tab/server";
import { clientsKeys } from "@/lib/queries/query-keys";

type ClientDetailBoundaryProps = {
  children: React.ReactNode;
  clientId: string;
};

/**
 * Server component that prefetches client detail data
 * TODO: Add error boundary handling
 * TODO: Add loading state handling
 * TODO: Add not found handling
 */
export async function ClientDetailBoundary({
  children,
  clientId,
}: Readonly<ClientDetailBoundaryProps>) {
  const queryClient = getQueryClient();

  // Prefetch client detail
  await queryClient.prefetchQuery({
    queryKey: clientsKeys.detail(clientId),
    queryFn: () => getClientByIdServer(clientId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
