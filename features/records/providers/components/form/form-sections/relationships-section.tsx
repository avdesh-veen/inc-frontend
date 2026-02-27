/**
 * Relationships Section
 * 
 * Form section for client associations and organizational affiliations.
 */

'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ProviderFormValues } from '@/features/records/providers/validations/schema';

interface RelationshipsSectionProps {
  form: UseFormReturn<ProviderFormValues>;
}

export function RelationshipsSection({ form }: RelationshipsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/20 text-pink-400">
          🏢
        </div>
        <h3 className="text-sm font-medium uppercase tracking-wide text-foreground">
          Relationships
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="dept-001">Internal Medicine</SelectItem>
                  <SelectItem value="dept-002">Cardiology</SelectItem>
                  <SelectItem value="dept-003">Family Medicine</SelectItem>
                  <SelectItem value="dept-004">Pediatrics</SelectItem>
                  <SelectItem value="dept-005">Surgery</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessEntityId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Entity</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="be-001">BE001 - Main Office</SelectItem>
                  <SelectItem value="be-002">BE002 - Satellite</SelectItem>
                  <SelectItem value="be-003">BE003 - Regional</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="organizationalAffiliations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Organizational Affiliations</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter organizational affiliations (one per line)"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
