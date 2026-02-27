"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon, Edit03Icon } from "@hugeicons/core-free-icons";
import { Role } from "../../types/role-tab";
import { InternalRoleCategory } from "../../types/external-role-tab";

interface InternalRoleCardProps {
  role: Role;
  className?: string;
  onEdit?: (roleId: string) => void;
  onClick?: (roleId: string) => void;
}

/** Super Admin role code - cannot be edited */
const SUPER_ADMIN_ROLE_CODE = "ROLE_SUPER_ADMIN";

/**
 * Get icon background color based on role category
 */
function getIconBgColor(categoryName?: string): string {
  const colors: Record<string, string> = {
    [InternalRoleCategory.LEADERSHIP]: "bg-emerald-500/25",
    [InternalRoleCategory.OPERATIONS]: "bg-cyan-500/25",
    [InternalRoleCategory.QUALITY]: "bg-amber-500/25",
  };
  return colors[categoryName ?? ""] ?? "bg-slate-500/25";
}

/**
 * Get text color based on role category
 * Used for both icon color and category badge color
 */
function getCategoryTextColor(categoryName?: string): string {
  const colors: Record<string, string> = {
    [InternalRoleCategory.LEADERSHIP]: "text-emerald-400",
    [InternalRoleCategory.OPERATIONS]: "text-cyan-400",
    [InternalRoleCategory.QUALITY]: "text-amber-400",
  };
  return colors[categoryName ?? ""] ?? "text-slate-400";
}

export function InternalRoleCard({
  role,
  className,
  onEdit,
  onClick,
}: InternalRoleCardProps) {
  const iconBgColor = getIconBgColor(role.categoryName);
  const categoryTextColor = getCategoryTextColor(role.categoryName);

  // Check if this is a super admin role (cannot be edited)
  const isSuperAdmin = role.roleCode === SUPER_ADMIN_ROLE_CODE;

  // Show edit button only if onEdit is provided and role is not super admin
  const canEdit = onEdit && !isSuperAdmin;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(role.id);
  };

  const handleCardClick = () => {
    onClick?.(role.id);
  };

  return (
    <Card
      className={cn(
        "backdrop-blur-sm transition-colors group p-5",
        onClick && "cursor-pointer hover:border-primary/50",
        className,
      )}
      onClick={handleCardClick}
    >
      <CardContent>
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className={cn(
              "size-10 flex items-center justify-center rounded-[12px] shrink-0",
              iconBgColor,
            )}
          >
            <HugeiconsIcon
              icon={UserIcon}
              className={cn("size-5", categoryTextColor)}
              strokeWidth={2}
            />
          </div>

          {/* Content */}
          <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white truncate">
                {role.roleName}
              </h3>

              {role.categoryName && (
                <div className={cn("text-xs truncate", categoryTextColor)}>
                  {role.categoryName}
                </div>
              )}
            </div>
            {canEdit && (
              <Button
              variant='muted'
                className="size-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 rounded-md p-1"
                onClick={handleEditClick}
                aria-label={`Edit ${role.roleName}`}
              >
                <HugeiconsIcon
                  icon={Edit03Icon}
                  className="size-4 text-white"
                />
              </Button>
            )}
          </div>
        </div>

        <p className="text-sm text-white/60 mb-4 mt-3 line-clamp-2">
          {role.description || "No description available"}
        </p>

        <div className="flex flex-wrap gap-1">
          <Badge className="text-[10px] bg-emerald-500/20 text-emerald-300 rounded px-2 py-0.5">
            {role.completeResourcePermissionCount ?? 0} Full Access
          </Badge>
          <Badge className="text-[10px] bg-blue-500/20 text-blue-300 rounded px-2 py-0.5">
            {role.limitedResourcePermissionCount ?? 0} Limited
          </Badge>
          <Badge className="text-[10px] bg-violet-500/20 text-violet-300 rounded px-2 py-0.5">
            All Clients
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
