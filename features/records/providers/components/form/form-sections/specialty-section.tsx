/**
 * Specialty Section
 * 
 * Form section for specialty and board certifications.
 */

'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProviderFormValues } from '@/features/records/providers/validations/schema';

interface SpecialtySectionProps {
  form: UseFormReturn<ProviderFormValues>;
}

export function SpecialtySection({ form }: SpecialtySectionProps) {
  const specialties = [
    'Internal Medicine',
    'Family Medicine',
    'Cardiology',
    'Pediatrics',
    'Surgery',
    'Emergency Medicine',
    'Psychiatry',
    'Dermatology',
    'Radiology',
    'Anesthesiology',
    'Obstetrics & Gynecology',
    'Orthopedics',
    'Neurology',
    'Gastroenterology',
    'Endocrinology',
    'Urology',
    'Rheumatology',
    'Ophthalmology',
    'Urgent Care',
    'Other',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
          🩺
        </div>
        <h3 className="text-sm font-medium uppercase tracking-wide text-foreground">
          Specialty & Practice
        </h3>
      </div>

      <FormField
        control={form.control}
        name="primarySpecialty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Specialty *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary specialty" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
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
