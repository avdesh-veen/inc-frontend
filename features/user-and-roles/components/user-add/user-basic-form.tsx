import { useFormContext } from "react-hook-form";

import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type UserFormValues } from "../../validations/user-schema";
import { Input } from "@/components/ui/input";
import { UserIcon } from "@hugeicons/core-free-icons";
import { FormSectionHeader } from "./form-section-header";
import { RequiredSymbol } from "@/components/shared/required-symbol";
import { findOption } from "@/lib/utils";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";

type UserStatusOption = {
  id: "active" | "inactive" | "on_leave";
  label: string;
};

const USER_STATUS_OPTIONS: UserStatusOption[] = [
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
  { id: "on_leave", label: "On Leave" },
];

type BasicFormProps = {
  isEditMode?: boolean;
};

export function BasicForm({ isEditMode = false }: Readonly<BasicFormProps>) {
  const form = useFormContext<UserFormValues>();
  return (
    <div>
      <FormSectionHeader className="text-violet-400"
        title="Basic Information"
        icon={UserIcon}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                First Name
                <RequiredSymbol />
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter First Name"
                  maxLength={50}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Last Name
                <RequiredSymbol />
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter Last Name"
                  maxLength={50}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email
                <RequiredSymbol />
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email"
                  disabled={isEditMode}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => {
            const selectedOption = findOption(
              USER_STATUS_OPTIONS,
              field.value ?? null,
            );

            return (
              <FormItem>
                <FormLabel>
                  Status
                  <RequiredSymbol />
                </FormLabel>
                <FormControl>
                  <Combobox<UserStatusOption>
                    items={USER_STATUS_OPTIONS}
                    itemToStringLabel={(item: UserStatusOption) =>
                      item?.label ?? ""
                    }
                    itemToStringValue={(item: UserStatusOption) =>
                      item?.id ?? ""
                    }
                    value={selectedOption}
                    onValueChange={(item) =>
                      field.onChange(item?.id ?? null)
                    }
                  >
                    <ComboboxInput
                      placeholder="Select status"
                      showClear={!!field.value}
                    />
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
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
    </div>
  );
}
