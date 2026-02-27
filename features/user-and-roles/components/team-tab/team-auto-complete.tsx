"use client";

import { findOption } from "@/lib/utils";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { Team } from "../../types/team-tab";
import { useTeamList } from "../../hooks/use-teams";

type TeamAutoCompleteProps = {
  value: string | null;
  onValueChange: (value: Team | null) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function TeamAutoComplete({
  value,
  onValueChange,
  placeholder = "Select a team...",
  disabled = false,
}: TeamAutoCompleteProps) {
  const { data, isLoading } = useTeamList();

  const teams = data?.data.items || [];
  // Treat empty string as null for the combobox
  const normalizedValue = value === "" ? null : value ?? null;
  const selectedTeam = findOption(teams, normalizedValue);

  return (
    <Combobox<Team>
      items={teams}
      itemToStringLabel={(item: Team) => item?.name ?? ""}
      itemToStringValue={(item: Team) => item?.id ?? ""}
      value={selectedTeam}
      onValueChange={(item) => onValueChange(item)}
      disabled={disabled || isLoading}
    >
      <ComboboxInput
        placeholder={isLoading ? "Loading teams..." : placeholder}
        showClear={!!normalizedValue}
      />
      <ComboboxContent>
        <ComboboxEmpty>
          {isLoading ? "Loading teams..." : "No teams found"}
        </ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.id} value={item}>
              <div className="flex flex-col">
                <span className="font-medium">{item.name}</span>
              </div>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
