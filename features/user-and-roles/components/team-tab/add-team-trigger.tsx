"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { queryKeys } from "@/lib/queries/query-keys";
import { AddTeamModal } from "./add-team-modal";
import { useHasPermission } from "@/features/auth/hooks/use-has-permission";
import {
  RESOURCES,
  PERMISSIONS,
} from "@/features/auth/utils/permission-constants";

/**
 * Add Team button with modal and permission check.
 * Only renders if user has "users.create" permission (teams are managed under users).
 */
export function AddTeamTriggerWithModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // Check if user has permission to create teams (uses users.create permission)
  const { hasPermission, isLoading } = useHasPermission(
    RESOURCES.USERS,
    PERMISSIONS.USERS_CREATE,
  );

  async function handleSuccess() {
    await queryClient.invalidateQueries({
      queryKey: [...queryKeys.usersRoles.all, "teams"],
    });
    await queryClient.refetchQueries({
      queryKey: [...queryKeys.usersRoles.all, "teams"],
    });
  }

  // Don't render if loading or no permission
  if (isLoading || !hasPermission) {
    return null;
  }

  return (
    <>
      <Button className="cursor-pointer" onClick={() => setOpen(true)}>
        <HugeiconsIcon icon={Add01Icon} className="size-4" strokeWidth={2} />
        Add Team
      </Button>
      <AddTeamModal
        open={open}
        onOpenChange={setOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
