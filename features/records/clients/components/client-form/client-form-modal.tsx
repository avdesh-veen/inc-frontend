'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { AlertCircleIcon } from '@hugeicons/core-free-icons';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DatePicker } from '@/components/ui/date-picker';
import { MaskedInput } from '@/components/ui/masked-input';
import { createClientSchema, type CreateClientFormData } from '@/features/records/clients/validations/schemas';
import type { Client, ContactPayload } from '@/features/records/clients/types';
import { useClientStore } from '@/features/records/clients/hooks/use-client-store';
import { useCreateClient, useUpdateClient, useClientById } from '@/features/records/clients/hooks/use-clients';
import { useStatesDropdown } from '@/features/shared/hooks/use-states';
import { useLeadershipUsers } from '@/features/user-and-roles/hooks/use-users';

export function ClientFormModal() {
  const { isFormModalOpen, editingClientId, closeFormModal } = useClientStore();
  const isEditMode = !!editingClientId;
  
  const { data: statesResponse, isLoading: isStatesLoading } = useStatesDropdown();
  const stateOptions = statesResponse?.data?.items || [];
  const { data: leadershipUsersData, isLoading: isLeadershipUsersLoading } = useLeadershipUsers({ page: 1, limit: 50 });
  const { data: clientResponse, isLoading: isClientLoading } = useClientById(editingClientId || undefined);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const clientData = clientResponse?.data as Client;
  const leadershipUsers = leadershipUsersData?.data?.items || [];

  // Initialize form with API payload structure
  const form = useForm({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      organizationName: '',
      dbaName: '',
      type: 'large' as const,
      taxId: '',
      npi: '',
      mainPhone: '',
      mainEmail: '',
      website: '',
      address: {
        streetAddress: '',
        city: '',
        stateId: '',
        zip: ''
      },
      accountTier: 'silver' as const,
      accountManagerId: '',
      contractStartDate: '',
      contractEndDate: '',
      portalAccess: false,
      isActive: true,
      internalNotes: '',
      activityNote: '',
      contacts: [
        {
          contactType: 'primary' as const,
          contactName: '',
          title: '',
          email: '',
          phone: ''
        },
        {
          contactType: 'billing' as const,
          contactName: '',
          title: '',
          email: '',
          phone: ''
        }
      ]
    },
  });

  // Load client data in edit mode
  useEffect(() => {
    if (isEditMode && clientData) {
      // Map client type to form values
      const mapTypeToFormValue = (type: string): 'large' | 'midSize' | 'smallGroup' => {
        const typeMap: Record<string, 'large' | 'midSize' | 'smallGroup'> = {
          'large': 'large',
          'midSize': 'midSize',
          'smallGroup': 'smallGroup',
          'Large': 'large',
          'Mid-size': 'midSize',
          'Small Group': 'smallGroup'
        };
        return typeMap[type] || 'large';
      };

      // Map tier to form values
      const mapTierToFormValue = (tier: string): 'platinum' | 'diamond' | 'gold' | 'silver' | 'bronze' => {
        return tier?.toLowerCase() as 'platinum' | 'diamond' | 'gold' | 'silver' | 'bronze';
      };

      // Get primary and billing contacts
      const primaryContact = clientData.contacts?.find(c => c.contactType === 'primary');
      const billingContact = clientData.contacts?.find(c => c.contactType === 'billing');

      form.reset({
        organizationName: clientData.organizationName || '',
        dbaName: clientData.dbaName || '',
        type: mapTypeToFormValue(clientData.type),
        taxId: clientData.taxId || '',
        npi: clientData.npi || '',
        mainPhone: clientData.mainPhone || '',
        mainEmail: clientData.mainEmail || '',
        website: clientData.website || '',
        address: {
          streetAddress: clientData.address?.streetAddress || '',
          city: clientData.address?.city || '',
          stateId: clientData.address?.stateId || '',
          zip: clientData.address?.zip || ''
        },
        accountTier: mapTierToFormValue(clientData.accountTier),
        accountManagerId: clientData.accountManagerId || '',
        contractStartDate: clientData.contractStartDate || '',
        contractEndDate: clientData.contractEndDate || '',
        portalAccess: clientData.portalAccess || false,
        isActive: clientData.isActive,
        internalNotes: clientData.internalNotes || '',
        activityNote: clientData.activityNote || '',
        contacts: [
          {
            contactType: 'primary' as const,
            contactName: primaryContact?.contactName || '',
            title: primaryContact?.title || '',
            email: primaryContact?.email || '',
            phone: primaryContact?.phone || ''
          },
          {
            contactType: 'billing' as const,
            contactName: billingContact?.contactName || '',
            title: billingContact?.title || '',
            email: billingContact?.email || '',
            phone: billingContact?.phone || ''
          }
        ]
      });
    } 
    
  }, [isEditMode, clientData, form]);

  // Handle close
  const handleClose = () => {
    if (form.formState.isDirty) {
      return;
    }
    closeFormModal();
    form.reset();
  };

  // Handle form submission
  const onSubmit = async (data: CreateClientFormData) => {
    try {
      // Filter out billing contact if all fields are empty
      const filteredContacts = data.contacts.filter((contact) => {
        if (contact.contactType === 'billing') {
          // Check if billing contact has any meaningful data
          return contact.contactName || contact.email || contact.phone || contact.title;
        }
        return true; // Keep primary contact
      }) as ContactPayload[];

      const submissionData = {
        ...data,
        contacts: filteredContacts
      };

      if (isEditMode && editingClientId) {
        await updateClient.mutateAsync({ id: editingClientId, data: submissionData });
      } else {
        await createClient.mutateAsync(submissionData);
      }
      
      closeFormModal();
      form.reset();
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const isSubmitting = createClient.isPending || updateClient.isPending;
  const isLoadingData = isEditMode && isClientLoading;

  return (
    <Dialog open={isFormModalOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Client' : 'Add New Client'}
          </DialogTitle>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading client data...</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Organization Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase text-muted-foreground">
                Organization Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Organization Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dbaName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DBA (if different)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Type <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="midSize">Mid-size</SelectItem>
                          <SelectItem value="smallGroup">Small Group</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tax ID <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <MaskedInput
                          maskType="taxId"
                          placeholder="XX-XXXXXXX"
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          showLastDigits={isEditMode ? 3 : undefined}
                          disabled={isEditMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="npi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group NPI (NPI-2)<span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <MaskedInput
                          maskType="npi"
                          placeholder="1234567890"
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="mainPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Phone</FormLabel>
                      <FormControl>
                        <MaskedInput
                          maskType="phone"
                          placeholder="(555) 555-5555"
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mainEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="info@organization.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Primary Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase text-muted-foreground">
                Primary Contact
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contacts.0.contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Contact Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contacts.0.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contacts.0.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contacts.0.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <MaskedInput
                          maskType="phone"
                          placeholder="(555) 555-5555"
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Billing Contact (Optional) */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase text-muted-foreground">
                Billing Contact (Optional)
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contacts.1.contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Billing Contact Name" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contacts.1.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Billing Manager" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contacts.1.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="billing@org.com" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contacts.1.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <MaskedInput
                          maskType="phone"
                          placeholder="(555) 555-5555"
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase text-muted-foreground">Address</h3>

              <FormField
                control={form.control}
                name="address.streetAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Street Address <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        City <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.stateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        State <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isStatesLoading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isStatesLoading ? "Loading states..." : "Select state"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[200px]">
                          {stateOptions.map((state) => (
                            <SelectItem key={state.id} value={state.id}>
                              {state.name}
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
                  name="address.zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        ZIP <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <MaskedInput
                          maskType="zip"
                          placeholder="12345"
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Contract & Services */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase text-muted-foreground">
                Contract & Services
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="accountTier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Account Tier <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="platinum">Platinum</SelectItem>
                          <SelectItem value="diamond">Diamond</SelectItem>
                          <SelectItem value="gold">Gold</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                          <SelectItem value="bronze">Bronze</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountManagerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Manager <span className="text-destructive">*</span></FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || 'none'}
                        disabled={isLeadershipUsersLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isLeadershipUsersLoading ? "Loading managers..." : "Select manager"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[200px]">
                          <SelectItem value="none">None</SelectItem>
                          {leadershipUsers.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.firstName} {user.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contractStartDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Contract Start</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value ? new Date(field.value) : undefined}
                          onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                          placeholder="dd/mm/yyyy"
                          dateFormat="dd/MM/yyyy"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contractEndDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Contract End</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value ? new Date(field.value) : undefined}
                          onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                          placeholder="dd/mm/yyyy"
                          dateFormat="dd/MM/yyyy"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-6">
                <FormField
                  control={form.control}
                  name="portalAccess"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">
                        Enable Client Portal
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">
                        Active Client
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Internal Notes */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="internalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Internal Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Internal notes about this client..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      {(field.value?.length || 0)}/2000 characters
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activityNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Activity Note <span className="text-destructive">*</span>
                    </FormLabel>
                    <Alert className="mb-2 flex items-center gap-2">
                      <HugeiconsIcon icon={AlertCircleIcon} className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Required for audit trail. Explain why this client is being added or updated.
                      </AlertDescription>
                    </Alert>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., New contract signed, referred by existing client..."
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEditMode ? 'Update Client' : 'Add Client'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
