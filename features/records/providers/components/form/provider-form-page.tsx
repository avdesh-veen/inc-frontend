/**
 * Provider Form Page
 * 
 * Full page form for creating and editing providers.
 * Used by /records/providers/new and /records/providers/[id]/edit
 */

'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserAddIcon, InformationCircleIcon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { providerFormSchema, type ProviderFormValues } from '@/features/records/providers/validations/schema';
import { ProviderStatus, type CreateProviderRequest, type UpdateProviderRequest } from '@/features/records/providers/types';
import { LocationsSection } from './form-sections/locations-section';
import { useCreateProvider, useUpdateProvider } from '@/features/records/providers/hooks/use-provider-mutations';
import { getProviderById } from '@/lib/constants/mock-data/provider-data';

interface ProviderFormPageProps {
  mode: 'create' | 'edit';
  providerId?: string;
}

export function ProviderFormPage({ mode, providerId }: Readonly<ProviderFormPageProps>) {
  const router = useRouter();
  
  // Mutations
  const createProvider = useCreateProvider();
  const updateProvider = useUpdateProvider();
  
  // Get provider data if editing
  const provider = providerId ? getProviderById(providerId) : null;
  
  const isSubmitting = createProvider.isPending || updateProvider.isPending;

  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerFormSchema) as Resolver<ProviderFormValues>,
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      credential: '',
      providerType: undefined,
      gender: undefined,
      dateOfBirth: undefined,
      npi: '',
      deaNumber: '',
      taxId: '',
      ssn: '',
      caqhId: '',
      stateLicenses: [],
      primarySpecialty: '',
      secondarySpecialties: [],
      boardCertifications: [],
      email: '',
      phone: '',
      fax: '',
      clientIds: [],
      departmentId: '',
      businessEntityId: '',
      organizationalAffiliations: '',
      locations: [
        {
          locationName: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          zip: '',
          phone: '',
          fax: '',
          isPrimary: true,
        },
      ],
      status: ProviderStatus.ACTIVE,
    },
  });

  // Calculate profile completion percentage
  const profileCompletion = useMemo(() => {
    const values = form.watch();
    const requiredFields = [
      values.npi,
      values.taxId,
      values.caqhId,
      values.firstName,
      values.lastName,
      values.dateOfBirth,
      values.ssn,
      values.email,
      values.phone,
      values.primarySpecialty,
      values.clientIds && values.clientIds.length > 0,
      values.locations && values.locations.length > 0 && values.locations[0].addressLine1,
    ];
    
    const completed = requiredFields.filter(Boolean).length;
    return Math.round((completed / requiredFields.length) * 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch]);

  // Pre-populate form when editing
  useEffect(() => {
    if (provider && mode === 'edit') {
      form.reset({
        firstName: provider.firstName,
        middleName: provider.middleName ?? '',
        lastName: provider.lastName,
        suffix: provider.suffix ?? '',
        credential: provider.credential,
        providerType: provider.providerType,
        gender: provider.gender ?? undefined,
        dateOfBirth: provider.dateOfBirth ?? undefined,
        npi: provider.npi,
        deaNumber: provider.deaNumber ?? '',
        taxId: provider.taxId ?? '',
        ssn: provider.ssn || '',
        caqhId: provider.caqhId ?? '',
        stateLicenses: provider.stateLicenses.map((license) => ({
          state: license.state,
          licenseNumber: license.licenseNumber,
          licenseType: license.licenseType,
          issueDate: license.issueDate ?? undefined,
          expirationDate: license.expirationDate ?? undefined,
          status: license.status,
        })),
        primarySpecialty: provider.primarySpecialty,
        secondarySpecialties: provider.secondarySpecialties,
        boardCertifications: provider.boardCertifications,
        email: provider.email,
        phone: provider.phone ?? '',
        fax: provider.fax ?? '',
        clientIds: provider.clientIds,
        departmentId: provider.departmentId ?? '',
        businessEntityId: provider.businessEntityId ?? '',
        organizationalAffiliations: provider.organizationalAffiliations.join('\n'),
        locations: provider.locations.map((location) => ({
          locationName: location.locationName,
          addressLine1: location.addressLine1,
          addressLine2: location.addressLine2 ?? '',
          city: location.city,
          state: location.state,
          zip: location.zip,
          phone: location.phone ?? '',
          fax: location.fax ?? '',
          isPrimary: location.isPrimary,
        })),
        status: provider.status,
      });
    }
  }, [provider, mode, form]);

  const onSubmit = async (data: ProviderFormValues) => {
    try {
      // Convert organizational affiliations from string to array
      const organizationalAffiliations = data.organizationalAffiliations
        ? data.organizationalAffiliations.split('\n').filter((line) => line.trim())
        : [];

      if (mode === 'edit' && provider) {
        // Update existing provider
        const updatePayload: Partial<UpdateProviderRequest> = {
          firstName: data.firstName,
          middleName: data.middleName || undefined,
          lastName: data.lastName,
          suffix: data.suffix || undefined,
          credential: data.credential,
          providerType: data.providerType,
          gender: data.gender || undefined,
          dateOfBirth: data.dateOfBirth || undefined,
          npi: data.npi,
          deaNumber: data.deaNumber || undefined,
          taxId: data.taxId || undefined,
          ssn: data.ssn || undefined,
          caqhId: data.caqhId || undefined,
          primarySpecialty: data.primarySpecialty,
          secondarySpecialties: data.secondarySpecialties || undefined,
          boardCertifications: data.boardCertifications || undefined,
          email: data.email,
          phone: data.phone || undefined,
          fax: data.fax || undefined,
          clientIds: data.clientIds || undefined,
          departmentId: data.departmentId || undefined,
          businessEntityId: data.businessEntityId || undefined,
          organizationalAffiliations: organizationalAffiliations || undefined,
          status: data.status,
          stateLicenses: data.stateLicenses?.map(license => ({
            state: license.state,
            licenseNumber: license.licenseNumber,
            licenseType: license.licenseType,
            issueDate: license.issueDate || null,
            expirationDate: license.expirationDate || null,
            status: license.status,
          })),
          locations: data.locations?.map(location => ({
            locationName: location.locationName,
            addressLine1: location.addressLine1,
            addressLine2: location.addressLine2 || null,
            city: location.city,
            state: location.state,
            zip: location.zip,
            phone: location.phone || null,
            fax: location.fax || null,
            isPrimary: location.isPrimary,
          })),
        };

        await updateProvider.mutateAsync({ 
          id: provider.id, 
          data: updatePayload 
        });
        
        router.push(`/records/providers/${provider.id}`);
      } else {
        // Create new provider
        const createPayload: CreateProviderRequest = {
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          suffix: data.suffix,
          credential: data.credential,
          providerType: data.providerType,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth,
          npi: data.npi,
          deaNumber: data.deaNumber,
          taxId: data.taxId,
          ssn: data.ssn,
          caqhId: data.caqhId,
          primarySpecialty: data.primarySpecialty,
          secondarySpecialties: data.secondarySpecialties,
          boardCertifications: data.boardCertifications,
          email: data.email,
          phone: data.phone,
          fax: data.fax,
          clientIds: data.clientIds,
          departmentId: data.departmentId,
          businessEntityId: data.businessEntityId,
          organizationalAffiliations,
          status: data.status,
          stateLicenses: data.stateLicenses?.map(license => ({
            state: license.state,
            licenseNumber: license.licenseNumber,
            licenseType: license.licenseType,
            issueDate: license.issueDate || null,
            expirationDate: license.expirationDate || null,
            status: license.status,
          })),
          locations: data.locations?.map(location => ({
            locationName: location.locationName,
            addressLine1: location.addressLine1,
            addressLine2: location.addressLine2 || null,
            city: location.city,
            state: location.state,
            zip: location.zip,
            phone: location.phone || null,
            fax: location.fax || null,
            isPrimary: location.isPrimary,
          })),
        };

        const newProvider = await createProvider.mutateAsync(createPayload);
        
        // Navigate to the new provider's detail page if we have the ID
        if (newProvider.success && newProvider.data?.id) {
          router.push(`/records/providers/${newProvider.data.id}`);
        } else {
          router.push('/records/providers');
        }
      }
    } catch (error) {
      console.error('Error saving provider:', error);
    }
  };

  const handleCancel = () => {
    if (providerId) {
      router.push(`/records/providers/${providerId}`);
    } else {
      router.push('/records/providers');
    }
  };

  const handleSaveAndAddAnother = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      await form.handleSubmit(async (data) => {
        await onSubmit(data);
        form.reset();
      })();
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Form Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
          {/* Header Card */}
          <div className="rounded-xl border border-white/10 bg-white/2 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-cyan-600">
                  <HugeiconsIcon icon={UserAddIcon} className="h-7 w-7 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {mode === 'edit' ? 'Edit Provider' : 'Add New Provider'}
                  </h2>
                  <p className="text-white/60">
                    {mode === 'edit' 
                      ? 'Update provider information' 
                      : 'Enter provider information to begin the credentialing process'}
                  </p>
                </div>
              </div>
              
              {/* Profile Completion Indicator */}
              {mode === 'create' && (
                <div className="text-right">
                  <div className="mb-1 text-xs text-white/50">Profile Completion</div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-white/10">
                      <div 
                        className="h-full rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
                        style={{ width: `${profileCompletion}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white/70">{profileCompletion}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* NPI Section - Special Highlight */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20">
                    <svg className="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="npi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-emerald-300">
                            NPI (National Provider Identifier) <span className="text-rose-400">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder="1234567890" 
                              maxLength={10}
                              {...field}
                              className="border-emerald-500/30 bg-white/10 px-4 py-3 text-xl font-mono text-white placeholder-white/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                            />
                          </FormControl>
                          <p className="mt-2 text-xs text-white/50">
                            Enter the 10-digit NPI to check for duplicates before proceeding
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Section 1: Provider Identifiers */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/50">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-xs text-violet-400">1</span>
                  Provider Identifiers
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-white/70">
                          Tax ID (TIN) <span className="text-rose-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="XX-XXXXXXX" {...field} className="font-mono" />
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
                        <FormLabel className="text-sm text-white/70">
                          CAQH ID <span className="text-rose-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="12345678" {...field} className="font-mono" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 2: Organization Assignment */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/50">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs text-blue-400">2</span>
                  Organization Assignment
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="clientIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-white/70">
                          Client <span className="text-rose-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Select Client" {...field} value={field.value?.[0] || ''} onChange={(e) => field.onChange([e.target.value])} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessEntityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-white/70">Business Entity / Group</FormLabel>
                        <FormControl>
                          <Input placeholder="Select Business Entity (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 3: Legal Name */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/50">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs text-blue-400">3</span>
                  Legal Name
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-white/70">
                          First Name <span className="text-rose-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Sarah" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-white/70">Middle Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Ann" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-white/70">
                          Last Name <span className="text-rose-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Johnson" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="suffix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-white/70">Suffix</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="None" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="MD">MD</SelectItem>
                            <SelectItem value="DO">DO</SelectItem>
                            <SelectItem value="NP">NP</SelectItem>
                            <SelectItem value="PA">PA</SelectItem>
                            <SelectItem value="PA-C">PA-C</SelectItem>
                            <SelectItem value="PhD">PhD</SelectItem>
                            <SelectItem value="APRN">APRN</SelectItem>
                            <SelectItem value="DNP">DNP</SelectItem>
                            <SelectItem value="DPM">DPM</SelectItem>
                            <SelectItem value="OD">OD</SelectItem>
                            <SelectItem value="DDS">DDS</SelectItem>
                            <SelectItem value="DMD">DMD</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="credential"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-white/70">
                        Preferred Name <span className="text-white/40">(if different from legal name)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Sally Johnson" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section 4: Personal Information */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/50">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs text-blue-400">4</span>
                  Personal Information
                </h3>
                <div className="grid grid-cols-4 gap-6">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-white/70">
                          Date of Birth <span className="text-rose-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value?.toISOString().split('T')[0] || ''} onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)} />
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
                        <FormLabel className="text-sm text-white/70">
                          Last 4 SSN <span className="text-rose-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            maxLength={4} 
                            placeholder="••••" 
                            {...field}
                            className="font-mono tracking-widest"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-white/70">Gender</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Non-binary">Non-binary</SelectItem>
                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel className="text-sm text-white/70">Anticipated Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" />
                    </FormControl>
                  </FormItem>
                </div>
              </div>

              {/* Section 5: Contact Information */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/50">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs text-blue-400">5</span>
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-white/70">
                          Email <span className="text-rose-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="provider@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-white/70">
                          Phone <span className="text-rose-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(555) 555-5555" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 6: Service Locations - Use existing LocationsSection */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/50">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs text-blue-400">6</span>
                  Service Locations <span className="text-rose-400">*</span>
                </h3>
                <p className="text-xs text-white/50 -mt-2">Add at least one service location where this provider will practice</p>
                <LocationsSection form={form} />
              </div>

              {/* Section 7: Professional Information */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/50">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs text-blue-400">7</span>
                  Professional Information
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="primarySpecialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-white/70">
                          Primary Specialty <span className="text-rose-400">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Specialty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                            <SelectItem value="Family Medicine">Family Medicine</SelectItem>
                            <SelectItem value="Cardiology">Cardiology</SelectItem>
                            <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="Emergency Medicine">Emergency Medicine</SelectItem>
                            <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                            <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                            <SelectItem value="Neurology">Neurology</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel className="text-sm text-white/70">Secondary Specialty</FormLabel>
                    <Select defaultValue="none">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-white/70">Department</FormLabel>
                        <FormControl>
                          <Input placeholder="Select Department" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel className="text-sm text-white/70">Taxonomy Code</FormLabel>
                    <Input placeholder="207R00000X" className="font-mono" />
                  </FormItem>
                  <FormItem>
                    <FormLabel className="text-sm text-white/70">Board Certified</FormLabel>
                    <Select defaultValue="select">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="select">Select</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Pending">Board Eligible</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                </div>
              </div>

              {/* Section 8: Notes */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/50">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs text-blue-400">8</span>
                  Notes <span className="text-rose-400">*</span>
                </h3>
                <FormField
                  control={form.control}
                  name="organizationalAffiliations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-white/70">
                        Add Notes <span className="text-white/40">— Document any important context for the credentialing team</span>
                      </FormLabel>
                      <FormControl>
                        <textarea
                          rows={3}
                          placeholder="e.g., Rush request - provider starting Feb 1st, need Medicare completed first..."
                          {...field}
                          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Tips Card */}
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/20">
                    <HugeiconsIcon icon={InformationCircleIcon} className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-white">Tips for Adding Providers</h4>
                    <ul className="space-y-1 text-sm text-white/70">
                      <li>• Enter the NPI first to check for existing records and avoid duplicates</li>
                      <li>• Fields marked with <span className="text-rose-400">*</span> are required</li>
                      <li>• Add all service locations where the provider will see patients</li>
                      <li>• Include notes to help the credentialing team prioritize and process</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="gap-2 rounded-xl border-white/10 px-6 py-3 font-medium text-white/60 hover:bg-white/5"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Cancel
                </Button>
                
                <div className="flex items-center gap-3">
                  {mode === 'create' && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveAndAddAnother}
                      disabled={isSubmitting}
                      className="rounded-xl border-white/10 bg-white/5 px-6 py-3 font-medium text-white hover:bg-white/10"
                    >
                      Save & Add Another
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-cyan-600 px-8 py-3 font-semibold text-white hover:from-emerald-600 hover:to-cyan-700"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {isSubmitting 
                      ? 'Saving...' 
                      : mode === 'edit' 
                        ? 'Save Changes' 
                        : 'Add Provider'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
