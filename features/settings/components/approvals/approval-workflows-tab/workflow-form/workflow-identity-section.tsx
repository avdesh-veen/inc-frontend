"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApprovalWorkflowFormSchema } from "@/features/settings/validations/approvals/approval-workflow";
import { TriggerEventsAutoComplete } from "../../../trigger-events/components/trigger-events-autocomplete";

interface WorkflowIdentitySectionProps {
  form: UseFormReturn<ApprovalWorkflowFormSchema>;
}

export function WorkflowIdentitySection({
  form,
}: Readonly<WorkflowIdentitySectionProps>) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            1
          </div>
          <h3 className="text-md font-semibold">Workflow Identity</h3>
        </div>
      </div>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Workflow Name <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="e.g., Medicare Submission Approval"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="triggerEventId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Trigger Event <span className="text-destructive">*</span>
            </FormLabel>
            <TriggerEventsAutoComplete
              value={field.value}
              onValueChange={(event) => field.onChange(event?.id ?? "")}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="conditions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Conditions (optional)</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="e.g., payer.type IN [medicare, medicaid]"
                rows={4}
                className="font-mono text-sm"
              />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">
              Use dot notation for conditions
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
