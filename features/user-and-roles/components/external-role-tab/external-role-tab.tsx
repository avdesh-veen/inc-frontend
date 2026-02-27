"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useExternalRoles } from "../../hooks/use-external-role";
import type { RoleRequest } from "../../types/role-tab";
import { RoleCard } from "./role-card";

const SKELETON_KEYS = [
  "external-role-skeleton-1",
  "external-role-skeleton-2",
  "external-role-skeleton-3",
  "external-role-skeleton-4",
  "external-role-skeleton-5",
  "external-role-skeleton-6",
] as const;

type ExternalRoleTabProps = Readonly<{ filters?: RoleRequest }>;

export function ExternalRoleTab({ filters }: ExternalRoleTabProps) {
  const { data, isLoading } = useExternalRoles({
    isActive: true,
    isInternal: false,
    ...filters,
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <Skeleton className="h-8 w-56 rounded" />
          <Skeleton className="h-8 w-80 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {SKELETON_KEYS.map((key) => (
            <div
              key={key}
              className="rounded-[24px] p-5 backdrop-blur-sm bg-white/5 border border-white/10 flex flex-col gap-3 h-36"
            >
              <div className="flex items-center gap-3 mb-1">
                <Skeleton className="p-2 rounded-[12px] shrink-0 size-10" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              </div>
              <Skeleton className="h-30 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={"space-y-4"}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          External Client Roles
        </h3>
        <p className="text-sm text-white/50">
          Role templates for client portal users
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data?.data?.items.map((role) => (
          <RoleCard key={role.id} role={role} variant="external" />
        ))}
      </div>
    </div>
  );
}
