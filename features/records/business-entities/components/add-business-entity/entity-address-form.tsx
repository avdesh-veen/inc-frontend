"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { FormSectionHeader } from "./form-section-header";
import type { AddBusinessEntityFormValues } from "../../validations/add-business-entity-schema";
import {
  STATE_OPTIONS,
  findOptionByValue,
  type LabelValueOption,
} from "./constants";

export function EntityAddressForm() {
  const form = useFormContext<AddBusinessEntityFormValues>();

  return (
    <div>
      <FormSectionHeader
        title="PRIMARY ADDRESS"
        className="text-white/60"
      />
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="123 Medical Plaza" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="City" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>State</FormLabel>
                <Combobox<LabelValueOption>
                  items={STATE_OPTIONS}
                  itemToStringValue={(item) => item?.label ?? ""}
                  value={findOptionByValue(
                    STATE_OPTIONS,
                    field.value ?? "",
                  )}
                  onValueChange={(item) =>
                    field.onChange(item?.value ?? "")
                  }
                >
                  <ComboboxInput
                    placeholder="..."
                    showClear={!!field.value}
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No state found</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.value} value={item}>
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="12345" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
