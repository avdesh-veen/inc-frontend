import { RoleCode } from "@/types";
import { WorkLocation } from "./work-locations";
import { Team, TeamLeadManager } from "./team-tab";

export type UserType = "internal" | "external";

/**
 * User status values
 */
export const USER_STATUS_VALUES = ["active", "inactive", "on_leave"] as const;
export type UserStatus = (typeof USER_STATUS_VALUES)[number];

/**
 * Display labels for user status values
 */
export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  on_leave: "On Leave",
};

/**
 * Background check status values - shared between frontend validation and backend API
 */
export const BG_CHECK_STATUS_VALUES = ["pending", "cleared", "failed", "expired"] as const;
export type BgCheckStatus = (typeof BG_CHECK_STATUS_VALUES)[number];

/**
 * Display labels for background check status values
 */
export const BG_CHECK_STATUS_LABELS: Record<BgCheckStatus, string> = {
  pending: "Pending",
  cleared: "Cleared",
  failed: "Failed",
  expired: "Expired",
};

export interface Role {
  id: string;
  roleName: string;
  roleCode: RoleCode;
  isInternal: boolean;
  isActive: boolean;
  description: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  roleId: string;
  status: UserStatus;
  workLocation: WorkLocation;
  workLocationId: string;
  supervisor: TeamLeadManager;
  supervisorId: string;
  team: Team;
  teamId: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  offshoreRestriction: boolean;
  bgCheckDate: string;
  bgCheckStatus: BgCheckStatus;
  hipaaTrainingDate: string;
  hipaaTrainingExpiry: string;
  securityAwarenessDate: string;
  lastComplianceReviewDate: string;
  ndaSignDate: string;
  userSkills: Skill[];
  skills: Skill[];
}

export interface UserForm {
  firstName: string;
  email: string;
  status: UserStatus;
  roleId: string;
  workLocation: string;
  offshoreRestriction: boolean;
  skills: string[];

  lastName?: string;
  team?: string;
  reportsTo?: string;
  backgroundCheckDate?: string;
  bgCheckStatus?: BgCheckStatus;
  hipaaTrainingDate?: string;
  hipaaTrainingExpiry?: string;
  securityAwarenessDate?: string;
  ndaSignedDate?: string;
  lastComplianceReview?: string;
}

export interface UserRequest {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "on_leave" | "all";
  sort?: string;
  role?: string;
  roleType?: string;
}

export interface UserStats {
  total: number;
  internal: number;
  external: number;
  active: number;
}

export interface Skill {
  id: string;
  name: string;
  skill?: {
    id: string;
    name: string;
  }
}

export interface UserSkillItem {
  id: string;
  code: string;
  skillName: string;
  isAssigned: boolean;
}
