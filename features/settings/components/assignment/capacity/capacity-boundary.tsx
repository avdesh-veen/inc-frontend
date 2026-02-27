import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/queries/query-client-config';
import { queryKeys } from '@/lib/queries/query-keys';
import { getCapacitySettingsServer } from '@/features/settings/api/assignment/capacity/server';

type CapacityBoundaryProps = {
  children: React.ReactNode;
};

/**
 * Capacity Boundary Component (Server)
 * 
 * Prefetches capacity settings data on the server.
 * Uses HydrationBoundary to pass prefetched data to client components.
 */
export async function CapacityBoundary({ children }: Readonly<CapacityBoundaryProps>) {
  const queryClient = getQueryClient();

  // Prefetch capacity settings
  await queryClient.prefetchQuery({
    queryKey: queryKeys.assignment.capacity(),
    queryFn: getCapacitySettingsServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
