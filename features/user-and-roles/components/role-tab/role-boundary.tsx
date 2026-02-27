import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queries/query-keys";
import { getQueryClient } from "@/lib/queries/query-client-config";

import { RoleRequest } from "../../types/role-tab";
import {
  getRolesListServer,
  getResourcesServer,
  getRoleCategoriesServer,
  getRoleDetailServer,
} from "../../api/roles-tab/server";

type RoleBoundaryProps = {
  children: React.ReactNode;
  request?: RoleRequest;
  editRoleId?: string;
};

/**
 * Server-side boundary for roles tab
 * Prefetches roles list, resources, role categories, and optionally role detail for editing
 */
export async function RoleBoundary({
  children,
  request,
  editRoleId,
}: Readonly<RoleBoundaryProps>) {
  const queryClient = getQueryClient();

  // Prefetch roles list with pagination to get all records
  const rolesRequest = {
    ...request,
    page: 1,
    limit: 100,
  };
  await queryClient.prefetchQuery({
    queryKey: queryKeys.usersRoles.roles.list(rolesRequest),
    queryFn: () => getRolesListServer(rolesRequest),
  });

  // Prefetch resources for permission matrix (used by RoleFormModal)
  await queryClient.prefetchQuery({
    queryKey: queryKeys.usersRoles.resources.list(),
    queryFn: () => getResourcesServer(),
  });

  // Prefetch role categories for dropdown (used by RoleFormModal)
  await queryClient.prefetchQuery({
    queryKey: queryKeys.usersRoles.roleCategories.list({
      page: 1,
      limit: 100,
      search: "",
    }),
    queryFn: () =>
      getRoleCategoriesServer({
        page: 1,
        limit: 100,
        search: "",
      }),
  });

  // Prefetch role detail if editing (server-side like UserDetailsBoundary)
  if (editRoleId) {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.usersRoles.roles.detail(editRoleId),
      queryFn: () => getRoleDetailServer(editRoleId),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
