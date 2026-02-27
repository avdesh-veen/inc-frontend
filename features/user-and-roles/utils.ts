import { ExternalRoleCategory, InternalRoleCategory, ExternalRole, InternalRole } from "./types/external-role-tab";
import { UserStatus, USER_STATUS_LABELS } from "./types/user-tab";
import { RoleCode } from "@/types";
import type { badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";

type RoleBadgeVariant = VariantProps<typeof badgeVariants>["variant"];

/**
 * Get display label for user status
 */
export function getStatusLabel(status: UserStatus): string {
  return USER_STATUS_LABELS[status];
}

/**
 * Get badge variant for user status
 */
export function getStatusBadgeVariant(status: UserStatus): RoleBadgeVariant {
  switch (status) {
    case "active":
      return "tertiaryLight";
    case "on_leave":
      return "qcAnalyst";
    case "inactive":
      return "destructiveLight";
  }
}

export function getIconBgColor(
    category: InternalRoleCategory | ExternalRoleCategory,
    variant: "internal" | "external",
): string {
    if (variant === "internal") {
        const colors: Record<InternalRoleCategory, string> = {
            [InternalRoleCategory.LEADERSHIP]: "bg-emerald-500/25",
            [InternalRoleCategory.OPERATIONS]: "bg-cyan-500/25",
            [InternalRoleCategory.QUALITY]: "bg-amber-500/25",
        };
        return colors[category as InternalRoleCategory] || "bg-slate-500/25";
    } else {
        const colors: Record<ExternalRoleCategory, string> = {
            [ExternalRoleCategory.CLIENT_LEADERSHIP]: "bg-emerald-500/25",
            [ExternalRoleCategory.CLIENT_OPERATIONS]: "bg-cyan-500/25",
            [ExternalRoleCategory.CLIENT_FINANCE]: "bg-amber-500/25",
            [ExternalRoleCategory.PROVIDER]: "bg-purple-500/25",
        };
        return colors[category as ExternalRoleCategory] || "bg-slate-500/25";
    }
}

/**
 * Get icon color based on role category
 * @internal - Used internally by role card components
 */
export function getIconColor(
    category: InternalRoleCategory | ExternalRoleCategory,
    variant: "internal" | "external",
): string {
    if (variant === "internal") {
        const colors: Record<InternalRoleCategory, string> = {
            [InternalRoleCategory.LEADERSHIP]: "text-emerald-400",
            [InternalRoleCategory.OPERATIONS]: "text-cyan-400",
            [InternalRoleCategory.QUALITY]: "text-amber-400",
        };
        return colors[category as InternalRoleCategory] || "text-slate-400";
    } else {
        const colors: Record<ExternalRoleCategory, string> = {
            [ExternalRoleCategory.CLIENT_LEADERSHIP]: "text-emerald-400",
            [ExternalRoleCategory.CLIENT_OPERATIONS]: "text-cyan-400",
            [ExternalRoleCategory.CLIENT_FINANCE]: "text-amber-400",
            [ExternalRoleCategory.PROVIDER]: "text-purple-400",
        };
        return colors[category as ExternalRoleCategory] || "text-slate-400";
    }
}

/**
 * Get category badge color
 */
export function getCategoryBadgeColor(
    category: string,
): string {
    const colors: Record<string, string> = {
        [InternalRoleCategory.LEADERSHIP]: "text-emerald-400",
        [InternalRoleCategory.OPERATIONS]: "text-cyan-400",
        [InternalRoleCategory.QUALITY]: "text-amber-400",
        [ExternalRoleCategory.CLIENT_LEADERSHIP]: "text-emerald-400",
        [ExternalRoleCategory.CLIENT_OPERATIONS]: "text-cyan-400",
        [ExternalRoleCategory.CLIENT_FINANCE]: "text-amber-400",
        [ExternalRoleCategory.PROVIDER]: "text-purple-400",
    };
    return colors[category] || "text-slate-400";
}

export function isInternalRole(
    role: InternalRole | ExternalRole,
): role is InternalRole {
    return "fullAccessCount" in role;
}

/**
 * Get badge variant based on role code
 */
export function getRoleBadgeVariant(roleCode: RoleCode): RoleBadgeVariant {
  switch (roleCode) {
    case "ROLE_SUPER_ADMIN":
      return "superAdmin";
    case "ROLE_MANAGER":
      return "manager";
    case "ROLE_TEAM_LEAD":
      return "teamLead";
    case "ROLE_ANALYST":
      return "caseAnalyst";
    case "ROLE_VERIFICATION":
      return "verificationCoordinator";
    case "ROLE_QC_ANALYST":
      return "qcAnalyst";
    case "ROLE_SCHEMA_ANALYST":
      return "schemaAnalyst";
    case "ROLE_CLIENT_ADMIN":
      return "clientAdmin";
    case "ROLE_MSO_DIRECTOR":
      return "msoDirector";
    case "ROLE_CLIENT_USER":
      return "facilityManager";
    case "ROLE_ACCOUNTING":
      return "cxoFinance";
    case "ROLE_RECRUITER":
      return "recruiter";
    case "ROLE_PROVIDER":
      return "provider";
    default:
      return "default";
  }
}