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
import {
  BG_CHECK_STATUS_VALUES,
  BG_CHECK_STATUS_LABELS,
  type BgCheckStatus,
} from "../../types/user-tab";

type BgCheckStatusOption = {
  id: BgCheckStatus;
  label: string;
};

const BG_CHECK_STATUS_OPTIONS: BgCheckStatusOption[] = BG_CHECK_STATUS_VALUES.map(
  (status) => ({
    id: status,
    label: BG_CHECK_STATUS_LABELS[status],
  })
);

type BgCheckStatusAutoCompleteProps = {
  value: BgCheckStatus | "" | null | undefined;
  onValueChange: (value: BgCheckStatusOption | null) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function BgCheckStatusAutoComplete({
  value,
  onValueChange,
  placeholder = "Select BG check status...",
  disabled = false,
}: Readonly<BgCheckStatusAutoCompleteProps>) {
  // Treat empty string as null for the combobox
  const normalizedValue = value === "" ? null : value ?? null;
  const selectedOption = findOption(BG_CHECK_STATUS_OPTIONS, normalizedValue);

  return (
    <Combobox<BgCheckStatusOption>
      items={BG_CHECK_STATUS_OPTIONS}
      itemToStringLabel={(item: BgCheckStatusOption) => item?.label ?? ""}
      itemToStringValue={(item: BgCheckStatusOption) => item?.id ?? ""}
      value={selectedOption}
      onValueChange={(item) => onValueChange(item)}
      disabled={disabled}
    >
      <ComboboxInput placeholder={placeholder} showClear={!!normalizedValue} />
      <ComboboxContent>
        <ComboboxEmpty>No status found</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.id} value={item}>
              <span className="font-medium">{item.label}</span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
