"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon } from "@hugeicons/core-free-icons";
import { type ExternalRole } from "../../types/external-role-tab";
import {
  getCategoryBadgeColor,
  getIconBgColor,
  getIconColor,
  isInternalRole,
} from "../../utils";

interface RoleCardProps {
  role: ExternalRole;
  variant: "internal" | "external";
  className?: string;
  onClick?: (roleId: string) => void;
}

export function RoleCard({
  role,
  variant,
  className,
  onClick,
}: Readonly<RoleCardProps>) {
  let iconBgColor = getIconBgColor(role.category, variant);
  let iconColor = getIconColor(role.category, variant);
  let categoryColor = getCategoryBadgeColor(role.categoryName);

  // Assign unique category text color for each external role card by role name
  switch (role.roleName) {
    case "Client Admin":
    case "Provider (Self-Service)":
      categoryColor = "text-emerald-400";
      break;
    case "MSO Director":
      categoryColor = "text-blue-400";
      break;
    case "Facility Manager":
      categoryColor = "text-cyan-400";
      break;
    case "CXO / Finance":
      categoryColor = "text-amber-400";
      break;
    case "Recruiter":
      categoryColor = "text-violet-400";
      break;
    default:
      // fallback to category-based color
      break;
  }

  // Assign unique colors for each external role card by role name
  switch (role.roleName) {
    case "Client Admin":
    case "Provider (Self-Service)":
      iconBgColor = "bg-emerald-500/20";
      iconColor = "text-emerald-400";
      break;
    case "MSO Director":
      iconBgColor = "bg-blue-500/20";
      iconColor = "text-blue-400";
      break;
    case "Facility Manager":
      iconBgColor = "bg-cyan-500/20";
      iconColor = "text-cyan-400";
      break;
    case "CXO / Finance":
      iconBgColor = "bg-amber-500/20";
      iconColor = "text-amber-400";
      break;
    case "Recruiter":
      iconBgColor = "bg-violet-500/20";
      iconColor = "text-violet-400";
      break;
    default:
      // fallback to category-based color
      break;
  }

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
        <div className="flex items-center gap-3 mb-3">
          <div
            className={cn(
              "p-2 rounded-[12px] shrink-0 size-10 flex items-center justify-center",
              iconBgColor,
            )}
          >
            <HugeiconsIcon
              icon={UserIcon}
              className={cn("size-5", iconColor)}
              strokeWidth={2}
            />
          </div>

          <div className="flex-1">
            <div className="text-base font-semibold text-white">
              {role.roleName}
            </div>

            <div className={cn("text-xs", categoryColor)}>
              {role.categoryName}
            </div>
          </div>
        </div>

        <div className="text-sm text-white/60 mb-3">
          {role.description}
        </div>

        {variant === "external" && !isInternalRole(role) && (
          <>
            {role.typicalUsers && role.typicalUsers.length > 0 && (
              <p className="text-xs text-white/40 mb-3">
                <span className="">Typical:</span>{" "}
                {role.typicalUsers.join(", ")}
              </p>
            )}
            {role.capabilities && role.capabilities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {role.capabilities.map((capability) => (
                  <Badge
                    key={capability}
                    variant="outline"
                    className={cn(
                      "text-[10px]",
                      capability === "all-facilities" &&
                        "bg-emerald-500/20 text-emerald-300",
                      capability === "assigned-only" &&
                        "bg-blue-500/20 text-blue-300",
                      capability === "can-add-providers" &&
                        "bg-blue-500/20 text-blue-300",
                      capability === "can-export" &&
                        "bg-violet-500/20 text-violet-300",
                    )}
                  >
                    {capability === "all-facilities" && "All Facilities"}
                    {capability === "assigned-only" && "Assigned Only"}
                    {capability === "can-add-providers" && "Can Add Providers"}
                    {capability === "can-export" && "Can Export"}
                  </Badge>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
