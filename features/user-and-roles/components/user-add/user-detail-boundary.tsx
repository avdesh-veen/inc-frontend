import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queries/query-keys";
import { getQueryClient } from "@/lib/queries/query-client-config";

import { getUserByIdServer } from "../../api/user-form/server";

type UserDetailsBoundaryProps = {
  id: string;
  children: React.ReactNode;
};
export async function UserDetailsBoundary({ children, id }: Readonly<UserDetailsBoundaryProps>) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.usersRoles.users.detail(id),
    queryFn: () => getUserByIdServer(id),
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
