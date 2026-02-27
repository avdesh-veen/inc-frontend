import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queries/query-keys";
import { getQueryClient } from "@/lib/queries/query-client-config";

import { TeamRequest } from "../../types/team-tab";
import { getTeamsListServer, getTeamsStatsServer } from "../../api/team-tab/server";

type TeamBoundaryProps = {
  children: React.ReactNode;
  request?: TeamRequest;
};

export async function TeamBoundary({ children, request }: TeamBoundaryProps) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.usersRoles.teams.list(request),
    queryFn: () => getTeamsListServer(request),
  });

  await queryClient.prefetchQuery({
    queryKey: queryKeys.usersRoles.teams.stats(),
    queryFn: () => getTeamsStatsServer(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
