"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import {
  userFormSchema,
  type UserFormValues,
} from "../../validations/user-schema";

import { BasicForm } from "./user-basic-form";
import { UserRoleForm } from "./user-role-form";
import { UserLocationForm } from "./user-location-form";
import { SkillsForm } from "./skills-form";
import { UserComplianceForm } from "./user-compliance-form";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  useCreateUser,
  useUpdateUser,
  useUpdateUserStatus,
  useUserById,
} from "../../hooks/use-users";
import { useRouter } from "next/navigation";
import { appRoutes } from "@/lib/constants/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useHasPermission } from "@/features/auth/hooks/use-has-permission";
import {
  RESOURCES,
  PERMISSIONS,
} from "@/features/auth/utils/permission-constants";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon } from "@hugeicons/core-free-icons";

type AddUserProps = {
  id?: string;
};
export function UserForm(props: AddUserProps) {
  const id = props.id;
  const router = useRouter();

  const { data: userData } = useUserById(id);
  const { mutateAsync: createUser, isPending } = useCreateUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: changeUserStatus, isPending: isStatusUpdating } = useUpdateUserStatus();
  const [statusDialogOpen, setStatusDialogOpen] = React.useState(false);
  const { hasPermission: canDeactivateUsers } = useHasPermission(
    RESOURCES.USERS,
    PERMISSIONS.USERS_DEACTIVATE,
  );
  const { hasPermission: canCreateUsers } = useHasPermission(
    RESOURCES.USERS,
    PERMISSIONS.USERS_CREATE,
  );
  const { hasPermission: canUpdateUsers } = useHasPermission(
    RESOURCES.USERS,
    PERMISSIONS.USERS_UPDATE,
  );

  // In edit mode require users.update; in create mode require users.create.
  const canSubmit = id ? canUpdateUsers : canCreateUsers;

  const isUserActive = userData?.data?.status === "active";
  const targetStatus = isUserActive ? "inactive" : "active";

  const handleStatusConfirm = () => {
    if (!id) return;
    changeUserStatus(
      { id, formData: { status: targetStatus } },
      { onSuccess: () => setStatusDialogOpen(false) },
    );
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: userData?.data?.firstName ?? "",
      lastName: userData?.data?.lastName ?? "",
      email: userData?.data?.email ?? "",
      roleId: userData?.data?.roleId ?? "",
      teamId: userData?.data?.teamId ?? undefined,
      supervisorId: userData?.data?.supervisorId ?? "",
      workLocationId: userData?.data?.workLocationId ?? "",
      status: (userData?.data?.status as "active" | "inactive" | "on_leave") ?? "active",
      offshoreRestriction: userData?.data?.offshoreRestriction ?? false,
      userSkills:
        userData?.data?.skills?.map(
          (skill) =>  skill.id,
        ) ?? [],
      ndaSignDate: userData?.data?.ndaSignDate ?? "",
      bgCheckDate: userData?.data?.bgCheckDate ?? "",
      bgCheckStatus: userData?.data?.bgCheckStatus ?? "",
      hipaaTrainingDate: userData?.data?.hipaaTrainingDate ?? "",
      hipaaTrainingExpiry: userData?.data?.hipaaTrainingExpiry ?? "",
      securityAwarenessDate: userData?.data?.securityAwarenessDate ?? "",
      lastComplianceReviewDate: userData?.data?.lastComplianceReviewDate ?? "",
    },
  });

  const handleSubmit = (data: UserFormValues) => {
    if (id) {
      const modifiedData = getModifiedData();
      updateUser({ id, formData: modifiedData }).then(() => form.reset());
    } else {
      const filteredData = filterEmptyValuesForCreate(data as unknown as Record<string, unknown>) as UserFormValues;
      createUser(filteredData).then(() => form.reset());
    }
  };

  const handleCancel = () => {
    router.push(appRoutes.administration.usersRoles("users"));
    form.reset();
  };

  /**
   * Filters out empty string values from payload for optional fields.
   * Used only for CREATE operations where unset optional fields should not be sent.
   */
  const filterEmptyValuesForCreate = (data: Record<string, unknown>) => {
    const filtered: Record<string, unknown> = {};
    Object.entries(data).forEach(([key, value]) => {
      // Only include non-empty values (exclude empty strings for optional fields)
      if (value !== "" && value !== undefined) {
        filtered[key] = value;
      }
    });
    return filtered;
  };

  /**
   * Gets only the modified (dirty) fields for UPDATE operations.
   * Preserves empty strings to allow users to clear previously-set values.
   */
  const getModifiedData = () => {
    const data = form.getValues();
    const dirtyFields = form.formState.dirtyFields;

    const modifiedValues: Record<string, unknown> = {};

    Object.keys(dirtyFields).forEach((key) => {
      modifiedValues[key] = data[key as keyof UserFormValues];
    });

    return modifiedValues as Partial<UserFormValues>;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-6 mt-4 pt-6 border-t border-white/10"
      >
        {!canSubmit && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <HugeiconsIcon icon={Alert02Icon} className="size-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-300">View Only</p>
              <p className="text-xs text-amber-300/70 mt-0.5">
                You don&apos;t have permission to {id ? "edit" : "create"} users. Contact your administrator.
              </p>
            </div>
          </div>
        )}

        <fieldset disabled={!canSubmit} className="contents">
          <BasicForm isEditMode={!!id} />
          <UserRoleForm />
          <UserLocationForm isEditMode={!!id} />
          <SkillsForm />
          <UserComplianceForm />
        </fieldset>

        <div className="flex items-center pt-6 border-t border-white/10">
          {id && canDeactivateUsers ? (
            <Button
              size="xl"
              type="button"
              className={isUserActive
                ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              }
              onClick={() => setStatusDialogOpen(true)}
            >
              {isUserActive ? "Deactivate User" : "Activate User"}
            </Button>
          ) : null}

          <div className="flex items-center gap-3 ml-auto">
            <Button size="xl" type="button" variant="muted" onClick={handleCancel}>
              {canSubmit ? "Cancel" : "Back"}
            </Button>
            {canSubmit && (
              <Button size="xl" type="submit" variant="primary" disabled={isPending || isUpdating}>
                {isPending || isUpdating ? (
                  <Spinner className="size-4 animate-spin" />
                ) : null}
                {id ? "Update User" : "Create User"}
              </Button>
            )}
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        title={isUserActive ? "Deactivate User" : "Activate User"}
        description={
          isUserActive
            ? "Are you sure you want to deactivate this user? They will lose access to the system."
            : "Are you sure you want to activate this user? They will regain access to the system."
        }
        confirmLabel={isUserActive ? "Deactivate" : "Activate"}
        loadingLabel={isUserActive ? "Deactivating..." : "Activating..."}
        onConfirm={handleStatusConfirm}
        isLoading={isStatusUpdating}
        variant={isUserActive ? "destructive" : "default"}
      />
    </Form>
  );
}
