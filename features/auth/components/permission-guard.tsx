"use client";

import type { ReactNode } from "react";
import { useHasPermission } from "../hooks/use-has-permission";
import { PermissionDeniedPlaceholder } from "./permission-denied-placeholder";
import type { PermissionName } from "../types/permissions";

interface PermissionGuardProps {
  /** The name of the resource to check permission for */
  resourceName: string;
  /** The permission code required */
  permissionCode: PermissionName;
  /** Content to render when permission is granted */
  children: ReactNode;
  /** Optional content to render when permission is denied. Defaults to null (hidden). */
  fallback?: ReactNode;
  /** Whether to show the permission denied placeholder when access is denied. Defaults to false. */
  showDenied?: boolean;
  /** Custom title for the permission denied placeholder */
  deniedTitle?: string;
  /** Custom message for the permission denied placeholder */
  deniedMessage?: string;
}

/**
 * A wrapper component that conditionally renders children based on user permissions.
 *
 * Use this component to protect UI elements that should only be visible to users
 * with specific permissions. It supports three modes:
 *
 * 1. **Hidden** (default): Content is not rendered if permission is denied
 * 2. **Fallback**: Custom fallback content is rendered if permission is denied
 * 3. **Denied Placeholder**: Shows a permission denied message if permission is denied
 *
 */
export function PermissionGuard({
  resourceName,
  permissionCode,
  children,
  fallback = null,
  showDenied = false,
  deniedTitle,
  deniedMessage,
}: PermissionGuardProps) {
  const { hasPermission, isLoading } = useHasPermission(
    resourceName,
    permissionCode,
  );

  // While loading, render nothing to prevent flash of content
  if (isLoading) {
    return null;
  }

  // If user has permission, render children
  if (hasPermission) {
    return <>{children}</>;
  }

  // If showDenied is true, render the permission denied placeholder
  if (showDenied) {
    return (
      <PermissionDeniedPlaceholder title={deniedTitle} message={deniedMessage} />
    );
  }

  // Otherwise, render the fallback (default: null)
  return <>{fallback}</>;
}
