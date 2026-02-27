"use client";

import type { WorkCategory } from "@/features/settings/types/work-category";
import { useWorkCategories } from "@/features/settings/hooks/use-work-categories";
import { findOption } from "@/lib/utils";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";

type WorkCategoryAutoCompleteProps = {
  value: string | null;
  onValueChange: (value: WorkCategory | null) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: "default" | "primary" | "outline";
};

export function WorkCategoryAutoComplete({
  value,
  onValueChange,
  placeholder = "Select a work category...",
  disabled = false,
  variant,
}: Readonly<WorkCategoryAutoCompleteProps>) {
  const { data: workCategoriesResponse, isLoading } = useWorkCategories({
    page: 1,
    limit: 100,
  });
  const categories: WorkCategory[] =
    workCategoriesResponse?.data?.items ?? [];

  const normalizedValue = value === "" ? null : value ?? null;
  const selectedCategory = findOption(categories, normalizedValue);

  return (
    <Combobox<WorkCategory>
      items={categories}
      itemToStringLabel={(item: WorkCategory) => item?.name ?? ""}
      itemToStringValue={(item: WorkCategory) => item?.id ?? ""}
      value={selectedCategory}
      onValueChange={(item) => onValueChange(item)}
      disabled={disabled || isLoading}
    >
      <ComboboxInput
        placeholder={isLoading ? "Loading categories..." : placeholder}
        showClear={!!normalizedValue}
        variant={variant ?? "default"}
      />
      <ComboboxContent>
        <ComboboxEmpty>
          {isLoading ? "Loading categories..." : "No work categories found"}
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
