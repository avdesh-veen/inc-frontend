"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tick02Icon,
  FlashIcon,
  Tap01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import {
  triggerEventFormSchema,
  type TriggerEventFormData,
} from "@/features/settings/validations/trigger-events-schemas";
import {
  useCreateTriggerEvent,
  useUpdateTriggerEvent,
  useTriggerEventDetail,
} from "@/features/settings/hooks/use-trigger-events";
import { useWorkCategories } from "@/features/settings/hooks/use-work-categories";
import { MultiSelectCombobox } from "@/components/shared/multi-select-combobox";
import type { MultiSelectOption } from "@/components/shared/multi-select-combobox";

interface AddTriggerEventFormContentProps {
  editingEventId?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const defaultValues: TriggerEventFormData = {
  code: "",
  name: "",
  description: "",
  type: "manual",
  firedBy: "",
  isActive: true,
  daysBeforeExpiry: undefined,
  workCategoryIds: [],
};

/**
 * Loading skeleton for edit mode
 * Mirrors the 3-column form layout while data is being fetched
 */
function FormLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column - Basic Info Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="size-6 rounded-lg" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>

        {/* Middle Column - Classification Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="size-6 rounded-lg" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Right Column - Configuration Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="size-6 rounded-lg" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="rounded-lg border border-border p-3">
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="mt-1 h-3 w-3/4" />
          </div>
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-10 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  );
}

export function AddTriggerEventFormContent({
  editingEventId,
  onSuccess,
  onCancel,
}: Readonly<AddTriggerEventFormContentProps>) {
  const isNew = !editingEventId;

  // Fetch event details when editing
  const { data: eventData, isLoading: isLoadingEvent } = useTriggerEventDetail(
    editingEventId ?? "",
  );

  // Fetch work categories
  const { data: workCategoriesResponse, isLoading: isLoadingCategories } =
    useWorkCategories({limit: 100, page: 1});

  // Transform work categories to combobox options - memoize the full transformation
  const workCategoryOptions: MultiSelectOption[] = React.useMemo(() => {
    const items = workCategoriesResponse?.data?.items ?? [];
    return items.map((cat) => ({
      value: cat.id,
      label: cat.name,
      description: cat.description,
    }));
  }, [workCategoriesResponse?.data?.items]);

  // Mutation hooks
  const createMutation = useCreateTriggerEvent();
  const updateMutation = useUpdateTriggerEvent();

  const form = useForm<TriggerEventFormData>({
    resolver: zodResolver(triggerEventFormSchema),
    defaultValues,
  });

  // Reset form when event data changes
  React.useEffect(() => {
    if (isNew) {
      form.reset(defaultValues);
    } else if (eventData?.data) {
      // Map API response to form data
      const event = eventData.data;
      form.reset({
        code: event.code,
        name: event.name,
        description: event.description,
        type: event.type,
        firedBy: event.firedBy,
        isActive: event.isActive,
        daysBeforeExpiry:
          event.type === "scheduled" ? event.daysBeforeExpiry : undefined,
        workCategoryIds: event.workCategoryIds ?? [],
      });
    }
  }, [isNew, eventData?.data, form]);

  // eslint-disable-next-line react-hooks/incompatible-library -- React Hook Form watch() for conditional fields
  const watchedType = form.watch("type");

  React.useEffect(() => {
    if (watchedType !== "scheduled") {
      form.setValue("daysBeforeExpiry", undefined);
    }
  }, [watchedType, form]);

  const handleSubmit = (data: TriggerEventFormData) => {
    const submitData = {
      ...data,
      daysBeforeExpiry:
        data.type === "scheduled" ? data.daysBeforeExpiry : undefined,
    };

    if (isNew) {
      createMutation.mutate(submitData, {
        onSuccess: () => {
          onSuccess();
          form.reset(defaultValues);
        },
      });
    } else if (editingEventId) {
      updateMutation.mutate(
        { id: editingEventId, data: submitData },
        {
          onSuccess: () => {
            onSuccess();
            form.reset(defaultValues);
          },
        },
      );
    }
  };

  const handleCancel = () => {
    onCancel();
    form.reset(defaultValues);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Show loading skeleton in edit mode while fetching data
  if (isLoadingEvent && !isNew) {
    return <FormLoadingSkeleton />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-bold text-white/70">
              <span className="size-6 rounded-md bg-violet-500/20 flex items-center justify-center text-violet-300 text-xs">
                1
              </span>
              Basic Information
            </h4>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name *</FormLabel>
                  <FormControl>
                    <Input
                      size="sm"
                      placeholder="e.g., Provider Called Back"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Code *</FormLabel>
                  <FormControl>
                    <Input
                      size="sm"
                      placeholder="e.g., provider_called_back"
                      className="font-mono"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "_") // Replace spaces with underscores
                          .replace(/[^a-z_]/g, ""); // Remove anything that's not a letter or underscore
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Lowercase, underscores only. Used in system references.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      size="sm"
                      placeholder="What triggers this event..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-bold text-white/70">
              <span className="size-6 rounded-md bg-blue-500/20 flex items-center justify-center text-blue-300 text-xs">
                2
              </span>
              Classification
            </h4>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type *</FormLabel>
                  <Select
                    size="sm"
                    key={`type-${editingEventId ?? "new"}-${field.value}`}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="manual">
                        <div className="flex items-center gap-2">
                          <HugeiconsIcon
                            icon={Tap01Icon}
                            className="size-4"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                          Manual - Fired by analyst action
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <HugeiconsIcon
                            icon={FlashIcon}
                            className="size-4"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                          System - Auto-fired by platform
                        </div>
                      </SelectItem>
                      <SelectItem value="scheduled">
                        <div className="flex items-center gap-2">
                          <HugeiconsIcon
                            icon={Clock01Icon}
                            className="size-4"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                          Scheduled - Time-based trigger
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workCategoryIds"
              render={({ field, fieldState }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Work Categories *</FormLabel>
                  <FormControl>
                    <MultiSelectCombobox
                      size="sm"
                      options={workCategoryOptions}
                      value={field.value ?? []}
                      onChange={field.onChange}
                      placeholder={
                        isLoadingCategories
                          ? "Loading categories..."
                          : "Select work categories..."
                      }
                      emptyMessage="No work categories found"
                      disabled={isLoadingCategories}
                      error={!!fieldState.error}
                    />
                  </FormControl>
                  <FormDescription>
                    Select one or more work categories for this trigger event
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fired By</FormLabel>
                  <FormControl>
                    <Input
                      size="sm"
                      placeholder="e.g., Log Contact button"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What action or process fires this event
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-bold text-white/70">
              <span className="size-6 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-300 text-xs">
                3
              </span>
              Configuration
            </h4>

            {watchedType === "scheduled" && (
              <FormField
                control={form.control}
                name="daysBeforeExpiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days Before Expiry</FormLabel>
                    <FormControl>
                      <Input
                        size="sm"
                        type="number"
                        min={1}
                        max={365}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      For expiration-based events, how many days before
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Manual event helper */}
            {watchedType === "manual" && (
              <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                <div className="text-xs text-amber-300 font-medium">
                  Manual Event
                </div>
                <div className="text-[10px] text-white/60 mt-1">
                  This event will add a button in the activity log area that
                  analysts can click to fire the event.
                </div>
              </div>
            )}

            {/* System event helper */}
            {watchedType === "system" && (
              <div className="rounded-lg border border-chart-1/20 bg-chart-1/10 p-3">
                <p className="text-xs font-medium text-white">System Event</p>
                <p className="text-[10px] text-white/60 mt-1">
                  This event will be automatically fired when the specified
                  platform action occurs. No manual intervention needed.
                </p>
              </div>
            )}

            {/* Status */}
            <div className="border-t border-white/10 pt-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="text-sm mb-0 text-white">
                      Event Active
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="pt-6">
          <Button
            type="button"
            variant="muted"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="tertiaryMuted"
            className="gap-1.5"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                {isNew ? "Creating..." : "Updating..."}
              </>
            ) : (
              <>
                <HugeiconsIcon
                  icon={Tick02Icon}
                  className="size-4"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                {isNew ? "Create Event" : "Update Event"}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
