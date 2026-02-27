import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { Separator } from "@/components/ui/separator";

import { appRoutes } from "@/lib/constants/navigation";

import { UserForm } from "@/features/user-and-roles/components/user-add/user-form";
import { UserFormBoundary } from "@/features/user-and-roles/components/user-add/user-form-boundary";
import { UserDetailsBoundary } from "@/features/user-and-roles/components/user-add/user-detail-boundary";

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
  params: Promise<{
    id: string;
  }>;
};

export default async function UserDetailsPage(props: Readonly<Props>) {
  const { tab = "user" } = await props.searchParams;
  const { id } = await props.params;

  if (!id) return redirect(appRoutes.administration.usersRoles("users"));

  const currentTab = tabs.find((t) => t.value === tab);
  if (!currentTab)
    return redirect(appRoutes.administration.usersRoles("users"));

  if (currentTab.value === "user") {
    return (
      <div className="flex flex-1 flex-col gap-6 p-8">
        <PageHeader
          title="Edit User"
          description="Update user profile, location, and skills"
          backButtonHref={appRoutes.administration.usersRoles("users")}
        />
        <Separator className="h-px bg-white/5" />
        <UserDetailsBoundary id={id}>
          <UserFormBoundary>
            <UserForm id={id}/>
          </UserFormBoundary>
        </UserDetailsBoundary>
      </div>
    );
  }

  return null;
}
