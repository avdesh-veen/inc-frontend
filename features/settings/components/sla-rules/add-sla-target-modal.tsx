"use client";

import * as React from "react";
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import {
  useCreateSLATarget,
  useUpdateSLATarget,
} from "@/features/settings/hooks/use-sla-rules";
import {
  slaTargetSchema,
  type SLATargetFormValues,
} from "@/features/settings/validations/sla-rules-schemas";
import type { SLATarget, SLATargetFormData } from "@/features/settings/types/sla-rules";
import type {
  WorkCategory,
  CategoryWorkType,
} from "@/features/settings/types/work-category";
import {
  useWorkCategories,
  findWorkCategory,
} from "@/features/settings/hooks/use-work-categories";
import { findOption } from "@/lib/utils";
import { WorkCategoryAutoComplete } from "./work-category-auto-complete";

interface AddSLATargetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target?: SLATarget | null;
}

const DEFAULT_VALUES: SLATargetFormValues = {
  workTypeCategoryId: "",
  workTypeId: "",
  targetDays: 30,
  warningDays: 22,
  criticalDays: 28,
  useBusiness: true,
  pauseSlaWhenHold: true,
};

export function AddSLATargetModal({
  open,
  onOpenChange,
  target,
}: Readonly<AddSLATargetModalProps>) {
  const { mutateAsync: createSLATarget, isPending: isCreating } =
    useCreateSLATarget();
  const { mutateAsync: updateSLATarget, isPending: isUpdating } =
    useUpdateSLATarget();
  const [selectedCategory, setSelectedCategory] =
    React.useState<WorkCategory | null>(null);

  const isEditMode = !!target;

  const { data: categoriesResponse } = useWorkCategories({
    page: 1,
    limit: 100,
  });
  const categories: WorkCategory[] = React.useMemo(
    () => categoriesResponse?.data?.items ?? [],
    [categoriesResponse?.data?.items],
  );

  const form = useForm<SLATargetFormValues>({
    resolver: zodResolver(slaTargetSchema),
    defaultValues: DEFAULT_VALUES,
  });

  React.useEffect(() => {
    if (target) {
      form.reset({
        workTypeCategoryId: target.workTypeCategoryId,
        workTypeId: target.workTypeId ?? "",
        targetDays: target.targetDays,
        warningDays: target.warningDays,
        criticalDays: target.criticalDays,
        useBusiness: target.useBusiness,
        pauseSlaWhenHold: target.pauseSlaWhenHold,
      });
    } else {
      form.reset(DEFAULT_VALUES);
      setSelectedCategory(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  React.useEffect(() => {
    if (target && categories.length > 0 && !selectedCategory) {
      const matched = findWorkCategory(categories, target.workTypeCategoryId);
      if (matched) setSelectedCategory(matched);
    }
  }, [target, categories, selectedCategory]);

  const editWorkTypeOptions: CategoryWorkType[] = React.useMemo(() => {
    const wt = selectedCategory?.workTypes ?? [];
    if (wt.length > 0) return wt;
    if (target?.workType) return [target.workType];
    return [];
  }, [selectedCategory?.workTypes, target]);

  const handleNumericInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void
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
    data: SLATargetFormValues,
  ): Partial<SLATargetFormValues> => {
    if (!target) return data;

    const original: SLATargetFormValues = {
      workTypeCategoryId: target.workTypeCategoryId,
      workTypeId: target.workTypeId ?? "",
      targetDays: target.targetDays,
      warningDays: target.warningDays,
      criticalDays: target.criticalDays,
      useBusiness: target.useBusiness,
      pauseSlaWhenHold: target.pauseSlaWhenHold,
    };

    const changed: Partial<SLATargetFormValues> = {};
    for (const key of Object.keys(data) as (keyof SLATargetFormValues)[]) {
      if (data[key] !== original[key]) {
        (changed as Record<string, unknown>)[key] = data[key];
      }
    }
    return changed;
  };

  const normalizeWorkTypeId = (value: string) =>
    value === "" ? null : value;

  const onSubmit = (data: SLATargetFormValues) => {
    if (isEditMode) {
      const changedData = getChangedFields(data);
      if (Object.keys(changedData).length === 0) {
        handleClose();
        return;
      }
      const payload = {
        ...changedData,
        ...("workTypeId" in changedData && {
          workTypeId: normalizeWorkTypeId(changedData.workTypeId ?? ""),
        }),
      } as Partial<SLATarget>;
      updateSLATarget({ id: target.id, data: payload }).then(() =>
        handleClose(),
      );
    } else {
      const payload: SLATargetFormData = {
        ...data,
        workTypeId: normalizeWorkTypeId(data.workTypeId),
      };
      createSLATarget(payload).then(() => handleClose());
    }
  };

  const handleClose = () => {
    form.reset(DEFAULT_VALUES);
    setSelectedCategory(null);
    onOpenChange(false);
  };

  const isPending = isEditMode ? isUpdating : isCreating;

  const getSubmitLabel = () => {
    if (isPending && isEditMode) return "Updating...";
    if (isPending) return "Creating...";
    if (isEditMode) return "Update Target";
    return "Create Target";
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[500px] bg-[#1e293b] border border-white/10 shadow-2xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-white">
            {isEditMode ? "Edit SLA Target" : "Add SLA Target"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Work Category */}
            <FormField
              control={form.control}
              name="workTypeCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-white/50">
                    Work Category <span className="text-rose-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <WorkCategoryAutoComplete
                      value={field.value}
                      onValueChange={(category) => {
                        field.onChange(category?.id ?? "");
                        setSelectedCategory(category);
                        form.setValue("workTypeId", "");
                      }}
                      placeholder="Select a work category..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Work Type */}
            <FormField
              control={form.control}
              name="workTypeId"
              render={({ field }) => {
                const selectedWorkType = findOption(
                  editWorkTypeOptions,
                  field.value === "" ? null : (field.value ?? null),
                );
                return (
                  <FormItem>
                    <FormLabel className="text-xs text-white/50">
                      Request Type
                    </FormLabel>
                    <FormControl>
                      <Combobox<CategoryWorkType>
                        items={editWorkTypeOptions}
                        itemToStringLabel={(item: CategoryWorkType) =>
                          item?.name ?? ""
                        }
                        itemToStringValue={(item: CategoryWorkType) =>
                          item?.id ?? ""
                        }
                        value={selectedWorkType}
                        onValueChange={(item) => field.onChange(item?.id ?? "")}
                        disabled={editWorkTypeOptions.length === 0}
                      >
                        <ComboboxInput
                          placeholder={
                            editWorkTypeOptions.length === 0
                              ? "Select a work category first..."
                              : "Select a work type..."
                          }
                          showClear={!!field.value}
                        />
                        <ComboboxContent>
                          <ComboboxEmpty>No work types found</ComboboxEmpty>
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
                );
              }}
            />

            {/* Thresholds */}
            <div className="grid grid-cols-3 gap-4">
              {/* Target Days */}
              <FormField
                control={form.control}
                name="targetDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-white/50">
                      Target Days <span className="text-rose-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        value={field.value === 0 ? "" : String(field.value)}
                        onChange={(e) => handleNumericInputChange(e, field.onChange)}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-emerald-400 text-center font-bold text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Warning at */}
              <FormField
                control={form.control}
                name="warningDays"
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
                        onChange={(e) => handleNumericInputChange(e, field.onChange)}
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
                name="criticalDays"
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
                        onChange={(e) => handleNumericInputChange(e, field.onChange)}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-rose-500/30 text-rose-400 text-center font-bold text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Options */}
            <div className="p-4 rounded-xl bg-white/2 space-y-3">
              <FormField
                control={form.control}
                name="useBusiness"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-white font-normal">
                      Use business days only
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pauseSlaWhenHold"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-white font-normal">
                      Pause SLA clock when on hold
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

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
