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
import { TriggerEvent } from "@/features/settings/types/trigger-events";
import { useTriggerEventsList } from "@/features/settings/hooks/use-trigger-events";

type TriggerEventsAutoCompleteProps = {
  value: string | null;
  onValueChange: (value: TriggerEvent | null) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: "default" | "primary" | "outline";
};

export function TriggerEventsAutoComplete({
  value,
  onValueChange,
  placeholder = "Select a trigger event...",
  disabled = false,
  variant,
}: Readonly<TriggerEventsAutoCompleteProps>) {
  const { data, isLoading } = useTriggerEventsList({
    isActive: true,
    allData: true,
  });

  // Treat empty string as null for the combobox
  const normalizedValue = value === "" ? null : (value ?? null);
  const selectedTriggerEvent = findOption(
    data?.data?.items || [],
    normalizedValue,
  );
  const triggerEvents = data?.data?.items || [];

  return (
    <Combobox<TriggerEvent>
      items={triggerEvents}
      itemToStringLabel={(item: TriggerEvent) => item?.name ?? ""}
      itemToStringValue={(item: TriggerEvent) => item?.id ?? ""}
      value={selectedTriggerEvent}
      onValueChange={(item) => onValueChange(item)}
      disabled={disabled || isLoading}
    >
      <ComboboxInput
        placeholder={isLoading ? "Loading trigger events..." : placeholder}
        showClear={!!normalizedValue}
        variant={variant ?? "default"}
      />
      <ComboboxContent>
        <ComboboxEmpty>
          {isLoading ? "Loading trigger events..." : "No trigger events found"}
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
