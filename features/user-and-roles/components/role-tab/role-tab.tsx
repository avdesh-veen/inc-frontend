"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useRolesList } from "../../hooks/use-roles";
import { RoleRequest } from "../../types/role-tab";
import { InternalRoleCard } from "./internal-role-card";
import { RoleFormModal } from "./role-form-modal";
import { useRoleTabContext } from "./role-tab-context";

export function RolesTab(request: Readonly<RoleRequest>) {
  const router = useRouter();
  const { isModalOpen, editRoleId, closeModal, openEditModal } =
    useRoleTabContext();

  const handleRoleClick = React.useCallback(
    (roleId: string) => {
      router.push(`/administration/users-roles/roles/${roleId}`);
    },
    [router],
  );

  const { data, isFetching, isPending } = useRolesList({
    isActive: request?.isActive ?? true,
    isInternal: request?.isInternal ?? true,
    page: 1,
    limit: 100,
  });

  const roles = data?.data.items || [];
  const isLoading = isFetching || isPending;

  const handleModalClose = React.useCallback(
    (open: boolean) => {
      if (!open) {
        closeModal();
      }
    },
    [closeModal],
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={`role-skeleton-${i}`} className="h-36 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">
        Internal Roles (Neolytix Staff)
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          ({roles.length} {roles.length === 1 ? "role" : "roles"})
        </span>
      </h2>
      {roles.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">
            No internal roles found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {roles.map((role) => (
            <InternalRoleCard
              key={role.id}
              role={role}
              onEdit={openEditModal}
              onClick={handleRoleClick}
            />
          ))}
        </div>
      )}
      <RoleFormModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        editRoleId={editRoleId}
      />
    </div>
  );
}
