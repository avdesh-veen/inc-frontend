/**
 * Add / Edit Payer Contact Modal
 *
 * Create:  POST /api/v1/payers/{payerId}/contacts
 * Edit:    PUT  /api/v1/payers/{payerId}/contacts/{contactId}
 *
 * Pass `contactId` + `initialValues` to open in edit mode with prefilled fields.
 */

"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  useCreatePayerContact,
  useUpdatePayerContact,
} from "@/features/records/payer/hooks/use-payer-contacts";
import { useStatesList } from "@/features/records/payer/hooks/use-states";
import type { PayerContactDetail, StateItem } from "@/features/records/payer/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const CONTACT_TYPE_OPTIONS = [
  { value: "primaryContact", label: "Primary Contact" },
  { value: "callCenter", label: "Call Center" },
  { value: "escalation", label: "Escalation" },
];

// ─── Schema ───────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or fewer"),
  title: z.string().max(100, "Title must be 100 characters or fewer").optional(),
  type: z.string().min(1, "Contact type is required"),
  organization: z.string().max(150, "Organization must be 150 characters or fewer").optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-(). x]{7,20}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  mailingAddress: z.string().max(200, "Address must be 200 characters or fewer").optional(),
  streetAddress: z.string().max(200, "Address must be 200 characters or fewer").optional(),
  city: z.string().max(100, "City must be 100 characters or fewer").optional(),
  stateId: z.string().optional(),
  zip: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code (e.g. 10001 or 10001-1234)")
    .optional()
    .or(z.literal("")),
  bestTimeToReach: z.string().max(100, "Must be 100 characters or fewer").optional(),
  responseTime: z.string().max(50, "Must be 50 characters or fewer").optional(),
  responseTimeHours: z
    .number()
    .int("Must be a whole number")
    .min(0, "Must be 0 or more")
    .max(8760, "Must be 8760 hours (1 year) or fewer")
    .optional(),
  tipsAndNotes: z.string().max(500, "Must be 500 characters or fewer").optional(),
  successRate: z
    .number()
    .min(0, "Must be at least 0")
    .max(1, "Must be at most 1 (e.g. 0.85 for 85%)")
    .optional(),
  isPrimary: z.boolean(),
  caqhRequired: z.boolean(),
  isActive: z.boolean(),
});

