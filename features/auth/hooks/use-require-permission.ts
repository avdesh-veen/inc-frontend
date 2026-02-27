"use client";

import { useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCurrentUser } from "./use-auth";
import type { PermissionName } from "../types/permissions";
import { appRoutes } from "@/lib/constants/navigation";
import {
  checkUserPermission,
  checkUserAnyPermission,
} from "../utils/permission-helpers";

interface UseRequirePermissionOptions {
  /** URL to redirect to if permission is denied. Defaults to appRoutes.myWork.dashboard */
  redirectTo?: string;
  /** Custom message to show in the toast notification */
  message?: string;
  /** Whether to show toast notification on redirect. Defaults to true */
  showToast?: boolean;
}

/**
 * Hook to protect routes/pages by requiring a specific permission.
 * Redirects unauthorized users to the specified route and shows a toast notification.
 *
 * @param resourceName - The name of the resource (e.g., "Users", "Providers")
 * @param permissionCode - The permission code to check (e.g., "users.view_all")
 * @param options - Configuration options for redirect and toast
 */
export function useRequirePermission(
  resourceName: string,
  permissionCode: PermissionName,
  options: UseRequirePermissionOptions = {},
): { isLoading: boolean; hasPermission: boolean } {
  const {
    redirectTo = appRoutes.myWork.dashboard,
    message = "You don't have permission to access this page.",
    showToast = true,
  } = options;

  const router = useRouter();
  const { data: userResponse, isPending, isError } = useCurrentUser();
  const hasRedirected = useRef(false);

  // Only treat as loading when there is genuinely no data yet (first fetch).
  // Background refetches (isFetching while isPending=false) should not block
  // the permission check — we act on whatever data we currently have.
  const isLoading = isPending;

  // Check if user has the required permission
  const hasPermission = useMemo(
    () => checkUserPermission(userResponse?.data, resourceName, permissionCode),
    [userResponse?.data, resourceName, permissionCode],
  );

  useEffect(() => {
    // Don't redirect while initial data is loading
    if (isLoading) return;

    // Redirect if the auth check itself errored (e.g. network failure / 401)
    const shouldRedirect = isError || !hasPermission;
    if (!shouldRedirect) return;

    // Don't fire multiple redirects within the same mount cycle
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    // Show toast notification if enabled
    if (showToast) {
      toast.error("Access Denied", {
        description: message,
        duration: 5000,
        dismissible: false,
      });
    }

    // Redirect to the specified route
    router.replace(redirectTo);
  }, [isLoading, isError, hasPermission, redirectTo, message, showToast, router]);

  // Reset the ref when permission state changes so a role change during the
  // session is always re-evaluated rather than silently staying unlocked.
  useEffect(() => {
    if (!isPending && !hasPermission) {
      hasRedirected.current = false;
    }
  }, [isPending, hasPermission]);

  return {
    isLoading,
    hasPermission,
  };
}

/**
 * Hook to require any of the specified permissions for a resource.
 * Useful when multiple permissions can grant access to a page.
 *
 * @param resourceName - The name of the resource
 * @param permissionCodes - Array of permission codes (user needs ANY of these)
 * @param options - Configuration options for redirect and toast
 *
 * @example
 * ```tsx
 * // User needs either create or update permission
 * useRequireAnyPermission("Users", ["users.create", "users.update"]);
 * ```
 */
export function useRequireAnyPermission(
  resourceName: string,
  permissionCodes: PermissionName[],
  options: UseRequirePermissionOptions = {},
): { isLoading: boolean; hasPermission: boolean } {
  const {
    redirectTo = appRoutes.myWork.dashboard,
    message = "You don't have permission to access this page.",
    showToast = true,
  } = options;

  const router = useRouter();
  const { data: userResponse, isPending, isError } = useCurrentUser();
  const hasRedirected = useRef(false);

  const isLoading = isPending;

  // Check if user has any of the required permissions
  const hasPermission = useMemo(
    () =>
      checkUserAnyPermission(userResponse?.data, resourceName, permissionCodes),
    [userResponse?.data, resourceName, permissionCodes],
  );

  useEffect(() => {
    if (isLoading) return;

    const shouldRedirect = isError || !hasPermission;
    if (!shouldRedirect) return;
    if (hasRedirected.current) return;

    hasRedirected.current = true;

    if (showToast) {
      toast.error("Access Denied", {
        description: message,
        duration: 5000,
      });
    }

    router.replace(redirectTo);
  }, [isLoading, isError, hasPermission, redirectTo, message, showToast, router]);

  useEffect(() => {
    if (!isPending && !hasPermission) {
      hasRedirected.current = false;
    }
  }, [isPending, hasPermission]);

  return {
    isLoading,
    hasPermission,
  };
}
