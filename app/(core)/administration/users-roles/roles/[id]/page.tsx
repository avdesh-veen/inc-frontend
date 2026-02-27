import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/queries/query-client-config";
import { queryKeys } from "@/lib/queries/query-keys";
import { getRoleDetailServer } from "@/features/user-and-roles/api/roles-tab/server";
import { RoleDetailContent } from "@/features/user-and-roles/components/role-detail";

interface RoleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoleDetailPage({ params }: RoleDetailPageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  // Prefetch role detail data on the server
  try {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.usersRoles.roles.detail(id),
      queryFn: () => getRoleDetailServer(id),
    });
  } catch (error) {
    // Log error and let Next.js error boundary handle it
    console.error("Failed to prefetch role detail data for role ID:", id, error);
    throw error;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoleDetailContent roleId={id} />
    </HydrationBoundary>
  );
}
