"use client";

import { useFormContext } from "react-hook-form";
import { format, parse } from "date-fns";

import {
  FormField,
  FormControl,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { type UserFormValues } from "../../validations/user-schema";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { FormSectionHeader } from "./form-section-header";
import { DatePicker } from "@/components/ui/date-picker";
import { BgCheckStatusAutoComplete } from "./bg-check-status-auto-complete";

const DATE_ONLY_FORMAT = "yyyy-MM-dd";

/** Parse API date string to local Date for the calendar (avoids timezone shift). */
function parseDateOnly(value: string | undefined): Date | undefined {
  if (!value?.trim()) return undefined;
  try {
    if (value.includes("T")) {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return undefined;
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    return parse(value, DATE_ONLY_FORMAT, new Date());
  } catch {
    return undefined;
  }
}

/** Format selected calendar date as date-only string for API (local date, no timezone shift). */
function formatDateOnly(date: Date | undefined): string | undefined {
  if (!date) return undefined;
  return format(date, DATE_ONLY_FORMAT);
}

export function UserComplianceForm() {
  const form = useFormContext<UserFormValues>();
  return (
    <div className="p-4 rounded-[12px] bg-rose-500/5 border border-rose-500/20">
      <FormSectionHeader
        title="Compliance & Training"
        icon={CheckmarkCircle02Icon}
        className="text-rose-400"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <FormField
          control={form.control}
          name="bgCheckDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background Check Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={parseDateOnly(field.value)}
                  onChange={(date) => field.onChange(formatDateOnly(date))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bgCheckStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>BG Check Status</FormLabel>
              <FormControl>
                <BgCheckStatusAutoComplete
                  value={field.value}
                  onValueChange={(option) => field.onChange(option?.id ?? "")}
                  placeholder="Select BG check status"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hipaaTrainingDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HIPAA Training Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={parseDateOnly(field.value)}
                  onChange={(date) => field.onChange(formatDateOnly(date))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hipaaTrainingExpiry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HIPAA Training Expiry</FormLabel>
              <FormControl>
                <DatePicker
                  value={parseDateOnly(field.value)}
                  onChange={(date) => field.onChange(formatDateOnly(date))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="securityAwarenessDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Security Awareness Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={parseDateOnly(field.value)}
                  onChange={(date) => field.onChange(formatDateOnly(date))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ndaSignDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NDA Signed Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={parseDateOnly(field.value)}
                  onChange={(date) => field.onChange(formatDateOnly(date))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastComplianceReviewDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Compliance Review</FormLabel>
              <FormControl>
                <DatePicker
                  value={parseDateOnly(field.value)}
                  onChange={(date) => field.onChange(formatDateOnly(date))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
