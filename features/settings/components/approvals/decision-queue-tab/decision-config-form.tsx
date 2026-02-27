"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import {
  decisionQueueFormSchema,
  DecisionQueueFormSchema,
} from "@/features/settings/validations/approvals/decision-queue";
import {
  useDecisionQueue,
  useUpdateDecisionQueue,
} from "@/features/settings/hooks/use-decision-queue";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Save } from "@hugeicons/core-free-icons";
import { Skeleton } from "@/components/ui/skeleton";
import type { DecisionQueue } from "@/features/settings/types/approvals/decision-queue";

function toFormValues(data: DecisionQueue): DecisionQueueFormSchema {
  return {
    enableDecisionQueue: data.enableDecisionQueue,
    businessHoursStart: data.businessHoursStart,
    businessHoursEnd: data.businessHoursEnd,
    autoEscalateAfterSlaBreachHours: data.autoEscalateAfterSlaBreachHours,
    maxReturnsBeforeEscalation: data.maxReturnsBeforeEscalation,
  };
}

/**
 * Form for configuring decision queue: enable/disable, business hours, and escalation rules.
 * Renders only when query data is available so defaultValues bind correctly on first load (incl. hydrated cache).
 */
export function DecisionConfigForm() {
  const { data: decisionQueue, isPending } = useDecisionQueue();
  const { mutate: updateDecisionQueue, isPending: isUpdatingDecisionQueue } =
    useUpdateDecisionQueue();

  if (isPending || !decisionQueue?.data) {
    return <DecisionConfigFormSkeleton />;
  }

  return (
    <DecisionConfigFormContent
      key={decisionQueue.data.id}
      initialData={decisionQueue.data}
      onUpdate={updateDecisionQueue}
      isUpdating={isUpdatingDecisionQueue}
    />
  );
}

type DecisionConfigFormContentProps = {
  initialData: DecisionQueue;
  onUpdate: (
    payload: DecisionQueueFormSchema & { id: string },
    options?: { onSuccess?: () => void },
  ) => void;
  isUpdating: boolean;
};

