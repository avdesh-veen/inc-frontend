"use client";

import { useMemo } from "react";
import { useCurrentUser } from "./use-auth";
import type { PermissionName } from "../types/permissions";
import {
  checkUserPermission,
  checkUserAnyPermission,
  checkUserAllPermissions,
} from "../utils/permission-helpers";

interface UseHasPermissionResult {
  /** Whether the user has the specified permission */
  hasPermission: boolean;
  /** Whether the permission check is still loading */
  isLoading: boolean;
}

/**
 * Hook to check if the current user has a specific permission for a resource.
 *
 * @param resourceName - The name of the resource (e.g., "Users", "Providers")
 * @param permissionCode - The permission code to check (e.g., "users.create", "view_all")
 * @returns Object containing hasPermission boolean and isLoading state
 *
 * @example
 * ```tsx
 * const { hasPermission, isLoading } = useHasPermission("Users", "users.create");
 *
 * if (isLoading) return <Spinner />;
 * if (!hasPermission) return null;
 *
 * return <Button>Create User</Button>;
 * ```
 */
export function useHasPermission(
  resourceName: string,
  permissionCode: PermissionName,
): UseHasPermissionResult {
  const { data: userResponse, isPending, isFetching } = useCurrentUser();

  const hasPermission = useMemo(
    () => checkUserPermission(userResponse?.data, resourceName, permissionCode),
    [userResponse?.data, resourceName, permissionCode],
  );

  return {
    hasPermission,
    isLoading: isPending || isFetching,
  };
}

/**
 * Hook to check if the current user has any of the specified permissions for a resource.
 *
 * @param resourceName - The name of the resource
 * @param permissionCodes - Array of permission codes to check
 * @returns Object containing hasAnyPermission boolean and isLoading state
 *
 * @example
 * ```tsx
 * const { hasAnyPermission } = useHasAnyPermission("Users", ["users.create", "users.update"]);
 * ```
 */
export function useHasAnyPermission(
  resourceName: string,
  permissionCodes: PermissionName[],
): { hasAnyPermission: boolean; isLoading: boolean } {
  const { data: userResponse, isPending, isFetching } = useCurrentUser();

  const hasAnyPermission = useMemo(
    () =>
      checkUserAnyPermission(userResponse?.data, resourceName, permissionCodes),
    [userResponse?.data, resourceName, permissionCodes],
  );

  return {
    hasAnyPermission,
    isLoading: isPending || isFetching,
  };
}

/**
 * Hook to check if the current user has all of the specified permissions for a resource.
 *
 * @param resourceName - The name of the resource
 * @param permissionCodes - Array of permission codes to check
 * @returns Object containing hasAllPermissions boolean and isLoading state
 *
 * @example
 * ```tsx
 * const { hasAllPermissions } = useHasAllPermissions("Users", ["users.create", "users.update"]);
 * ```
 */
export function useHasAllPermissions(
  resourceName: string,
  permissionCodes: PermissionName[],
): { hasAllPermissions: boolean; isLoading: boolean } {
  const { data: userResponse, isPending, isFetching } = useCurrentUser();

  const hasAllPermissions = useMemo(
    () =>
      checkUserAllPermissions(userResponse?.data, resourceName, permissionCodes),
    [userResponse?.data, resourceName, permissionCodes],
  );

  return {
    hasAllPermissions,
    isLoading: isPending || isFetching,
  };
}
