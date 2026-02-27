/**
 * Credentials Section
 * 
 * Form section for provider credentials and licenses.
 */

'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon, Delete01Icon, SecurityLockIcon } from '@hugeicons/core-free-icons';
import { ProviderFormValues } from '@/features/records/providers/validations/schema';
import { SectionHeader } from './section-header';

interface CredentialsSectionProps {
  form: UseFormReturn<ProviderFormValues>;
}

export function CredentialsSection({ form }: CredentialsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'stateLicenses',
  });

  const addLicense = () => {
    append({
      state: '',
      licenseNumber: '',
      licenseType: 'Medical',
      issueDate: undefined,
      expirationDate: undefined,
      status: 'Active',
    });
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<HugeiconsIcon icon={SecurityLockIcon} />}
        title="Credentials"
        iconColor="text-emerald-400"
      />

      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="npi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NPI Number *</FormLabel>
              <FormControl>
                <MaskedInput 
                  maskType="npi"
                  placeholder="1234567890" 
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="deaNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DEA Number</FormLabel>
                <FormControl>
                  <MaskedInput 
                    maskType="dea"
                    placeholder="XX-XXXXXXX" 
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="caqhId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CAQH ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter CAQH ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="taxId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax ID</FormLabel>
                <FormControl>
                  <MaskedInput 
                    maskType="taxId"
                    placeholder="XX-XXXXXXX" 
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ssn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SSN</FormLabel>
                <FormControl>
                  <MaskedInput 
                    maskType="ssn"
                    placeholder="XXX-XX-XXXX" 
                    type="password"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* State Licenses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">State Licenses</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addLicense}
            className="gap-1.5"
          >
            <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" strokeWidth={2} />
            Add License
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 rounded-lg border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium text-foreground">License {index + 1}</h5>
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name={`stateLicenses.${index}.state`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PA">PA - Pennsylvania</SelectItem>
                        <SelectItem value="NJ">NJ - New Jersey</SelectItem>
                        <SelectItem value="NY">NY - New York</SelectItem>
                        <SelectItem value="DE">DE - Delaware</SelectItem>
                        <SelectItem value="MD">MD - Maryland</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`stateLicenses.${index}.licenseNumber`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter license number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name={`stateLicenses.${index}.licenseType`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Medical">Medical</SelectItem>
                        <SelectItem value="Nursing">Nursing</SelectItem>
                        <SelectItem value="Physician Assistant">Physician Assistant</SelectItem>
                        <SelectItem value="Dental">Dental</SelectItem>
                        <SelectItem value="Podiatry">Podiatry</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`stateLicenses.${index}.status`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="rounded-lg border border-dashed border-white/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No licenses added yet. Click &quot;Add License&quot; to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
