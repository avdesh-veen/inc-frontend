"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { appRoutes } from "@/lib/constants/navigation";
import { useRoleTabContext } from "./role-tab/role-tab-context";
import { useHasPermission } from "@/features/auth/hooks/use-has-permission";
import { RESOURCES, PERMISSIONS } from "@/features/auth/utils/permission-constants";

/**
 * Add User button with permission check.
 * Only renders if user has "users.create" permission.
 */
export function AddUserAction() {
  const { hasPermission, isLoading } = useHasPermission(
    RESOURCES.USERS,
    PERMISSIONS.USERS_CREATE,
  );

  // Don't render if loading or no permission
  if (isLoading || !hasPermission) {
    return null;
  }

  return (
    <Button asChild>
      <Link href={appRoutes.administration.addNewUserRole("user")}>
        <HugeiconsIcon icon={Add01Icon} className="size-4" strokeWidth={2} />
        Add User
      </Link>
    </Button>
  );
}

/**
 * Add Role button with permission check.
 * Only renders if user has "users.assign_roles" permission.
 */
export function AddRoleAction() {
  const { openCreateModal } = useRoleTabContext();
  const { hasPermission, isLoading } = useHasPermission(
    RESOURCES.USERS,
    PERMISSIONS.USERS_ASSIGN_ROLES,
  );

  // Don't render if loading or no permission
  if (isLoading || !hasPermission) {
    return null;
  }

  return (
    <Button onClick={openCreateModal}>
      <HugeiconsIcon icon={Add01Icon} className="size-4" strokeWidth={2} />
      Add Role
    </Button>
  );
}

