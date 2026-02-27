import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";

import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { type UserFormValues } from "../../validations/user-schema";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Tick02Icon, Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Label } from "@/components/ui/label";
import { FormSectionHeader } from "./form-section-header";
import { LocationsAutoComplete } from "../work-locations/locations-auto-complete";
import { RequiredSymbol } from "@/components/shared/required-symbol";
import { useWorkLocations } from "../../hooks/use-work-locations";
import { findOption } from "@/lib/utils";
import { IfElse } from "@/components/shared/if-else";
import { Alert, AlertTitle } from "@/components/ui/alert";

// Default location code for new users
const DEFAULT_LOCATION_CODE = "USA";

type UserLocationFormProps = {
  isEditMode?: boolean;
};

export function UserLocationForm({
  isEditMode = false,
}: Readonly<UserLocationFormProps>) {
  const form = useFormContext<UserFormValues>();
  const workLocation = form.watch("workLocationId");
  const { data: workLocations } = useWorkLocations();
  const locations = useMemo(
    () => workLocations?.data?.items ?? [],
    [workLocations?.data?.items],
  );
  const selectedWorkLocation = findOption(locations, workLocation);

  // Set default USA location for new users when locations are loaded
  useEffect(() => {
    const currentWorkLocationId = form.getValues("workLocationId");

    if (!isEditMode && !currentWorkLocationId && locations.length > 0) {
      const usaLocation = locations.find(
        (loc) => loc.code === DEFAULT_LOCATION_CODE,
      );
      if (usaLocation) {
        form.setValue("workLocationId", usaLocation.id, { shouldDirty: false });
      }
    }
  }, [isEditMode, locations, form]);

  const isOffshore = selectedWorkLocation?.type === "offshore";
  return (
    <div className="p-4 rounded-[12px] bg-blue-500/5 border border-blue-500/20">
      <FormSectionHeader
        title="Location & Compliance"
        icon={MapPin}
        className="text-blue-400"
      />
      <p className="text-xs text-white/40 mb-4">
        Location determines offshore processing restrictions for HIPAA-sensitive
        work.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <FormField
          control={form.control}
          name="workLocationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Work Location
                <RequiredSymbol />
              </FormLabel>
              <FormControl>
                <LocationsAutoComplete
                  value={field.value ?? null}
                  onValueChange={(value) => field.onChange(value?.id ?? "")}
                  placeholder="Select a work location"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Country</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Select a work location to see country"
              value={selectedWorkLocation?.country ?? ""}
              disabled
              readOnly
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <div className="flex items-end">
          <IfElse
            condition={isOffshore}
            elseChildren={
              <Alert
                variant="primary"
                className="flex items-center gap-1 h-12"
              >
                <HugeiconsIcon icon={Tick02Icon} className="size-4 text-emerald-300" />
                <AlertTitle className="text-emerald-300">
                  Onshore Resource
                </AlertTitle>
              </Alert>
            }
          >
            <Alert
              variant="warning"
              className="flex items-center gap-1 h-12"
            >
              <HugeiconsIcon icon={Alert02Icon} className="size-4 text-amber-300" />
              <AlertTitle className="text-amber-300">
                Offshore Resource
              </AlertTitle>
            </Alert>
          </IfElse>
        </div>
      </div>
      <FormField
        control={form.control}
        name="offshoreRestriction"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="p-3 rounded-[12px] bg-white/2 flex items-start gap-3 cursor-pointer border border-white/5">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-0.5"
                  id="offshoreRestriction"
                />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="offshoreRestriction" className="text-sm text-white/80 font-medium">
                    Offshore Restriction
                  </Label>
                  <FormDescription className="text-xs text-white/40">
                    Enable if this user can ONLY work on
                    US-restricted/HIPAA-sensitive cases (typically for onshore
                    users handling restricted payers)
                  </FormDescription>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
