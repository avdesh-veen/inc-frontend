import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getCurrentUser } from "../api/login/server";
import { getQueryClient } from "@/lib/queries/query-client-config";
import { queryKeys } from "@/lib/queries/query-keys";

type CurrentUserHydrationProps = {
  children: React.ReactNode;
};
export async function CurrentUserHydration({
  children,
}: Readonly<CurrentUserHydrationProps>) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.auth.currentUser(),
    queryFn: getCurrentUser,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
