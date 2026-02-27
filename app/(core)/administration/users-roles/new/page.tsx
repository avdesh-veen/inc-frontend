import { PageHeader } from "@/components/shared/page-header";
import { UserForm } from "@/features/user-and-roles/components/user-add/user-form";
import { redirect } from "next/navigation";
import { appRoutes } from "@/lib/constants/navigation";
import { UserFormBoundary } from "@/features/user-and-roles/components/user-add/user-form-boundary";
import { CreateUserPermissionGuard } from "@/features/user-and-roles/components/user-add/create-user-permission-guard";

const tabs = [
  {
    label: "User",
    value: "user",
  },
];

type Props = {
  searchParams: Promise<{
    tab: string;
  }>;
};

export default async function AddUserPage(props: Readonly<Props>) {
  const { tab = "user" } = await props.searchParams;

  const currentTab = tabs.find((t) => t.value === tab);
  if (!currentTab)
    return redirect(appRoutes.administration.usersRoles("users"));

  if (currentTab.value === "user") {
    return (
      <CreateUserPermissionGuard>
        <div className="flex flex-1 flex-col gap-6 p-8">
          <div className="p-6 rounded-[24px] border border-white/6 bg-white/3 backdrop-blur-2xl">
            <PageHeader
              title="Add New User"
              description="Create a new user with role, location, and skill assignments"
              backButtonHref={appRoutes.administration.usersRoles("users")}
            />
            <UserFormBoundary>
              <UserForm />
            </UserFormBoundary>
          </div>
        </div>
      </CreateUserPermissionGuard>
    );
  }

  return null;
}
