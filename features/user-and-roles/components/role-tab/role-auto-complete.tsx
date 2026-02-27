"use client";

import { Role } from "../../types/role-tab";
import { useRolesList } from "../../hooks/use-roles";
import { findOption } from "@/lib/utils";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";

type RoleAutoCompleteProps = {
  value: string | null;
  onValueChange: (value: Role | null) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: "default" | "primary" | "outline";
};

export function RoleAutoComplete({
  value,
  onValueChange,
  placeholder = "Select a role...",
  disabled = false,
  variant,
}: Readonly<RoleAutoCompleteProps>) {
  const { data, isLoading } = useRolesList({
    isActive: true,
    isInternal: true,
    page: 1,
    limit: 100,
  });

  // Filter out ROLE_SUPER_ADMIN from the roles list
  const roles = (data?.data.items || []).filter(
    (role) => role.roleCode !== "ROLE_SUPER_ADMIN"
  );
  // Treat empty string as null for the combobox
  const normalizedValue = value === "" ? null : value ?? null;
  const selectedRole = findOption(roles, normalizedValue);

  return (
    <Combobox<Role>
      items={roles}
      itemToStringLabel={(item: Role) => item?.roleName ?? ""}
      itemToStringValue={(item: Role) => item?.id ?? ""}
      value={selectedRole}
      onValueChange={(item) => onValueChange(item)}
      disabled={disabled || isLoading}
    >
        <ComboboxInput
          placeholder={isLoading ? "Loading roles..." : placeholder}
          showClear={!!normalizedValue}
          variant={variant ?? "default"}
      />
      <ComboboxContent>
        <ComboboxEmpty>
          {isLoading ? "Loading roles..." : "No roles found"}
        </ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.id} value={item}>
              <div className="flex flex-col">
                <span className="font-medium">{item.roleName}</span>
              </div>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
