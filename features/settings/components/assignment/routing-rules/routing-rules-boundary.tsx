import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/queries/query-client-config';
import { queryKeys } from '@/lib/queries/query-keys';
import { getRoutingRulesServer } from '@/features/settings/api/assignment/routing-rules/server';
import { getTriggerEventsListServer } from '@/features/settings/api/trigger-events/server';

type RoutingRulesBoundaryProps = {
  children: React.ReactNode;
};

/**
 * Routing Rules Boundary Component (Server)
 * 
 * Prefetches routing rules and trigger events data on the server.
 * Uses HydrationBoundary to pass prefetched data to client components.
 */
export async function RoutingRulesBoundary({ children }: Readonly<RoutingRulesBoundaryProps>) {
  const queryClient = getQueryClient();

  // Prefetch routing rules
  await queryClient.prefetchQuery({
    queryKey: queryKeys.assignment.routingRules.list(),
    queryFn: getRoutingRulesServer,
  });

  // Prefetch trigger events (active only)
  await queryClient.prefetchQuery({
    queryKey: queryKeys.triggerEvents.list(),
    queryFn: () => getTriggerEventsListServer({
      page: 1,
      limit: 50,
      isActive: true,
    }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
