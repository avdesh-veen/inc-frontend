import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/queries/query-client-config';
import { queryKeys } from '@/lib/queries/query-keys';
import {
  getAssignmentModesServer,
  getAssignmentMetricsServer,
} from '@/features/settings/api/assignment/assignment-mode/server';

type AssignmentModeBoundaryProps = {
  children: React.ReactNode;
};

/**
 * Assignment Mode Boundary Component (Server)
 * 
 * Prefetches assignment modes and metrics data on the server.
 * Uses HydrationBoundary to pass prefetched data to client components.
 */
export async function AssignmentModeBoundary({ children }: Readonly<AssignmentModeBoundaryProps>) {
  const queryClient = getQueryClient();

  // Prefetch assignment modes
  await queryClient.prefetchQuery({
    queryKey: queryKeys.assignment.modes.list(),
    queryFn: getAssignmentModesServer,
  });

  // Prefetch assignment metrics
  await queryClient.prefetchQuery({
    queryKey: queryKeys.assignment.metrics(),
    queryFn: getAssignmentMetricsServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
