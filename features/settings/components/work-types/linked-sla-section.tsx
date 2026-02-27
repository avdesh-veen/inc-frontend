/**
 * LinkedSLASection Component
 * 
 * Section for linking SLA rules to the work type.
 */

'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useSLATargets } from '../../hooks/use-sla-rules';
import type { UseFormReturn } from 'react-hook-form';
import type { WorkTypeFormData } from '../../validations/work-types-schemas';

interface LinkedSLASectionProps {
  form: UseFormReturn<WorkTypeFormData>;
}

export function LinkedSLASection({ form }: Readonly<LinkedSLASectionProps>) {
  const { data: slaTargetsData, isLoading } = useSLATargets({ limit: 100, page: 1 });
  
  const slaRules = slaTargetsData?.data?.items || [];

  return (
    <div className="rounded-xl bg-glass-bg backdrop-blur-[var(--glass-blur)] border border-glass-border p-6">
      <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Linked SLA Rule
      </h3>
      <p className="text-sm text-text-70 mb-4">
        Optionally link an SLA rule to this work type for tracking.
      </p>
      
      <FormField
        control={form.control}
        name="slaRuleId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SLA Rule</FormLabel>
            <Select 
              onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
              value={field.value ?? 'none'}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isLoading ? "Loading SLA rules..." : "— None —"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">— None —</SelectItem>
                {slaRules.map((slaRule) => (
                  <SelectItem key={slaRule.id} value={slaRule.id}>
                    {slaRule.workType?.name} - {slaRule.targetDays} days
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
