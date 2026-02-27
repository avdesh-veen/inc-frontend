/**
 * TimeComplexitySection Component
 * 
 * Displays the time and complexity fields for work type form
 * including duration, complexity level, status, and checkboxes.
 */

'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { WorkTypeFormData } from '../../validations/work-types-schemas';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  COMPLEXITY_LEVELS,
  STATUS_OPTIONS,
} from '../../types/work-types';

interface TimeComplexitySectionProps {
  form: UseFormReturn<WorkTypeFormData>;
}

export function TimeComplexitySection({ form }: Readonly<TimeComplexitySectionProps>) {
  return (
    <div className="rounded-xl bg-glass-bg backdrop-blur-[var(--glass-blur)] border border-glass-border p-6">
      <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Time & Complexity
      </h3>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <FormField
            control={form.control}
            name="expectedDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Expected Duration (min) <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Calculated from stages"
                    min="1"
                    {...field}
                    disabled
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="bg-muted cursor-not-allowed"
                  />
                </FormControl>
                <p className="text-xs text-text-50 mt-1">
                  Auto-calculated as sum of active times in workflow stages
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="complexityLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Complexity Level <span className="text-destructive">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select complexity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COMPLEXITY_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Status <span className="text-destructive">*</span>
                </FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(value === 'Active')} 
                  defaultValue={field.value ? 'Active' : 'Inactive'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
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
        </div>
      </div>
      <div className="mt-4 flex items-center gap-6">
        <FormField
          control={form.control}
          name="providerSignature"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  id="requiresProviderSignature"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel htmlFor="requiresProviderSignature" className="text-sm text-text-70 cursor-pointer">
                Requires Provider Signature
              </FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="psvRequired"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  id="requiresPSV"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel htmlFor="requiresPSV" className="text-sm text-text-70 cursor-pointer">
                Requires PSV
              </FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
