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
import { RequiredSymbol } from "@/components/shared/required-symbol";
import { getUniqueClients } from "@/lib/constants/mock-data/business-entity-data";
import type { AddBusinessEntityFormValues } from "../../validations/add-business-entity-schema";
import {
  ENTITY_TYPES,
  STATUS_OPTIONS,
  findOptionById,
  findOptionByValue,
  type ClientOption,
  type LabelValueOption,
} from "./constants";

const clientOptions = getUniqueClients();

export function EntityBasicForm() {
  const form = useFormContext<AddBusinessEntityFormValues>();

  return (
    <div className="space-y-4">
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Client <RequiredSymbol />
              </FormLabel>
              <Combobox<ClientOption>
                items={clientOptions}
                itemToStringValue={(item) => item?.name ?? ""}
                value={findOptionById(clientOptions, field.value)}
                onValueChange={(item) => field.onChange(item?.id ?? "")}
              >
                <ComboboxInput
                  placeholder="Select Client..."
                  showClear={!!field.value}
                />
                <ComboboxContent>
                  <ComboboxEmpty>No clients found</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.id} value={item}>
                        {item.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="entityName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Entity Name <RequiredSymbol />
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Medical Associates, PC" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dba"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DBA (if different)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="entityType"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Entity Type <RequiredSymbol />
                </FormLabel>
                <Combobox<LabelValueOption>
                  items={ENTITY_TYPES}
                  itemToStringValue={(item) => item?.label ?? ""}
                  value={findOptionByValue(ENTITY_TYPES, field.value)}
                  onValueChange={(item) => field.onChange(item?.value ?? "")}
                >
                  <ComboboxInput
                    placeholder="Select Type..."
                    showClear={!!field.value}
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No type found</ComboboxEmpty>
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
            name="taxId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tax ID <RequiredSymbol />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="XX-XXXXXXX"
                    className="font-mono"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="npi2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NPI-2 (Organizational)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="1234567890"
                    maxLength={10}
                    className="font-mono"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Status</FormLabel>
                <Combobox<LabelValueOption>
                  items={STATUS_OPTIONS}
                  itemToStringValue={(item) => item?.label ?? ""}
                  value={findOptionByValue(STATUS_OPTIONS, field.value)}
                  onValueChange={(item) => field.onChange(item?.value ?? "")}
                >
                  <ComboboxInput
                    placeholder="Select status..."
                    showClear={!!field.value}
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No status found</ComboboxEmpty>
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
        </div>
    </div>
  );
}
