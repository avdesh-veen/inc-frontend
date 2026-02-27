import { redirect } from "next/navigation";
import { Suspense } from "react";

import { PageHeader } from "@/components/shared/page-header";
import { AddUserAction } from "@/features/user-and-roles/components/tabs-actions";
import { AddTeamTriggerWithModal } from "@/features/user-and-roles/components/team-tab/add-team-trigger";
import { appRoutes } from "@/lib/constants/navigation";
import { UsersRolesTabs } from "./users-roles-tabs";
import { RolesTabSection } from "@/features/user-and-roles/components/role-tab/roles-tab-section";
import { RoleBoundary } from "@/features/user-and-roles/components/role-tab/role-boundary";
import { RolesTab } from "@/features/user-and-roles/components/role-tab/role-tab";
import { UserBoundary } from "@/features/user-and-roles/components/user-tab/user-boundary";
import { UsersTab } from "@/features/user-and-roles/components/user-tab/user-tab";
import { ExternalRoleTab } from "@/features/user-and-roles/components/external-role-tab/external-role-tab";
import { TeamBoundary } from "@/features/user-and-roles/components/team-tab/team-boundary";
import { TeamsTab } from "@/features/user-and-roles/components/team-tab/teams-tab";
import { TableLoadingSkeleton } from "@/features/user-and-roles/components/table-loading-skeleton";

type Props = {
  searchParams: Promise<{
    tab: string;
    page?: string;
    limit?: string;
    search?: string;
    status?: "active" | "inactive" | "on_leave" | "all";
    role?: string;
    sort?: string;
    editRoleId?: string;
  }>;
};

const tabs = [
  {
    label: "Users",
    value: "users",
  },
  {
    label: "Roles",
    value: "roles",
  },
  {
    label: "Teams",
    value: "teams",
  },
  {
    label: "External Roles",
    value: "external-roles",
  },
];

export default async function UserModulePage(props: Readonly<Props>) {
  const { tab, editRoleId, page, limit, ...restFilters } = await props.searchParams;
  if (!tab) return redirect(appRoutes.administration.usersRoles("users"));

  // Parse numeric params with validation
  const parsedPage = page !== undefined ? Number.parseInt(page, 10) : undefined;
  const parsedLimit = limit !== undefined ? Number.parseInt(limit, 10) : undefined;

  const filters = {
    ...restFilters,
    ...(parsedPage !== undefined && !Number.isNaN(parsedPage) && { page: parsedPage }),
    ...(parsedLimit !== undefined && !Number.isNaN(parsedLimit) && { limit: parsedLimit }),
  };

  const currentTab = tabs.find((t) => t.value === tab);
  if (!currentTab)
    return redirect(appRoutes.administration.usersRoles("users"));

  // Render action button based on current tab
  const renderAction = () => {
    switch (currentTab.value) {
      case "users":
        return <AddUserAction />;
      case "teams":
        return <AddTeamTriggerWithModal />;
      case "external-roles":
        return <AddUserAction />;
      default:
        return null;
    }
  };
  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      {/* Page Header - for non-roles tabs */}
      {currentTab.value !== "roles" && (
        <PageHeader
          title="User Management"
          description="Manage users, roles, teams, and permissions"
        >
          {renderAction()}
        </PageHeader>
      )}

      {/* Tabs */}
      <UsersRolesTabs
        tab={tab}
        tabs={tabs}
        currentTab={currentTab}
        rolesContent={
          <RolesTabSection tabs={tabs} editRoleId={editRoleId}>
            <RoleBoundary request={filters} editRoleId={editRoleId}>
              <RolesTab {...filters} editRoleId={editRoleId} />
            </RoleBoundary>
          </RolesTabSection>
        }
        usersContent={
          <Suspense fallback={<TableLoadingSkeleton />}>
            <UserBoundary request={filters}>
              <UsersTab {...filters} />
            </UserBoundary>
          </Suspense>
        }
        teamsContent={
          <Suspense fallback={<TableLoadingSkeleton />}>
            <TeamBoundary request={filters}>
              <TeamsTab {...filters} />
            </TeamBoundary>
          </Suspense>
        }
        externalRolesContent={<ExternalRoleTab filters={filters} />}
      />
    </div>
  );
}
