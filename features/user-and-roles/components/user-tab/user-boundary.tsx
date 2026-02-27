import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queries/query-keys";
import { getQueryClient } from "@/lib/queries/query-client-config";

import { UserRequest } from "../../types/user-tab";
import {
  getUsersListServer,
  getUsersStatsServer,
} from "../../api/user-tab/server";

type UserBoundaryProps = {
  children: React.ReactNode;
  request?: UserRequest;
};
export async function UserBoundary({ children, request }: UserBoundaryProps) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.usersRoles.users.list(request),
    queryFn: () =>
      getUsersListServer(request),
  });

  await queryClient.prefetchQuery({
    queryKey: queryKeys.usersRoles.users.stats(),
    queryFn: () => getUsersStatsServer(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
