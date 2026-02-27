/**
 * Add Payer Content
 *
 * Full-page form for creating a new payer playbook / enrollment guide.
 * Payload matches POST /api/v1/payers.
 */

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, PlusSignIcon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { PARENT_OPTIONS, SUBCATEGORY_BY_CATEGORY } from "@/features/records/payer/types";
import { useCreatePayer } from "@/features/records/payer/hooks/use-payers";
import { useStatesList } from "@/features/records/payer/hooks/use-states";
import { MultiSelectCombobox } from "@/components/shared/multi-select-combobox";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAYER_TYPE_OPTIONS = [
  { value: "government", label: "Government" },
  { value: "commercial", label: "Commercial" },
  { value: "workers_comp", label: "Workers Comp" },
];

const DOCUMENT_TYPE_OPTIONS = [
  { value: "license", label: "License" },
  { value: "certificate", label: "Certificate" },
  { value: "form", label: "Form" },
  { value: "insurance", label: "Insurance" },
  { value: "identification", label: "Identification" },
  { value: "tax", label: "Tax" },
  { value: "other", label: "Other" },
];

// ─── Schema ───────────────────────────────────────────────────────────────────

const requiredDocumentSchema = z.object({
  name: z.string().min(1, "Document name is required"),
  description: z.string(),
  type: z.string().min(1, "Document type is required"),
  formatRequired: z.string().min(1, "Format is required"),
  isRequired: z.boolean(),
});

const enrollmentStepSchema = z.object({
  stepName: z.string().min(1, "Step name is required"),
  estDuration: z.string(),
  description: z.string(),
  isRequired: z.boolean(),
  isActive: z.boolean(),
  tip: z.string(),
});

const commonIssueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
});

const portalTipSchema = z.object({
  tipText: z.string().min(1, "Tip text is required"),
  isActive: z.boolean(),
});

const addPayerSchema = z.object({
  // Identity
  name: z.string().min(1, "Payer name is required"),
  displayName: z.string(),
  shortName: z.string(),
  abbreviation: z.string(),
  // Classification
  type: z.string().min(1, "Payer type is required"),
  subCategory: z.string(),
  parent: z.string(),
  submissionMethod: z.string(),
  // Timing & Status
  tatDays: z.number().min(0).optional(),
  totalProcessingTime: z.string(),
  isDelegated: z.boolean(),
  panelStatus: z.boolean(),
  isActive: z.boolean(),
  // Contact
  primaryPhone: z.string(),
  primaryEmail: z.string(),
  // Portal
  portalName: z.string(),
  portalUrl: z.string(),
  portalLoginType: z.string(),
  portalBestBrowser: z.string(),
  // Recredentialing
  recredentialingCycle: z.string(),
  recredentialingProcess: z.string(),
  // States
  stateIds: z.array(z.string()),
  // Dynamic arrays
  requiredDocuments: z.array(requiredDocumentSchema),
  commonIssues: z.array(commonIssueSchema),
  portalTips: z.array(portalTipSchema),
  enrollmentSteps: z.array(enrollmentStepSchema),
});

type AddPayerFormData = z.infer<typeof addPayerSchema>;

