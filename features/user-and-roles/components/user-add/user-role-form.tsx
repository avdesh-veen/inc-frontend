import { useFormContext } from "react-hook-form";

import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type UserFormValues } from "../../validations/user-schema";
import { UserGroup02Icon } from "@hugeicons/core-free-icons";
import { FormSectionHeader } from "./form-section-header";
import { RoleAutoComplete } from "../role-tab/role-auto-complete";
import { TeamAutoComplete } from "../team-tab/team-auto-complete";
import { TeamLeadAutoComplete } from "../team-tab/team-lead-auto-complete";
import { RequiredSymbol } from "@/components/shared/required-symbol";

export function UserRoleForm() {
  const form = useFormContext<UserFormValues>();

  return (
    <div>
      <FormSectionHeader
        title="Role & Team Assignment"
        icon={UserGroup02Icon}
        className="text-amber-400"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Role
                <RequiredSymbol />
              </FormLabel>
              <FormControl>
                <RoleAutoComplete
                  value={field.value ?? ""}
                  onValueChange={(value) => field.onChange(value?.id ?? "")}
                  placeholder="Select a role"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teamId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team</FormLabel>
              <FormControl>
                <TeamAutoComplete
                  value={field.value ?? ""}
                  onValueChange={(value) => field.onChange(value?.id ?? "")}
                  placeholder="Select a team"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="supervisorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reports To</FormLabel>
              <FormControl>
                <TeamLeadAutoComplete
                  value={field.value ?? ""}
                  onValueChange={(value) => field.onChange(value?.id ?? "")}
                  placeholder="Select a reports to user"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
