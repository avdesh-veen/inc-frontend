"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, UserRequest } from "../../types/user-tab";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getRoleBadgeVariant,
  getStatusLabel,
  getStatusBadgeVariant,
} from "../../utils";
import { useUserList } from "../../hooks/use-users";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { appRoutes } from "@/lib/constants/navigation";
import { useHasPermission } from "@/features/auth/hooks/use-has-permission";
import {
  RESOURCES,
  PERMISSIONS,
} from "@/features/auth/utils/permission-constants";
import { GridPagination } from "@/components/shared/grid-pagination";

export function UsersGrid(request?: UserRequest) {
  const { data, isFetching, isPending } = useUserList(request);

  // Check if user has permission to edit users
  const { hasPermission: canEditUsers } = useHasPermission(
    RESOURCES.USERS,
    PERMISSIONS.USERS_UPDATE,
  );

  const users = data?.data.items || [];
  const meta = data?.data.meta;
  const isLoading = isFetching || isPending;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative min-h-80 rounded-[24px] overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 border border-white/6 bg-background/20 backdrop-blur-sm z-10 flex flex-col justify-center items-center gap-2">
            <Spinner className="size-8 shrink-0" />
            <p className="text-sm font-medium text-foreground">
              Updating results...
            </p>
          </div>
        )}

        {/* Table content with blur when loading */}
        <div className={isLoading ? "blur-[2px] pointer-events-none" : ""}>
          <Table>
            <TableHeader>
              <UserHeaderRow />
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center hover:bg-transparent"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <UserRow key={user.id} user={user} canEdit={canEditUsers} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <GridPagination
          currentPage={meta.currentPage}
          totalPages={meta.totalPages}
          totalItems={meta.totalItems}
          itemsPerPage={meta.itemsPerPage}
        />
      )}
    </div>
  );
}

function UserHeaderRow() {
  return (
    <TableRow>
      <TableHead>User</TableHead>
      <TableHead>Type</TableHead>
      <TableHead>Role</TableHead>
      <TableHead>Location</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  );
}

interface UserRowProps {
  user: User;
  /** Whether the current user has permission to edit users */
  canEdit: boolean;
}

function UserRow({ user, canEdit }: Readonly<UserRowProps>) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="size-9 shrink-0">
            <AvatarFallback className="bg-primary rounded-[12px] flex items-center justify-center text-white font-bold text-xs">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <Link href={appRoutes.administration.userDetails("user", user.id)}>
            <div className="text-sm font-medium text-white">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-xs text-white/50">{user.email}</div>
          </Link>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant={user.role.isInternal ? "secondaryLight" : "tertiaryLight"}
        >
          {user.role.isInternal ? "Internal" : "External"}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={getRoleBadgeVariant(user.role.roleCode)}>
          {user.role.roleName}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="text-white/60 text-xs">
          {user.workLocation ? (
            user.workLocation.name
          ) : (
            <span className="text-white/50 italic font-light">No Location</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(user.status)}>
          {getStatusLabel(user.status)}
        </Badge>
      </TableCell>
      <TableCell>
        {canEdit ? (
          <Button variant="ghost-primary" size="xs" asChild>
            <Link href={appRoutes.administration.userDetails("user", user.id)}>
              Edit
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" size="xs" asChild>
            <Link href={appRoutes.administration.userDetails("user", user.id)}>
              View
            </Link>
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