type ContactFormData = z.infer<typeof contactSchema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildDefaultValues(initial?: PayerContactDetail): ContactFormData {
  if (!initial) {
    return {
      name: "",
      title: "",
      type: "",
      organization: "",
      phone: "",
      email: "",
      mailingAddress: "",
      streetAddress: "",
      city: "",
      stateId: "",
      zip: "",
      bestTimeToReach: "",
      responseTime: "",
      responseTimeHours: undefined,
      tipsAndNotes: "",
      successRate: undefined,
      isPrimary: false,
      caqhRequired: false,
      isActive: true,
    };
  }
  return {
    name: initial.name ?? "",
    title: initial.title ?? "",
    type: initial.type ?? "",
    organization: initial.organization ?? "",
    phone: initial.phone ?? "",
    email: initial.email ?? "",
    mailingAddress: initial.mailingAddress ?? "",
    streetAddress: initial.streetAddress ?? "",
    city: initial.city ?? "",
    stateId: initial.stateId ?? initial.state?.id ?? "",
    zip: initial.zip ?? "",
    bestTimeToReach: initial.bestTimeToReach ?? "",
    responseTime: initial.responseTime ?? "",
    responseTimeHours: initial.responseTimeHours ?? undefined,
    tipsAndNotes: initial.tipsAndNotes ?? "",
    successRate: initial.successRate ?? undefined,
    isPrimary: initial.isPrimary ?? false,
    caqhRequired: initial.caqhRequired ?? false,
    isActive: initial.isActive ?? true,
  };
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payerId: string;
  /** Provide to open in edit mode */
  contactId?: string;
  /** Prefilled values for edit mode */
  initialValues?: PayerContactDetail;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddContactModal({
  open,
  onOpenChange,
  payerId,
  contactId,
  initialValues,
}: Readonly<AddContactModalProps>) {
  const isEditMode = !!contactId;

  const { data: statesData, isLoading: statesLoading } = useStatesList({ limit: 100 });
  const states = statesData?.data?.items ?? [];

  const { mutate: createContact, isPending: isCreating } = useCreatePayerContact(payerId);
  const { mutate: updateContact, isPending: isUpdating } = useUpdatePayerContact(
    payerId,
    contactId ?? "",
  );
  const isPending = isCreating || isUpdating;

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: buildDefaultValues(initialValues),
  });

  React.useEffect(() => {
    if (open) {
      form.reset(buildDefaultValues(initialValues));
    }
  }, [open, initialValues, form]);

  const handleSubmit = (data: ContactFormData) => {
    const payload = {
      name: data.name,
      ...(data.title ? { title: data.title } : {}),
      type: data.type,
      ...(data.organization ? { organization: data.organization } : {}),
      ...(data.phone ? { phone: data.phone } : {}),
      ...(data.email ? { email: data.email } : {}),
      ...(data.mailingAddress ? { mailingAddress: data.mailingAddress } : {}),
      ...(data.streetAddress ? { streetAddress: data.streetAddress } : {}),
      ...(data.city ? { city: data.city } : {}),
      ...(data.stateId ? { stateId: data.stateId } : {}),
      ...(data.zip ? { zip: data.zip } : {}),
      ...(data.bestTimeToReach ? { bestTimeToReach: data.bestTimeToReach } : {}),
      ...(data.responseTime ? { responseTime: data.responseTime } : {}),
      ...(data.responseTimeHours != null ? { responseTimeHours: data.responseTimeHours } : {}),
      ...(data.tipsAndNotes ? { tipsAndNotes: data.tipsAndNotes } : {}),
      ...(data.successRate != null ? { successRate: data.successRate } : {}),
      isPrimary: data.isPrimary,
      caqhRequired: data.caqhRequired,
      isActive: data.isActive,
    };

    if (isEditMode) {
      updateContact(payload, { onSuccess: () => onOpenChange(false) });
    } else {
      createContact(payload, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-6 w-full sm:max-w-lg mx-4 gap-0 bg-[#0e1019] backdrop-blur-xl border-white/10 max-h-[85vh] flex flex-col"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex flex-row items-center justify-between mb-6 space-y-0 shrink-0">
          <div>
            <DialogTitle className="text-lg font-bold text-white">
              {isEditMode ? "Edit Contact" : "Add Contact"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {isEditMode
                ? "Update the contact details for this payer"
                : "Add a new contact to this payer"}
            </DialogDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white"
            aria-label="Close dialog"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="space-y-4 overflow-y-auto overflow-x-hidden flex-1 pr-1 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">

              {/* ── Section: Basic Info ── */}
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider pt-1">
                Basic Info
              </p>

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium text-white/60">
                      Name <span className="text-rose-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm placeholder:text-white/30 focus:border-emerald-500/50 focus-visible:ring-0 focus-visible:border-emerald-500/50"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-400" />
                  </FormItem>
                )}
              />

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium text-white/60">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Provider Relations Manager"
                        className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm placeholder:text-white/30 focus:border-emerald-500/50 focus-visible:ring-0 focus-visible:border-emerald-500/50"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-400" />
                  </FormItem>
                )}
              />

              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium text-white/60">
                      Contact Type <span className="text-rose-400">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm focus:border-emerald-500/50 focus:ring-0">
                          <SelectValue placeholder="Select contact type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONTACT_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-rose-400" />
                  </FormItem>
                )}
              />

              {/* Organization */}
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium text-white/60">
                      Organization
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Blue Cross Blue Shield"
                        className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm placeholder:text-white/30 focus:border-emerald-500/50 focus-visible:ring-0 focus-visible:border-emerald-500/50"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-400" />
                  </FormItem>
                )}
              />

              {/* ── Section: Contact Details ── */}
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider pt-2">
                Contact Details
              </p>

              {/* Phone + Email */}
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-medium text-white/60">Phone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="+1-555-123-4567"
                          className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm placeholder:text-white/30 focus:border-emerald-500/50 focus-visible:ring-0 focus-visible:border-emerald-500/50"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-medium text-white/60">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="john@payer.com"
                          className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm placeholder:text-white/30 focus:border-emerald-500/50 focus-visible:ring-0 focus-visible:border-emerald-500/50"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-400" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Best Time To Reach */}
              <FormField
                control={form.control}
                name="bestTimeToReach"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium text-white/60">
                      Best Time to Reach
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Monday–Friday 9AM–5PM EST"
                        className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm placeholder:text-white/30 focus:border-emerald-500/50 focus-visible:ring-0 focus-visible:border-emerald-500/50"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-400" />
                  </FormItem>
                )}
              />

              {/* Response Time + Hours */}
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="responseTime"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-medium text-white/60">
                        Response Time
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="24–48 hours"
                          className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm placeholder:text-white/30 focus:border-emerald-500/50 focus-visible:ring-0 focus-visible:border-emerald-500/50"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="responseTimeHours"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-medium text-white/60">
                        Response Time (hrs)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="24"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? undefined : e.target.valueAsNumber,
                            )
                          }
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm placeholder:text-white/30 focus:border-emerald-500/50 focus-visible:ring-0 focus-visible:border-emerald-500/50"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-400" />
                    </FormItem>
                  )}
                />
              </div>

              {/* ── Section: Address ── */}
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider pt-2">
                Address
              </p>

              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium text-white/60">
                      Street Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123 Main Street, Suite 100"
                        className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm placeholder:text-white/30 focus:border-emerald-500/50 focus-visible:ring-0 focus-visible:border-emerald-500/50"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mailingAddress"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium text-white/60">
                      Mailing Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="P.O. Box 12345"
                        className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm placeholder:text-white/30 focus:border-emerald-500/50 focus-visible:ring-0 focus-visible:border-emerald-500/50"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-400" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-medium text-white/60">City</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="New York"
                          className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm placeholder:text-white/30 focus:border-emerald-500/50 focus-visible:ring-0 focus-visible:border-emerald-500/50"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stateId"
                  render={({ field }) => (
                    <FormItem className="space-y-1 flex flex-col">
                      <FormLabel className="text-xs font-medium text-white/60">State</FormLabel>
                      <Combobox<StateItem>
                        items={states}
                        itemToStringValue={(item) => item?.code ?? ""}
                        value={states.find((s) => s.id === field.value) ?? null}
                        onValueChange={(item) => field.onChange(item?.id ?? "")}
                        disabled={statesLoading}
                      >
                        <FormControl>
                          <ComboboxInput
                            placeholder={statesLoading ? "Loading…" : "Search state…"}
                            showClear={!!field.value}
                          />
                        </FormControl>
                        <ComboboxContent>
                          <ComboboxEmpty>No states found</ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item.id} value={item}>
                                {item.code} — {item.name}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                      <FormMessage className="text-xs text-rose-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-medium text-white/60">ZIP</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="10001"
                          className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm placeholder:text-white/30 focus:border-emerald-500/50 focus-visible:ring-0 focus-visible:border-emerald-500/50"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-400" />
                    </FormItem>
                  )}
                />
              </div>

              {/* ── Section: Notes & Metrics ── */}
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider pt-2">
                Notes &amp; Metrics
              </p>

              <FormField
                control={form.control}
                name="tipsAndNotes"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium text-white/60">
                      Tips &amp; Notes
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Call before 2PM for faster response…"
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border-white/10 text-white text-sm placeholder:text-white/30 resize-none focus:border-emerald-500/50 focus-visible:ring-0 focus-visible:border-emerald-500/50"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-400" />
                  </FormItem>
                )}
              />

              {/* Success Rate */}
              <FormField
                control={form.control}
                name="successRate"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium text-white/60">
                      Success Rate{" "}
                      <span className="text-white/30 font-normal">(0–1, e.g. 0.85)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        max={1}
                        placeholder="0.85"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : e.target.valueAsNumber,
                          )
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm placeholder:text-white/30 focus:border-emerald-500/50 focus-visible:ring-0 focus-visible:border-emerald-500/50"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-400" />
                  </FormItem>
                )}
              />

              {/* ── Section: Flags ── */}
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider pt-2">
                Flags
              </p>

              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="isPrimary"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-medium text-white/60">
                        Primary Contact
                      </FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v === "true")}
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm focus:border-emerald-500/50 focus:ring-0">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-rose-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="caqhRequired"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-medium text-white/60">
                        CAQH Required
                      </FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v === "true")}
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm focus:border-emerald-500/50 focus:ring-0">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-rose-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-medium text-white/60">
                        Active
                      </FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v === "true")}
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm focus:border-emerald-500/50 focus:ring-0">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-rose-400" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10 shrink-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="px-4 py-2 h-auto rounded-xl bg-white/5 text-white/70 text-sm hover:bg-white/10 hover:text-white/70"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 h-auto rounded-xl bg-emerald-600 text-white text-sm hover:bg-emerald-700"
              >
                {isPending
                  ? isEditMode
                    ? "Saving…"
                    : "Adding…"
                  : isEditMode
                    ? "Save Changes"
                    : "Add Contact"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
