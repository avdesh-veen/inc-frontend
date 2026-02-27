/**
 * Status Section
 * 
 * Form section for provider status selection.
 */

'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ProviderFormValues } from '@/features/records/providers/validations/schema';
import { ProviderStatus } from '@/features/records/providers/types';

interface StatusSectionProps {
  form: UseFormReturn<ProviderFormValues>;
}

export function StatusSection({ form }: StatusSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-500/20 text-gray-400">
          ⚙️
        </div>
        <h3 className="text-sm font-medium uppercase tracking-wide text-foreground">
          Status
        </h3>
      </div>

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Provider Status *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={ProviderStatus.ACTIVE} />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Active
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={ProviderStatus.PENDING} />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Pending
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
