/**
 * Locations Section
 * 
 * Form section for managing multiple practice locations.
 */

'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon, Delete01Icon } from '@hugeicons/core-free-icons';
import { ProviderFormValues } from '@/features/records/providers/validations/schema';
import { Badge } from '@/components/ui/badge';

interface LocationsSectionProps {
  form: UseFormReturn<ProviderFormValues>;
}

export function LocationsSection({ form }: LocationsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'locations',
  });

  const addLocation = () => {
    append({
      locationName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      fax: '',
      isPrimary: fields.length === 0,
    });
  };

  const handlePrimaryChange = (index: number, checked: boolean) => {
    if (checked) {
      // Unset all other primary flags
      fields.forEach((_, i) => {
        form.setValue(`locations.${i}.isPrimary`, i === index);
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
            📍
          </div>
          <h3 className="text-sm font-medium uppercase tracking-wide text-foreground">
            Practice Locations
          </h3>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addLocation}
          className="gap-1.5"
        >
          <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" strokeWidth={2} />
          Add Location
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 rounded-lg border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h5 className="text-sm font-medium text-foreground">
                  Location {index + 1}
                </h5>
                {form.watch(`locations.${index}.isPrimary`) && (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    Primary
                  </Badge>
                )}
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="gap-1.5 text-red-400 hover:text-red-300"
                >
                  <HugeiconsIcon icon={Delete01Icon} className="size-3.5" strokeWidth={2} />
                  Remove
                </Button>
              )}
            </div>

            <FormField
              control={form.control}
              name={`locations.${index}.locationName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Main Office, Satellite Clinic, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`locations.${index}.addressLine1`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1 *</FormLabel>
                  <FormControl>
                    <Input placeholder="Street address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`locations.${index}.addressLine2`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl>
                    <Input placeholder="Suite, building, floor, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name={`locations.${index}.city`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`locations.${index}.state`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="State" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PA">PA</SelectItem>
                        <SelectItem value="NJ">NJ</SelectItem>
                        <SelectItem value="NY">NY</SelectItem>
                        <SelectItem value="DE">DE</SelectItem>
                        <SelectItem value="MD">MD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`locations.${index}.zip`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name={`locations.${index}.phone`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`locations.${index}.fax`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fax</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4568" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={`locations.${index}.isPrimary`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        handlePrimaryChange(index, checked as boolean);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Set as Primary Location</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        ))}

        {fields.length === 0 && (
          <div className="rounded-lg border border-dashed border-white/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No locations added yet. Click &quot;Add Location&quot; to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
