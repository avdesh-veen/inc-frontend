import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queries/query-keys";
import { getQueryClient } from "@/lib/queries/query-client-config";

import { getRolesListServer } from "../../api/roles-tab/server";
import { getSkillsListServer } from "../../api/user-form/server";
import { getTeamLeadsManagersServer, getTeamsListServer } from "../../api/team-tab/server";
import { getWorkLocationsListServer } from "../../api/work-locations/server";

type UserFormBoundaryProps = {
  children: React.ReactNode;
};
export async function UserFormBoundary({ children }: Readonly<UserFormBoundaryProps>) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.usersRoles.roles.list({ isActive: true }),
    queryFn: () => getRolesListServer({ isActive: true }),
  });

  await queryClient.prefetchQuery({
    queryKey: queryKeys.usersRoles.skills.list({ page: 1, limit: 100 }),
    queryFn: () => getSkillsListServer({ page: 1, limit: 100 }),
  });

  await queryClient.prefetchQuery({
    queryKey: queryKeys.usersRoles.teams.list(),
    queryFn: () => getTeamsListServer(),
  });

  await queryClient.prefetchQuery({
    queryKey: queryKeys.usersRoles.teams.leadsManagers(),
    queryFn: () => getTeamLeadsManagersServer(),
  });

  await queryClient.prefetchQuery({
    queryKey: queryKeys.usersRoles.workLocations.list(),
    queryFn: () => getWorkLocationsListServer(),
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
