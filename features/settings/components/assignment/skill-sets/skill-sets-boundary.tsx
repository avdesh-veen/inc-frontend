import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/queries/query-client-config';
import { queryKeys } from '@/lib/queries/query-keys';
import { getSkillSetsServer } from '@/features/settings/api/assignment/skill-sets/server';

type SkillSetsBoundaryProps = {
  children: React.ReactNode;
};

/**
 * Skill Sets Boundary Component (Server)
 * 
 * Prefetches skill sets data on the server.
 * Uses HydrationBoundary to pass prefetched data to client components.
 */
export async function SkillSetsBoundary({ children }: Readonly<SkillSetsBoundaryProps>) {
  const queryClient = getQueryClient();

  // Prefetch skill sets
  await queryClient.prefetchQuery({
    queryKey: queryKeys.assignment.skillSets.list(),
    queryFn: getSkillSetsServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
