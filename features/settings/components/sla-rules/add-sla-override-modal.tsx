/**
 * Add SLA Override Modal Component
 *
 * Modal for creating client or payer-specific SLA overrides.
 * Uses React Hook Form + Zod validation with Combobox dropdowns.
 * Controlled via props (open/onOpenChange) like AddSLATargetModal pattern.
 */

"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import {
  MultiSelectCombobox,
  type MultiSelectOption,
} from "@/components/shared/multi-select-combobox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  useCreateSLAOverride,
  useUpdateSLAOverride,
  useSLAClientsDropdown,
  useSLAPayersDropdown,
} from "@/features/settings/hooks/use-sla-rules";
import { useWorkTypes } from "@/features/settings/hooks/use-work-types";
import {
  slaOverrideSchema,
  type SLAOverrideFormValues,
} from "@/features/settings/validations/sla-rules-schemas";
import type {
  SLAOverride,
  ClientDropdownItem,
  PayerDropdownItem,
} from "@/features/settings/types/sla-rules";
import type { WorkType } from "@/features/settings/types/work-types";
import { findOption } from "@/lib/utils";

interface AddSLAOverrideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  override?: SLAOverride | null;
}

const DEFAULT_VALUES: SLAOverrideFormValues = {
  workTypeId: "",
  clientIds: [],
  payerIds: [],
  overrideTargetDays: 45,
  overrideWarningDays: 30,
  overrideCriticalDays: 40,
  reason: "",
};

