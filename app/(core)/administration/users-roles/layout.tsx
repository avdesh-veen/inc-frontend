import type { ReactNode } from "react";
import { UsersRolesPermissionGuard } from "@/features/user-and-roles/components/users-roles-permission-guard";

interface UsersRolesLayoutProps {
  children: ReactNode;
}

/**
 * Layout for the Users & Roles module.
 *
 * This layout wraps all pages in the users-roles section with a permission
 * guard that requires the "users.view_all" permission. Unauthorized users
 * will be redirected to the dashboard.
 */
export default function UsersRolesLayout({ children }: Readonly<UsersRolesLayoutProps>) {
  return <UsersRolesPermissionGuard>{children}</UsersRolesPermissionGuard>;
}
