/**
 * Skill Form Page
 *
 * Embeddable full-page form for creating and editing a skill.
 * Uses React Hook Form + Zod, shadcn/ui components, and
 * API-driven categories / work types.
 */

"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { useSkillCategoriesDropdown } from "../../hooks/use-skills";
import { useWorkTypes } from "../../hooks/use-work-types";
import type { SkillApiItem, ProficiencyLevel } from "../../types";

// ─── Schema ───────────────────────────────────────────────────────────────────

const skillFormPageSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(100),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().max(500),
  requiresCertification: z.boolean(),
  certificationValidity: z.number().min(1).max(60).nullable(),
  minimumProficiency: z.enum(["trainee", "competent", "expert"]),
  isActive: z.boolean(),
  skillWorkTypes: z.array(z.string()),
});

export type SkillFormPageValues = z.infer<typeof skillFormPageSchema>;

// ─── Constants ────────────────────────────────────────────────────────────────

const CERT_VALIDITY_OPTIONS = [6, 12, 18, 24, 36];

const PROFICIENCY_OPTIONS: { value: ProficiencyLevel; label: string }[] = [
  { value: "trainee", label: "Trainee (Level 1)" },
  { value: "competent", label: "Competent (Level 2)" },
  { value: "expert", label: "Expert (Level 3)" },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface SkillFormPageProps {
  skill?: SkillApiItem | null;
  onClose: () => void;
  onSave: (data: SkillFormPageValues) => void;
  isPending?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SkillFormPage({
  skill,
  onClose,
  onSave,
  isPending = false,
}: Readonly<SkillFormPageProps>) {
  const isEditMode = !!skill;

  const {
    data: skillCategoriesRes,
    isLoading: skillCategoriesLoading,
    isError: skillCategoriesError,
  } = useSkillCategoriesDropdown();
  const skillCategories = skillCategoriesRes?.data?.items ?? [];

  const {
    data: workTypesRes,
    isLoading: workTypesLoading,
    isError: workTypesError,
  } = useWorkTypes({ isActive: true, limit: 100 });
  const activeWorkTypes = React.useMemo(
    () => workTypesRes?.data?.items ?? [],
    [workTypesRes],
  );

  const workTypesByCategory = React.useMemo(() => {
    const map = new Map<
      string,
      { id: string; name: string; workTypes: typeof activeWorkTypes }
    >();
    for (const wt of activeWorkTypes) {
      const catId = wt.category.id;
      if (!map.has(catId)) {
        map.set(catId, { id: catId, name: wt.category.name, workTypes: [] });
      }
      map.get(catId)!.workTypes.push(wt);
    }
    return Array.from(map.values());
  }, [activeWorkTypes]);

  const form = useForm<SkillFormPageValues>({
    resolver: zodResolver(skillFormPageSchema),
    defaultValues: {
      name: skill?.name ?? "",
      categoryId: skill?.category?.id ?? "",
      description: skill?.description ?? "",
      requiresCertification: skill?.requiresCertification ?? false,
      certificationValidity: skill?.certificationValidity ?? 12,
      minimumProficiency: skill?.minimumProficiency ?? "trainee",
      isActive: skill?.isActive ?? true,
      skillWorkTypes: skill?.skillWorkTypes?.map((rel) => rel.workTypeId) ?? [],
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const requiresCertification = form.watch("requiresCertification");
  const watchedSkillWorkTypes = form.watch("skillWorkTypes");

  const handleWorkTypeToggle = (workTypeId: string) => {
    const current = form.getValues("skillWorkTypes");
    form.setValue(
      "skillWorkTypes",
      current.includes(workTypeId)
        ? current.filter((id) => id !== workTypeId)
        : [...current, workTypeId],
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-xl text-muted-foreground hover:text-foreground"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {isEditMode ? "Edit Skill" : "Add New Skill"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure skill definition and requirements
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Column 1: Basic Information ───────────────────────── */}
            <div className="space-y-5">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-300 text-xs">
                      1
                    </span>
                    Basic Information
                  </h3>

                  <div className="space-y-4">
                    {/* Skill Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">
                            Skill Name *
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Medicare Enrollment" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Category */}
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">
                            Category *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={skillCategoriesLoading || skillCategoriesError}
                          >
                            <FormControl>
                              <SelectTrigger className="cursor-pointer">
                                <SelectValue
                                  placeholder={
                                    skillCategoriesLoading
                                      ? "Loading..."
                                      : skillCategoriesError
                                        ? "Failed to load categories"
                                        : "Select a category"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {skillCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {skillCategoriesError && (
                            <div className="flex items-center gap-2 rounded-md bg-rose-500/10 border border-rose-500/20 p-3 mt-1">
                              <HugeiconsIcon
                                icon={AlertCircleIcon}
                                className="size-3.5 shrink-0 text-rose-400"
                                aria-hidden="true"
                              />
                              <p className="text-xs text-rose-400">
                                Failed to load categories. Please refresh and try again.
                              </p>
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={2}
                              placeholder="What does this skill cover..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ── Column 2: Certification Requirements ──────────────── */}
            <div className="space-y-5">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300 text-xs">
                      2
                    </span>
                    Certification Requirements
                  </h3>

                  <div className="space-y-4">
                    {/* Requires Certification */}
                    <FormField
                      control={form.control}
                      name="requiresCertification"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                            <FormLabel className="text-sm text-foreground cursor-pointer">
                              Requires Certification
                            </FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="cursor-pointer"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Certification Validity (conditional) */}
                    <div className={cn(!requiresCertification && "opacity-50 pointer-events-none")}>
                      <FormField
                        control={form.control}
                        name="certificationValidity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">
                              Certification Validity (months)
                            </FormLabel>
                            <Select
                              onValueChange={(val) => field.onChange(Number(val))}
                              value={field.value?.toString() ?? "12"}
                              disabled={!requiresCertification}
                            >
                              <FormControl>
                                <SelectTrigger className="cursor-pointer">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CERT_VALIDITY_OPTIONS.map((months) => (
                                  <SelectItem key={months} value={months.toString()}>
                                    {months} months
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Minimum Proficiency */}
                    <FormField
                      control={form.control}
                      name="minimumProficiency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">
                            Minimum Proficiency Required *
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="cursor-pointer">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PROFICIENCY_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <p className="text-[10px] text-blue-300">
                        Proficiency determines who can be assigned work requiring this skill.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ── Column 3: Linked Work Types + Status ──────────────── */}
            <div className="space-y-5">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 text-xs">
                      3
                    </span>
                    Linked Work Types
                  </h3>

                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {workTypesLoading && (
                      <p className="text-xs text-muted-foreground py-4 text-center">
                        Loading work types…
                      </p>
                    )}

                    {workTypesError && !workTypesLoading && (
                      <div className="flex items-center gap-2 rounded-md bg-rose-500/10 border border-rose-500/20 p-3">
                        <HugeiconsIcon
                          icon={AlertCircleIcon}
                          className="size-3.5 shrink-0 text-rose-400"
                          aria-hidden="true"
                        />
                        <p className="text-xs text-rose-400">
                          Failed to load work types. Please refresh and try again.
                        </p>
                      </div>
                    )}

                    {!workTypesLoading &&
                      !workTypesError &&
                      workTypesByCategory.map((cat) => (
                        <div key={cat.id} className="mb-2">
                          <p className="text-[10px] text-muted-foreground mb-1">
                            {cat.name}
                          </p>
                          {cat.workTypes.map((wt) => (
                            <label
                              key={wt.id}
                              className="flex items-center gap-2 p-1.5 rounded hover:bg-white/[0.02] cursor-pointer"
                            >
                              <Checkbox
                                checked={watchedSkillWorkTypes.includes(wt.id)}
                                onCheckedChange={() => handleWorkTypeToggle(wt.id)}
                              />
                              <span className="text-xs text-muted-foreground">
                                {wt.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Status */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-bold text-muted-foreground mb-3">Status</h3>
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-sm text-foreground cursor-pointer">
                            Skill Active
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="cursor-pointer"
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
            <div />
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                className="text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="gap-2 text-sm bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600"
              >
                <HugeiconsIcon icon={Tick02Icon} className="size-4" />
                {isPending
                  ? isEditMode ? "Saving…" : "Creating…"
                  : isEditMode ? "Save Changes" : "Create Skill"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