const DEFAULT_VALUES: AddPayerFormData = {
  name: "",
  displayName: "",
  shortName: "",
  abbreviation: "",
  type: "",
  subCategory: "",
  parent: "",
  submissionMethod: "",
  tatDays: undefined,
  totalProcessingTime: "",
  isDelegated: false,
  panelStatus: true,
  isActive: true,
  primaryPhone: "",
  primaryEmail: "",
  portalName: "",
  portalUrl: "",
  portalLoginType: "",
  portalBestBrowser: "",
  recredentialingCycle: "",
  recredentialingProcess: "",
  stateIds: [],
  requiredDocuments: [],
  commonIssues: [],
  portalTips: [],
  enrollmentSteps: [],
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AddPayerContent() {
  const router = useRouter();
  const createPayer = useCreatePayer();
  const { data: statesData, isLoading: statesLoading } = useStatesList({ limit: 100 });

  const stateOptions = (statesData?.data?.items ?? []).map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const form = useForm<AddPayerFormData>({
    resolver: zodResolver(addPayerSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedType = form.watch("type");
  const subcategoryItems = SUBCATEGORY_BY_CATEGORY[selectedType] ?? [];
  const isGovernment = selectedType === "government";

  const { fields: docFields, append: appendDoc, remove: removeDoc } = useFieldArray({
    control: form.control,
    name: "requiredDocuments",
  });

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control: form.control,
    name: "enrollmentSteps",
  });

  const { fields: issueFields, append: appendIssue, remove: removeIssue } = useFieldArray({
    control: form.control,
    name: "commonIssues",
  });

  const { fields: tipFields, append: appendTip, remove: removeTip } = useFieldArray({
    control: form.control,
    name: "portalTips",
  });

  const handleCancel = () => router.push("/records/payers");

  const onSubmit = (data: AddPayerFormData) => {
    const payload = {
      name: data.name,
      displayName: data.displayName || undefined,
      shortName: data.shortName || undefined,
      abbreviation: data.abbreviation || undefined,
      type: data.type || undefined,
      subCategory: data.subCategory || undefined,
      parent: data.parent || undefined,
      submissionMethod: data.submissionMethod || undefined,
      tatDays: data.tatDays,
      totalProcessingTime: data.totalProcessingTime || undefined,
      isDelegated: data.isDelegated,
      panelStatus: data.panelStatus,
      isActive: data.isActive,
      primaryPhone: data.primaryPhone || undefined,
      primaryEmail: data.primaryEmail || undefined,
      portalName: data.portalName || undefined,
      portalUrl: data.portalUrl || undefined,
      portalLoginType: data.portalLoginType || undefined,
      portalBestBrowser: data.portalBestBrowser || undefined,
      recredentialingCycle: data.recredentialingCycle || undefined,
      recredentialingProcess: data.recredentialingProcess || undefined,
      stateIds: data.stateIds.length > 0 ? data.stateIds : undefined,
      enrollmentSteps: data.enrollmentSteps.map((step, i) => ({
        stepNo: i + 1,
        stepName: step.stepName,
        estDuration: step.estDuration,
        description: step.description,
        isRequired: step.isRequired,
        isActive: step.isActive,
        tip: step.tip,
      })),
      requiredDocuments: data.requiredDocuments.map((doc) => ({
        name: doc.name,
        description: doc.description,
        type: doc.type,
        formatRequired: doc.formatRequired,
        isRequired: doc.isRequired,
      })),
      commonIssues: data.commonIssues.map((issue) => ({
        title: issue.title,
        description: issue.description,
      })),
      portalTips: data.portalTips.map((tip, i) => ({
        tipText: tip.tipText,
        tipOrder: i + 1,
        isActive: tip.isActive,
      })),
    };

    createPayer.mutate(payload, {
      onSuccess: () => router.push("/records/payers"),
    });
  };

  const isPending = createPayer.isPending;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="rounded-xl text-muted-foreground hover:text-foreground"
            aria-label="Go back to payer list"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">New Payer Playbook</h2>
            <p className="text-sm text-muted-foreground">Create new payer enrollment guide</p>
          </div>
        </div>

        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isPending}
          className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
          aria-label="Submit payer playbook for approval"
        >
          <HugeiconsIcon icon={Tick02Icon} className="size-4" strokeWidth={2} aria-hidden="true" />
          {isPending ? "Submitting..." : "Submit for Approval"}
        </Button>
      </div>

      {/* ── Approval Notice ── */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <p className="text-amber-300 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Changes require manager approval before going live
        </p>
      </div>

      {/* ── Form ── */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ════════════════════════════════════════════════════════════
                Left Column (span-2)
                ════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-2 space-y-6">

              {/* ── Basic Information ── */}
              <Card>
                <CardContent className="p-5">
                  <h4 className="font-bold text-foreground mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">Payer Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Blue Cross Blue Shield" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">Display Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., BCBS" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shortName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">Short Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., BCBS" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="abbreviation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">Abbreviation</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., BCBS" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">Payer Type *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PAYER_TYPE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
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
                      name="subCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">Sub-Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={subcategoryItems.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    subcategoryItems.length === 0
                                      ? "Select a type first"
                                      : "Select sub-category"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subcategoryItems.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Parent — dropdown for Government, text input otherwise */}
                    <FormField
                      control={form.control}
                      name="parent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">
                            Parent{isGovernment && " *"}
                          </FormLabel>
                          {isGovernment ? (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select parent" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {PARENT_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <FormControl>
                              <Input placeholder="e.g., parent organization" {...field} disabled={!selectedType} />
                            </FormControl>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="submissionMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">Submission Method</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Portal, Paper, CAQH" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stateIds"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs text-muted-foreground">States</FormLabel>
                          <FormControl>
                            <MultiSelectCombobox
                              options={stateOptions}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder={statesLoading ? "Loading states..." : "Select states..."}
                              emptyMessage={statesLoading ? "Loading..." : "No states found"}
                              disabled={statesLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tatDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">TAT (Days)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              placeholder="e.g., 30"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="totalProcessingTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">Total Processing Time</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 14-21 days" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="primaryPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">Primary Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="e.g., (800) 555-0100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="primaryEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">Primary Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="provider@payer.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                    <FormField
                      control={form.control}
                      name="isDelegated"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                            <FormLabel className="text-sm text-foreground cursor-pointer">
                              Delegated
                            </FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="panelStatus"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                            <FormLabel className="text-sm text-foreground cursor-pointer">
                              Panel Open
                            </FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                            <FormLabel className="text-sm text-foreground cursor-pointer">
                              Active
                            </FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* ── Portal Information ── */}
              <Card>
                <CardContent className="p-5">
                  <h4 className="font-bold text-foreground mb-4">Portal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <FormField
                      control={form.control}
                      name="portalName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">Portal Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., NaviNet, PECOS" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="portalUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">Portal URL</FormLabel>
                          <FormControl>
                            <Input type="url" placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="portalLoginType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">Login Type</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Provider Portal Account" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="portalBestBrowser"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">Best Browser</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Chrome, Edge" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* ── Required Documents ── */}
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-foreground">Required Documents</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        appendDoc({ name: "", description: "", type: "", formatRequired: "", isRequired: true })
                      }
                      className="h-8 px-3 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:text-emerald-300 text-xs font-medium"
                      aria-label="Add required document"
                    >
                      <HugeiconsIcon icon={PlusSignIcon} className="size-3 mr-1" strokeWidth={2} aria-hidden="true" />
                      Add Document
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {docFields.length === 0 ? (
                      <p className="text-muted-foreground text-sm text-center py-4">No documents added yet</p>
                    ) : (
                      docFields.map((docField, index) => (
                        <div key={docField.id} className="rounded-lg border border-white/8 bg-white/[0.02] p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground">Document {index + 1}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeDoc(index)}
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              aria-label={`Remove document ${index + 1}`}
                            >
                              <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" strokeWidth={2} aria-hidden="true" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <FormField
                              control={form.control}
                              name={`requiredDocuments.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs text-muted-foreground">Document Name *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., W-9 Form" className="text-sm" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`requiredDocuments.${index}.type`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs text-muted-foreground">Document Type *</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="text-sm">
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {DOCUMENT_TYPE_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                          {opt.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name={`requiredDocuments.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs text-muted-foreground">Description</FormLabel>
                                <FormControl>
                                  <Textarea rows={2} placeholder="What this document verifies..." className="resize-none text-sm" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-3">
                            <FormField
                              control={form.control}
                              name={`requiredDocuments.${index}.formatRequired`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs text-muted-foreground">Format Required *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., PDF, Original" className="text-sm" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`requiredDocuments.${index}.isRequired`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs text-muted-foreground">Required</FormLabel>
                                  <div className="flex items-center justify-between p-2.5 rounded-md border border-input bg-background h-10">
                                    <span className="text-xs text-muted-foreground">{field.value ? "Required" : "Optional"}</span>
                                    <FormControl>
                                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* ── Common Issues ── */}
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-foreground">Common Issues</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => appendIssue({ title: "", description: "" })}
                      className="h-8 px-3 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:text-emerald-300 text-xs font-medium"
                      aria-label="Add common issue"
                    >
                      <HugeiconsIcon icon={PlusSignIcon} className="size-3 mr-1" strokeWidth={2} aria-hidden="true" />
                      Add Issue
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {issueFields.length === 0 ? (
                      <p className="text-muted-foreground text-sm text-center py-4">No issues added yet</p>
                    ) : (
                      issueFields.map((issueField, index) => (
                        <div key={issueField.id} className="rounded-lg border border-white/8 bg-white/[0.02] p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground">Issue {index + 1}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeIssue(index)}
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              aria-label={`Remove issue ${index + 1}`}
                            >
                              <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" strokeWidth={2} aria-hidden="true" />
                            </Button>
                          </div>
                          <FormField
                            control={form.control}
                            name={`commonIssues.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs text-muted-foreground">Title *</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Slow response during peak hours" className="text-sm" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`commonIssues.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs text-muted-foreground">Description</FormLabel>
                                <FormControl>
                                  <Textarea rows={2} placeholder="Describe the issue and any workarounds..." className="resize-none text-sm" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ════════════════════════════════════════════════════════════
                Right Column
                ════════════════════════════════════════════════════════════ */}
            <div className="space-y-6">

              {/* ── Recredentialing ── */}
              <Card>
                <CardContent className="p-5">
                  <h4 className="font-bold text-foreground mb-4">Recredentialing</h4>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="recredentialingCycle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">Cycle</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 3 years" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="recredentialingProcess"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">Process</FormLabel>
                          <FormControl>
                            <Textarea rows={3} placeholder="Describe the recredentialing process..." className="resize-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* ── Portal Tips ── */}
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-foreground">Portal Tips</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => appendTip({ tipText: "", isActive: true })}
                      className="h-8 px-3 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:text-emerald-300 text-xs font-medium"
                      aria-label="Add portal tip"
                    >
                      <HugeiconsIcon icon={PlusSignIcon} className="size-3 mr-1" strokeWidth={2} aria-hidden="true" />
                      Add Tip
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {tipFields.length === 0 ? (
                      <p className="text-muted-foreground text-sm text-center py-4">No tips added yet</p>
                    ) : (
                      tipFields.map((tipField, index) => (
                        <div key={tipField.id} className="rounded-lg border border-white/8 bg-white/[0.02] p-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-emerald-400">Tip {index + 1}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTip(index)}
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              aria-label={`Remove tip ${index + 1}`}
                            >
                              <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" strokeWidth={2} aria-hidden="true" />
                            </Button>
                          </div>
                          <FormField
                            control={form.control}
                            name={`portalTips.${index}.tipText`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs text-muted-foreground">Tip Text *</FormLabel>
                                <FormControl>
                                  <Textarea rows={2} placeholder="e.g., Always clear browser cache before logging in..." className="resize-none text-xs" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`portalTips.${index}.isActive`}
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center justify-between p-2 rounded bg-white/[0.02]">
                                  <FormLabel className="text-xs text-foreground cursor-pointer">Active</FormLabel>
                                  <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                  </FormControl>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* ── Enrollment Steps ── */}
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-foreground">Enrollment Steps</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        appendStep({ stepName: "", estDuration: "", description: "", isRequired: true, isActive: true, tip: "" })
                      }
                      className="h-8 px-3 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:text-emerald-300 text-xs font-medium"
                      aria-label="Add enrollment step"
                    >
                      <HugeiconsIcon icon={PlusSignIcon} className="size-3 mr-1" strokeWidth={2} aria-hidden="true" />
                      Add Step
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {stepFields.length === 0 ? (
                      <p className="text-muted-foreground text-sm text-center py-4">No steps defined yet</p>
                    ) : (
                      stepFields.map((stepField, index) => (
                        <div key={stepField.id} className="rounded-lg border border-white/8 bg-white/[0.02] p-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-emerald-400">Step {index + 1}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeStep(index)}
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              aria-label={`Remove step ${index + 1}`}
                            >
                              <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" strokeWidth={2} aria-hidden="true" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <FormField
                              control={form.control}
                              name={`enrollmentSteps.${index}.stepName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs text-muted-foreground">Step Name *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., PECOS Registration" className="text-xs h-8" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`enrollmentSteps.${index}.estDuration`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs text-muted-foreground">Est. Duration</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., 1-2 days" className="text-xs h-8" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name={`enrollmentSteps.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs text-muted-foreground">Description</FormLabel>
                                <FormControl>
                                  <Textarea rows={2} placeholder="Describe what happens in this step..." className="resize-none text-xs" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`enrollmentSteps.${index}.tip`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs text-muted-foreground">Tip</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Use provider's personal email" className="text-xs h-8" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex items-center gap-3">
                            <FormField
                              control={form.control}
                              name={`enrollmentSteps.${index}.isRequired`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <div className="flex items-center justify-between p-2 rounded bg-white/[0.02]">
                                    <FormLabel className="text-xs text-foreground cursor-pointer">Required</FormLabel>
                                    <FormControl>
                                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`enrollmentSteps.${index}.isActive`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <div className="flex items-center justify-between p-2 rounded bg-white/[0.02]">
                                    <FormLabel className="text-xs text-foreground cursor-pointer">Active</FormLabel>
                                    <FormControl>
                                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ── Form Actions ── */}
          <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <HugeiconsIcon icon={Tick02Icon} className="size-4" strokeWidth={2} aria-hidden="true" />
              {isPending ? "Submitting..." : "Submit for Approval"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
