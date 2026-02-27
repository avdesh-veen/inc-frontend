"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ApprovalWorkflowFormSchema } from "@/features/settings/validations/approvals/approval-workflow";

interface WorkflowSLASectionProps {
  form: UseFormReturn<ApprovalWorkflowFormSchema>;
}

const SLA_OPTIONS = [
  { value: "2", label: "2 hours" },
  { value: "4", label: "4 hours" },
  { value: "8", label: "8 hours" },
  { value: "24", label: "24 hours" },
  { value: "48", label: "48 hours" },
  { value: "72", label: "72 hours" },
];

const ESCALATION_OPTIONS = [
  { value: "none", label: "No escalation" },
  { value: "manager", label: "Manager" },
  { value: "director", label: "Director" },
  { value: "vp", label: "VP" },
  { value: "cxo", label: "CXO" },
];

export function WorkflowSLASection({ form }: Readonly<WorkflowSLASectionProps>) {
  const slaHours = form.watch("slaHours");
  const escalationTarget = form.watch("escalationTarget");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            3
          </div>
          <h3 className="text-md font-semibold">SLA & Escalation</h3>
        </div>
      </div>

      <FormField
        control={form.control}
        name="slaHours"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Response SLA (hours) <span className="text-destructive">*</span>
            </FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              value={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select SLA" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SLA_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="escalationTarget"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Escalate To (on timeout)</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select escalation target" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {ESCALATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {!!slaHours && !!escalationTarget && escalationTarget !== "none" && (
        <Alert variant="warning" className="border-amber-500/30">
          <AlertDescription className="text-amber-400/90">
            If approver doesn&apos;t respond within SLA, the request escalates
            automatically.
          </AlertDescription>
        </Alert>
      )}

      <div className="pt-4 border-t border-white/10">
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Status</FormLabel>
                <div className="text-xs text-muted-foreground font-medium">
                  Workflow Active
                </div>
              </div>
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
  );
}
