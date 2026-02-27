/**
 * Clients Boundary Component (Server)
 * 
 * Server component that prefetches data for clients list and statistics.
 * Uses HydrationBoundary to pass prefetched data to client components.
 */

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/queries/query-client-config";
import { queryKeys } from "@/lib/queries/query-keys";
import { getClientsListServer } from "../../api/clients-tab/server";
import { getFollowUpRulesStatesDropdownServer } from "@/features/settings/api/follow-up-rules/server";
import { getLeadershipUsersServer } from "@/features/user-and-roles/api/user-tab/server";
import { ClientRequest } from "../../types";
import { getStatesDropdownServer } from "@/features/shared/api/states/server";

interface ClientsBoundaryProps {
  children: React.ReactNode;
  request?: ClientRequest;
}

export async function ClientsBoundary({ children, request }: Readonly<ClientsBoundaryProps>) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.clients.list(request),
    queryFn: () => getClientsListServer(request),
  });

  //TODO: Uncomment this when we have a real API call for client stats

  // await queryClient.prefetchQuery({
  //   queryKey: queryKeys.clients.stats(),
  //   queryFn: () => getClientStatsServer(),
  // });

  await queryClient.prefetchQuery({
    queryKey: queryKeys.settings.followUpRules.statesDropdown(),
    queryFn: () => getStatesDropdownServer(),
  });

  await queryClient.prefetchQuery({
    queryKey: queryKeys.usersRoles.users.leadership({ page: 1, limit: 50 }),
    queryFn: () => getLeadershipUsersServer({ page: 1, limit: 50 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
