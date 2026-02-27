"use client";

import { User } from "../../types/user-tab";
import { useUserList } from "../../hooks/use-users";
import { findOption } from "@/lib/utils";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";

type TeamLeadAutoCompleteProps = {
  value: string | null;
  onValueChange: (value: User | null) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function TeamLeadAutoComplete({
  value,
  onValueChange,
  placeholder = "Select a team lead...",
  disabled = false,
}: Readonly<TeamLeadAutoCompleteProps>) {
  const { data, isLoading } = useUserList({ limit: 200 });

  // Filter users with team lead role
  const teamLeadUsers = (data?.data?.items || []).filter(
    (u) => u.role?.roleCode === "ROLE_TEAM_LEAD"
  );

  // Treat empty string as null for the combobox
  const normalizedValue = value === "" ? null : value ?? null;
  const selectedUser = findOption(teamLeadUsers, normalizedValue);

  // Helper to get full name
  const getFullName = (user: User) =>
    [user.firstName, user.lastName].filter(Boolean).join(" ");

  return (
    <Combobox<User>
      items={teamLeadUsers}
      itemToStringLabel={(item: User) => getFullName(item)}
      itemToStringValue={(item: User) => item?.id ?? ""}
      value={selectedUser}
      onValueChange={(item) => onValueChange(item)}
      disabled={disabled || isLoading}
    >
      <ComboboxInput
        placeholder={isLoading ? "Loading team leads..." : placeholder}
        showClear={!!normalizedValue}
      />
      <ComboboxContent>
        <ComboboxEmpty>
          {isLoading ? "Loading team leads..." : "No team leads found"}
        </ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.id} value={item}>
              <div className="flex flex-col">
                <span className="font-medium">{getFullName(item)}</span>
              </div>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