export function AddSLAOverrideModal({
  open,
  onOpenChange,
  override,
}: Readonly<AddSLAOverrideModalProps>) {
  const { mutateAsync: createSLAOverride, isPending: isCreating } =
    useCreateSLAOverride();
  const { mutateAsync: updateSLAOverride, isPending: isUpdating } =
    useUpdateSLAOverride();
  const { data: clientsResponse, isLoading: clientsLoading } =
    useSLAClientsDropdown();
  const { data: payersResponse, isLoading: payersLoading } =
    useSLAPayersDropdown();
  const { data: workTypesResponse, isLoading: workTypesLoading } = useWorkTypes(
    { page: 1, limit: 100 },
  );

  const isEditMode = !!override;

  const clients: ClientDropdownItem[] = useMemo(
    () => clientsResponse?.data?.items ?? [],
    [clientsResponse?.data?.items],
  );
  const payers: PayerDropdownItem[] = useMemo(
    () => payersResponse?.data?.items ?? [],
    [payersResponse?.data?.items],
  );
  const workTypes: WorkType[] = workTypesResponse?.data?.items ?? [];

  const form = useForm<SLAOverrideFormValues>({
    resolver: zodResolver(slaOverrideSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (override) {
      form.reset({
        workTypeId: override.workTypeId,
        clientIds: override.clientIds,
        payerIds: override.payerIds,
        overrideTargetDays: override.overrideTargetDays,
        overrideWarningDays: override.overrideWarningDays,
        overrideCriticalDays: override.overrideCriticalDays,
        reason: override.reason,
      });
    } else {
      form.reset(DEFAULT_VALUES);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [override]);

  const handleNumericInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void,
  ) => {
    const v = e.target.value.replace(/\D/g, "");
    if (v === "") {
      onChange(0);
      return;
    }
    const n = parseInt(v, 10);
    if (!Number.isNaN(n)) onChange(n);
  };

  const getChangedFields = (
    data: SLAOverrideFormValues,
  ): Partial<SLAOverrideFormValues> => {
    if (!override) return data;

    const original: SLAOverrideFormValues = {
      workTypeId: override.workTypeId,
      clientIds: override.clientIds,
      payerIds: override.payerIds,
      overrideTargetDays: override.overrideTargetDays,
      overrideWarningDays: override.overrideWarningDays,
      overrideCriticalDays: override.overrideCriticalDays,
      reason: override.reason,
    };

    const changed: Partial<SLAOverrideFormValues> = {};
    const keys = Object.keys(data) as (keyof SLAOverrideFormValues)[];

    for (const key of keys) {
      const newVal = data[key];
      const oldVal = original[key];

      if (Array.isArray(newVal) && Array.isArray(oldVal)) {
        const sortedNew = [...newVal].sort((a, b) =>
          String(a).localeCompare(String(b)),
        );
        const sortedOld = [...oldVal].sort((a, b) =>
          String(a).localeCompare(String(b)),
        );
        if (JSON.stringify(sortedNew) !== JSON.stringify(sortedOld)) {
          (changed as Record<string, unknown>)[key] = newVal;
        }
      } else if (newVal !== oldVal) {
        (changed as Record<string, unknown>)[key] = newVal;
      }
    }

    return changed;
  };

  const onSubmit = (data: SLAOverrideFormValues) => {
    if (isEditMode) {
      const changedData = getChangedFields(data);
      if (Object.keys(changedData).length === 0) {
        handleClose();
        return;
      }
      updateSLAOverride({ id: override.id, data: changedData }).then(() =>
        handleClose(),
      );
    } else {
      createSLAOverride(data).then(() => handleClose());
    }
  };

  const handleClose = () => {
    form.reset(DEFAULT_VALUES);
    onOpenChange(false);
  };

  const isPending = isEditMode ? isUpdating : isCreating;

  const getSubmitLabel = () => {
    if (isPending && isEditMode) return "Updating...";
    if (isPending) return "Creating...";
    if (isEditMode) return "Update Override";
    return "Add Override";
  };

  const selectedWorkTypeId = form.watch("workTypeId");
  const selectedWorkType = findOption(workTypes, selectedWorkTypeId || null);

  const clientOptions: MultiSelectOption[] = useMemo(
    () => clients.map((c) => ({ value: c.id, label: c.organizationName })),
    [clients],
  );

  const payerOptions: MultiSelectOption[] = useMemo(
    () => payers.map((p) => ({ value: p.id, label: p.name })),
    [payers],
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[550px] bg-[#1e293b] border border-white/10 shadow-2xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="pb-4">
          <div>
            <DialogTitle className="text-xl font-bold text-white">
              {isEditMode ? "Edit SLA Override" : "Add SLA Override"}
            </DialogTitle>
            <p className="text-sm text-white/50 mt-1">
              Configure client or payer-specific SLA targets
            </p>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Client and Payer Selection */}
            <div className="grid grid-cols-2 gap-4">
              {/* Client */}
              <FormField
                control={form.control}
                name="clientIds"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-white/50">
                      Client (optional)
                    </FormLabel>
                    <FormControl>
                      <MultiSelectCombobox
                        options={clientOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={
                          clientsLoading
                            ? "Loading clients..."
                            : "Select clients..."
                        }
                        emptyMessage={
                          clientsLoading
                            ? "Loading clients..."
                            : "No clients found"
                        }
                        disabled={clientsLoading}
                        error={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payer */}
              <FormField
                control={form.control}
                name="payerIds"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-white/50">
                      Payer (optional)
                    </FormLabel>
                    <FormControl>
                      <MultiSelectCombobox
                        options={payerOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={
                          payersLoading
                            ? "Loading payers..."
                            : "Select payers..."
                        }
                        emptyMessage={
                          payersLoading
                            ? "Loading payers..."
                            : "No payers found"
                        }
                        disabled={payersLoading}
                        error={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Info Banner */}
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs text-blue-300">
                Select at least one Client or Payer. You can select multiple in
                each. The more specific the scope, the higher the priority when
                applying overrides.
              </p>
            </div>

            {/* Request Type (Work Type) */}
            <FormField
              control={form.control}
              name="workTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-white/50">
                    Request Type <span className="text-rose-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox<WorkType>
                      items={workTypes}
                      itemToStringLabel={(item: WorkType) => item?.name ?? ""}
                      itemToStringValue={(item: WorkType) => item?.id ?? ""}
                      value={selectedWorkType}
                      onValueChange={(item) => field.onChange(item?.id ?? "")}
                      disabled={workTypesLoading}
                    >
                      <ComboboxInput
                        placeholder={
                          workTypesLoading
                            ? "Loading request types..."
                            : "Select a request type..."
                        }
                        showClear={!!field.value}
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>
                          {workTypesLoading
                            ? "Loading request types..."
                            : "No request types found"}
                        </ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.id} value={item}>
                              <span className="font-medium">{item.name}</span>
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thresholds */}
            <div className="grid grid-cols-3 gap-4">
              {/* Override Target */}
              <FormField
                control={form.control}
                name="overrideTargetDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-white/50">
                      Override Target <span className="text-rose-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        value={field.value === 0 ? "" : String(field.value)}
                        onChange={(e) =>
                          handleNumericInputChange(e, field.onChange)
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-center font-bold text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Warning at */}
              <FormField
                control={form.control}
                name="overrideWarningDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-amber-400">
                      Warning at <span className="text-rose-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        value={field.value === 0 ? "" : String(field.value)}
                        onChange={(e) =>
                          handleNumericInputChange(e, field.onChange)
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-amber-500/30 text-amber-400 text-center font-bold text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Critical at */}
              <FormField
                control={form.control}
                name="overrideCriticalDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-rose-400">
                      Critical at <span className="text-rose-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        value={field.value === 0 ? "" : String(field.value)}
                        onChange={(e) =>
                          handleNumericInputChange(e, field.onChange)
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-rose-500/30 text-rose-400 text-center font-bold text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Reason for Override */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-white/50">
                    Reason for Override <span className="text-rose-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={2}
                      placeholder="e.g., Enterprise SLA commitment per contract"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm resize-none placeholder:text-white/30"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                onClick={handleClose}
                variant="ghost"
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-sm font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="submit"
                size="xl"
                disabled={isPending}
              >
                {getSubmitLabel()}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