function DecisionConfigFormContent({
  initialData,
  onUpdate,
  isUpdating,
}: DecisionConfigFormContentProps) {
  const { startHours, endHours, autoEscalateAfterHours, maxReturns } =
    getHourOptions();
  const form = useForm<DecisionQueueFormSchema>({
    resolver: zodResolver(decisionQueueFormSchema),
    defaultValues: toFormValues(initialData),
  });

  const onSubmit = (data: DecisionQueueFormSchema) => {
    onUpdate({ id: initialData.id, ...data }, {
      onSuccess: () => form.reset(data),
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full flex flex-col"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
          <FormField
            control={form.control}
            name="enableDecisionQueue"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <EnableQueue
                  enabled={field.value}
                  onToggle={(checked) => {
                    field.onChange(checked);
                  }}
                  disabled={field.disabled}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessHoursStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Start Hours</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select start hours" />
                    </SelectTrigger>
                    <SelectContent>
                      {startHours.map((hour) => (
                        <SelectItem key={hour.value} value={hour.value}>
                          {hour.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessHoursEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business End Hours</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select end hours" />
                    </SelectTrigger>
                    <SelectContent>
                      {endHours.map((hour) => (
                        <SelectItem key={hour.value} value={hour.value}>
                          {hour.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Alert className="col-span-full" variant={"warning"}>
            <AlertTitle>Escalation Rules</AlertTitle>
            <AlertDescription className="flex flex-wrap gap-2">
              <FormField
                control={form.control}
                name="autoEscalateAfterSlaBreachHours"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Auto Escalate After Hours</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(v) => field.onChange(+v)}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select auto escalate after hours" />
                        </SelectTrigger>
                        <SelectContent>
                          {autoEscalateAfterHours.map((hour) => (
                            <SelectItem
                              key={hour.value}
                              value={hour.value?.toString()}
                            >
                              {hour.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxReturnsBeforeEscalation"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Max Returns</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(v) => field.onChange(+v)}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select max returns" />
                        </SelectTrigger>
                        <SelectContent>
                          {maxReturns.map(({ label, value }) => (
                            <SelectItem key={value} value={value.toString()}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AlertDescription>
          </Alert>
        </div>
        

        <div className="flex justify-end mt-auto">
          <Button type="submit" className="self-end" disabled={isUpdating || !form.formState.isDirty}>
            <HugeiconsIcon icon={Save} className="size-4" />
            <span className="text-sm font-medium">
              {isUpdating ? "Updating..." : "Update"}
            </span>
          </Button>
        </div>
      </form>
    </Form>
  );
}

function DecisionConfigFormSkeleton() {
  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
        <div className="col-span-full flex items-center justify-between gap-4">
          <div className="space-y-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-6 w-10 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="col-span-full space-y-2">
          <Skeleton className="h-4 w-40" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-9 w-44" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-auto pt-4">
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}

/** Props for the EnableQueue toggle component. */
type EnableQueueProps = {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
};

/** Toggle field for enabling or disabling the decision queue. */
function EnableQueue({ enabled, onToggle, disabled }: EnableQueueProps) {
  return (
    <FieldLabel htmlFor="enable-decision-queue">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle className="text-primary-foreground">
            Enable Decision Queue
          </FieldTitle>
          <FieldDescription>
            Require approval for external submissions
          </FieldDescription>
        </FieldContent>
        <Switch
          id="enable-decision-queue"
          checked={enabled}
          onCheckedChange={onToggle}
          disabled={disabled}
        />
      </Field>
    </FieldLabel>
  );
}

/** Returns option arrays for business hours, auto-escalate hours, and max returns selects. */
function getHourOptions() {
  const hours = [
    { label: "12:00 AM", value: "00:00:00" },
    { label: "1:00 AM", value: "01:00:00" },
    { label: "2:00 AM", value: "02:00:00" },
    { label: "3:00 AM", value: "03:00:00" },
    { label: "4:00 AM", value: "04:00:00" },
    { label: "5:00 AM", value: "05:00:00" },
    { label: "6:00 AM", value: "06:00:00" },
    { label: "7:00 AM", value: "07:00:00" },
    { label: "8:00 AM", value: "08:00:00" },
    { label: "9:00 AM", value: "09:00:00" },
    { label: "10:00 AM", value: "10:00:00" },
    { label: "11:00 AM", value: "11:00:00" },
    { label: "12:00 PM", value: "12:00:00" },
    { label: "1:00 PM", value: "13:00:00" },
    { label: "2:00 PM", value: "14:00:00" },
    { label: "3:00 PM", value: "15:00:00" },
    { label: "4:00 PM", value: "16:00:00" },
    { label: "5:00 PM", value: "17:00:00" },
    { label: "6:00 PM", value: "18:00:00" },
    { label: "7:00 PM", value: "19:00:00" },
    { label: "8:00 PM", value: "20:00:00" },
    { label: "9:00 PM", value: "21:00:00" },
    { label: "10:00 PM", value: "22:00:00" },
    { label: "11:00 PM", value: "23:00:00" },
  ];

  const autoEscalateAfterHours = [
    { label: "1 Hour", value: 1 },
    { label: "2 Hours", value: 2 },
    { label: "3 Hours", value: 3 },
    { label: "4 Hours", value: 4 },
    { label: "5 Hours", value: 5 },
  ];

  const maxReturns = [
    { label: "1 Return", value: 1 },
    { label: "2 Returns", value: 2 },
    { label: "3 Returns", value: 3 },
    { label: "4 Returns", value: 4 },
    { label: "5 Returns", value: 5 },
  ];

  return {
    startHours: hours,
    endHours: hours,
    autoEscalateAfterHours,
    maxReturns,
  };
}
