"use client";

import type { ReactNode } from "react";
import { useRequirePermission } from "@/features/auth/hooks/use-require-permission";
import { RESOURCES, PERMISSIONS } from "@/features/auth/utils/permission-constants";
import { Spinner } from "@/components/ui/spinner";
import { appRoutes } from "@/lib/constants/navigation";

interface CreateUserPermissionGuardProps {
  children: ReactNode;
}

/**
 * Guards the "Add New User" page.
 * Redirects to the users list if the current user lacks the users.create permission.
 */
export function CreateUserPermissionGuard({
  children,
}: Readonly<CreateUserPermissionGuardProps>) {
  const { isLoading, hasPermission } = useRequirePermission(
    RESOURCES.USERS,
    PERMISSIONS.USERS_CREATE,
    {
      redirectTo: appRoutes.administration.usersRoles("users"),
      message: "You don't have permission to create users.",
    },
  );

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-8 w-8" />
          <p className="text-sm text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}
