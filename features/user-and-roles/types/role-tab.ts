import { RoleCode } from "@/types";

export interface Role {
  id: string;
  roleName: string;
  roleCode: RoleCode;
  description: string;
  isInternal: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categoryName?: string;
  completeResourcePermissionCount?: number;
  limitedResourcePermissionCount?: number;
}

export interface RoleRequest {
  isInternal?: boolean;
  isActive?: boolean;
  editRoleId?: string;
  page?: number;
  limit?: number;
}
