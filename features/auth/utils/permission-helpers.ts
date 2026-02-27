import type { PermissionName } from "../types/permissions";
import type { CurrentUserResponse } from "../types";

/**
 * Check if a user has a specific permission for a resource.
 *
 * @param user - The user object containing rolePermissions
 * @param resourceName - The name of the resource to check
 * @param permissionCode - The permission code to check
 * @returns boolean indicating if the user has the permission
 */
export function checkUserPermission(
  user: CurrentUserResponse | undefined | null,
  resourceName: string,
  permissionCode: PermissionName,
): boolean {
  if (!user?.rolePermissions) return false;

  const resourcePermission = user.rolePermissions.find(
    (rp) => rp.resourceName === resourceName,
  );

  if (!resourcePermission) return false;

  return resourcePermission.permissions.some((p) => p.code === permissionCode);
}

/**
 * Check if a user has any of the specified permissions for a resource.
 *
 * @param user - The user object containing rolePermissions
 * @param resourceName - The name of the resource to check
 * @param permissionCodes - Array of permission codes to check
 * @returns boolean indicating if the user has any of the permissions
 */
export function checkUserAnyPermission(
  user: CurrentUserResponse | undefined | null,
  resourceName: string,
  permissionCodes: PermissionName[],
): boolean {
  if (!user?.rolePermissions) return false;

  const resourcePermission = user.rolePermissions.find(
    (rp) => rp.resourceName === resourceName,
  );

  if (!resourcePermission) return false;

  return permissionCodes.some((code) =>
    resourcePermission.permissions.some((p) => p.code === code),
  );
}

/**
 * Check if a user has all of the specified permissions for a resource.
 *
 * @param user - The user object containing rolePermissions
 * @param resourceName - The name of the resource to check
 * @param permissionCodes - Array of permission codes to check
 * @returns boolean indicating if the user has all of the permissions
 */
export function checkUserAllPermissions(
  user: CurrentUserResponse | undefined | null,
  resourceName: string,
  permissionCodes: PermissionName[],
): boolean {
  if (!user?.rolePermissions) return false;

  const resourcePermission = user.rolePermissions.find(
    (rp) => rp.resourceName === resourceName,
  );

  if (!resourcePermission) return false;

  return permissionCodes.every((code) =>
    resourcePermission.permissions.some((p) => p.code === code),
  );
}
