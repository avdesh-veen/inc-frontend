"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { appRoutes } from "@/lib/constants/navigation";
import { RoleTabProvider } from "./role-tab-context";
import { AddRoleAction } from "../tabs-actions";

interface RolesTabSectionProps {
  tabs: Array<{ label: string; value: string }>;
  children: React.ReactNode;
  editRoleId?: string;
}

export function RolesTabSection({
  tabs,
  children,
  editRoleId,
}: Readonly<RolesTabSectionProps>) {
  return (
    <RoleTabProvider initialEditRoleId={editRoleId}>
      {/* Page Header with Add Role button */}
      <PageHeader
        title="User Management"
        description="Manage users, roles, teams, and permissions"
      >
        <AddRoleAction />
      </PageHeader>

      <TabsList className="mt-4">
        {tabs.map((t) => (
          <TabsTrigger key={t.value} value={t.value} asChild>
            <Link href={appRoutes.administration.usersRoles(t.value)}>
              {t.label}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent key={"roles"} value={"roles"} className="mt-6">
        {children}
      </TabsContent>
    </RoleTabProvider>
  );
}
