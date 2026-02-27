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
import { WorkLocation } from "../../types/work-locations";
import { useWorkLocations } from "../../hooks/use-work-locations";

type LocationsAutoCompleteProps = {
  value: string | null;
  onValueChange: (value: WorkLocation | null) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function LocationsAutoComplete({
  value,
  onValueChange,
  placeholder = "Select a location...",
  disabled = false,
}: Readonly<LocationsAutoCompleteProps>) {
  const { data, isLoading } = useWorkLocations();

  const locations = data?.data.items || [];
  // Treat empty string as null for the combobox
  const normalizedValue = value === "" ? null : value ?? null;
  const selectedLocation = findOption(locations, normalizedValue);

  return (
    <Combobox<WorkLocation>
      items={locations}
      itemToStringLabel={(item: WorkLocation) => item?.name ?? ""}
      itemToStringValue={(item: WorkLocation) => item?.id ?? ""}
      value={selectedLocation}
      onValueChange={(item) => onValueChange(item)}
      disabled={disabled || isLoading}
    >
      <ComboboxInput
        placeholder={isLoading ? "Loading locations..." : placeholder}
        showClear={!!normalizedValue}
      />
      <ComboboxContent>
        <ComboboxEmpty>
          {isLoading ? "Loading locations..." : "No locations found"}
        </ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.id} value={item}>
              <div className="flex flex-col">
                <span className="font-medium">{item.name} - {item.type === "offshore" ? "Offshore" : "Onshore"}</span>
              </div>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
