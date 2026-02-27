"use client";

import type { ReactNode } from "react";
import { useRequirePermission } from "@/features/auth/hooks/use-require-permission";
import { RESOURCES, PERMISSIONS } from "@/features/auth/utils/permission-constants";
import { Spinner } from "@/components/ui/spinner";
import { appRoutes } from "@/lib/constants/navigation";

interface UsersRolesPermissionGuardProps {
  children: ReactNode;
}

/**
 * Permission guard wrapper for the Users & Roles module.
 *
 * Requires "users.view_all" permission. Users without this permission are
 * redirected to the dashboard. The guard also redirects on auth errors (e.g.
 * expired session / network failure) so the page is never rendered without a
 * confirmed, valid permission check.
 */
export function UsersRolesPermissionGuard({
  children,
}: Readonly<UsersRolesPermissionGuardProps>) {
  const { isLoading, hasPermission } = useRequirePermission(
    RESOURCES.USERS,
    PERMISSIONS.USERS_VIEW_ALL,
    {
      redirectTo: appRoutes.myWork.dashboard,
      message: "You don't have permission to access Users & Roles.",
    },
  );

  // Render nothing (not even a spinner) until the auth check resolves.
  // This prevents any flash of the protected content during the initial fetch.
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-8 w-8" />
          <p className="text-sm text-muted-foreground">
            Checking permissions...
          </p>
        </div>
      </div>
    );
  }

  // No permission or auth error — the hook handles the redirect,
  // render nothing while navigation is in progress.
  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}
