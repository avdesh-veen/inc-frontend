"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  UserIcon,
  ShieldKeyIcon,
} from "@hugeicons/core-free-icons";
import { useRoleDetail } from "../../hooks/use-roles";
import { cn } from "@/lib/utils";
import { RoleDetailSkeleton } from "./role-detail-skeleton";

interface RoleDetailContentProps {
  roleId: string;
}

export function RoleDetailContent({ roleId }: Readonly<RoleDetailContentProps>) {
  const router = useRouter();

  const { data: roleResponse, isLoading, isFetching, isError, error } = useRoleDetail(roleId);
  const roleData = roleResponse?.data;

  const handleBack = React.useCallback(() => {
    router.push("/administration/users-roles?tab=roles");
  }, [router]);

  // Loading state with skeleton
  if (isLoading || isFetching) {
    return <RoleDetailSkeleton />;
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-destructive text-5xl">⚠️</div>
          <h2 className="text-xl font-semibold">Failed to load role</h2>
          <p className="text-sm text-muted-foreground">
            {error?.message || "An error occurred while loading the role information."}
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={handleBack}>
              Go Back
            </Button>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  // No role found
  if (!roleData) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="text-muted-foreground text-5xl">🔐</div>
          <h2 className="text-xl font-semibold">Role not found</h2>
          <p className="text-sm text-muted-foreground">
            The role you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <div
        className="backdrop-blur-2xl border border-input rounded-3xl flex flex-col h-full"
        style={{ background: "var(--glass-bg)" }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="shrink-0 rounded-xl"
              >
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  className="size-5"
                  strokeWidth={2}
                />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <HugeiconsIcon
                    icon={ShieldKeyIcon}
                    className="size-6 text-primary"
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    {roleData.roleName}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {roleData.categoryName} • {roleData.roleCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Role Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Role Name
                    </p>
                    <p className="text-sm font-medium">{roleData.roleName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Role Code
                    </p>
                    <p className="text-sm font-medium font-mono">
                      {roleData.roleCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Category
                    </p>
                    <p className="text-sm font-medium">
                      {roleData.categoryName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Role Type
                    </p>
                    <Badge
                      variant={roleData.isInternal ? "default" : "secondary"}
                    >
                      {roleData.isInternal ? "Internal" : "External"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <Badge
                      variant={roleData.isActive ? "default" : "secondary"}
                      className={cn(
                        roleData.isActive
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-red-500/10 text-red-500"
                      )}
                    >
                      <HugeiconsIcon
                        icon={
                          roleData.isActive
                            ? CheckmarkCircle02Icon
                            : Cancel01Icon
                        }
                        className="size-3 mr-1"
                        strokeWidth={2}
                      />
                      {roleData.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Order</p>
                    <p className="text-sm font-medium">{roleData.order}</p>
                  </div>
                </div>
                {roleData.description && (
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Description
                    </p>
                    <p className="text-sm text-foreground/80">
                      {roleData.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Permissions Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Permissions</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {roleData.permissions?.length || 0} Resources
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {roleData.permissions && roleData.permissions.length > 0 ? (
                  <div className="space-y-4">
                    {roleData.permissions.map((resource) => (
                      <div
                        key={resource.resourceId}
                        className="rounded-lg border border-border/50 p-4"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 rounded-md bg-primary/10">
                            <HugeiconsIcon
                              icon={UserIcon}
                              className="size-4 text-primary"
                              strokeWidth={2}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {resource.resourceName}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {resource.resourceCode}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {resource.permissions.map((permission, index) => (
                            <Badge
                              key={`${permission.id}-${index}`}
                              variant="outline"
                              className="text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                            >
                              {permission.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="p-3 rounded-full bg-muted/50 mb-3">
                      <HugeiconsIcon
                        icon={ShieldKeyIcon}
                        className="size-6 text-muted-foreground"
                        strokeWidth={2}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No permissions assigned to this role
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
