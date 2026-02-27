"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { appRoutes } from "@/lib/constants/navigation";

type Tab = {
  label: string;
  value: string;
};

type UsersRolesTabsProps = {
  tab: string;
  tabs: Tab[];
  currentTab: Tab;
  rolesContent?: ReactNode;
  usersContent?: ReactNode;
  teamsContent?: ReactNode;
  externalRolesContent?: ReactNode;
};

export function UsersRolesTabs({
  tab,
  tabs,
  currentTab,
  rolesContent,
  usersContent,
  teamsContent,
  externalRolesContent,
}: Readonly<UsersRolesTabsProps>) {
  return (
    <Tabs value={tab} className="flex-1">
      {/* For roles tab, we need the header inside the provider */}
      {currentTab.value === "roles" && rolesContent}

      {/* For non-roles tabs, render normally */}
      {currentTab.value !== "roles" && (
        <div className="flex flex-col gap-6">
          <TabsList>
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value} asChild>
                <Link href={appRoutes.administration.usersRoles(t.value)}>
                  {t.label}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent key={"users"} value={"users"}>
            {usersContent}
          </TabsContent>

          <TabsContent key={"teams"} value={"teams"}>
            {teamsContent}
          </TabsContent>

          <TabsContent
            key={"external-roles"}
            value={"external-roles"}
          >
            {externalRolesContent}
          </TabsContent>
        </div>
      )}
    </Tabs>
  );
}
