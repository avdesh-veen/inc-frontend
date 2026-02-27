/**
 * Create Skill Content
 *
 * Full-page form for creating and editing a skill.
 * Data loading is separated from form rendering so that useForm
 * always receives the correct defaultValues on its first call.
 */

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useCreateSkill, useSkillDetail, useUpdateSkill, useSkillCategoriesDropdown } from "../../hooks/use-skills";
import { useWorkTypes } from "../../hooks/use-work-types";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import type { SkillApiItem, SkillCategory, ProficiencyLevel } from "../../types";

// ─── Schema ───────────────────────────────────────────────────────────────────

const createSkillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(100),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().max(500),
  requiresCertification: z.boolean(),
  certificationValidity: z.number().min(1).max(60).nullable(),
  minimumProficiency: z.enum(["trainee", "competent", "expert"]),
  isActive: z.boolean(),
  skillWorkTypes: z.array(z.string()),
});

type CreateSkillFormData = z.infer<typeof createSkillSchema>;

const CERT_VALIDITY_OPTIONS = [6, 12, 18, 24, 36];

const PROFICIENCY_OPTIONS: { value: ProficiencyLevel; label: string }[] = [
  { value: "trainee", label: "Trainee (Level 1)" },
  { value: "competent", label: "Competent (Level 2)" },
  { value: "expert", label: "Expert (Level 3)" },
];

type WorkTypeItem = {
  id: string;
  name: string;
  category: { id: string; name: string };
};

// ─── Loader shell ─────────────────────────────────────────────────────────────

interface CreateSkillContentProps {
  skillId?: string;
  onClose?: () => void;
}

export function CreateSkillContent({ skillId, onClose }: Readonly<CreateSkillContentProps> = {}) {
  const isEditMode = !!skillId;

  const { data: skillDetailRes, isLoading: skillDetailLoading } = useSkillDetail(skillId);
  const skillDetail = skillDetailRes?.data;

  const skillWorkTypeIds: string[] = React.useMemo(() => {
    if (!isEditMode || !skillDetail?.skillWorkTypes?.length) return [];
    return skillDetail.skillWorkTypes.map((rel) => rel.workTypeId).filter(Boolean);
  }, [isEditMode, skillDetail]);

  const { data: skillCategoriesRes, isLoading: skillCategoriesLoading, isError: skillCategoriesError } =
    useSkillCategoriesDropdown();
  const skillCategories = skillCategoriesRes?.data?.items ?? [];

  const { data: workTypesRes, isLoading: workTypesLoading, isError: workTypesError } =
    useWorkTypes({ isActive: true, limit: 100 });
  const activeWorkTypes = workTypesRes?.data?.items ?? [];
  const isLoading =
    skillCategoriesLoading ||
    workTypesLoading ||
    (isEditMode && skillDetailLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">Loading skill…</p>
      </div>
    );
  }

  return (
    <SkillForm
      key={skillId ?? "new"}
      skillId={skillId}
      skillDetail={skillDetail}
      skillWorkTypeIds={skillWorkTypeIds}
      skillCategories={skillCategories}
      skillCategoriesError={skillCategoriesError}
      activeWorkTypes={activeWorkTypes}
      workTypesError={workTypesError}
      onClose={onClose}
    />
  );
}

// ─── Form (only mounts when all data is ready) ────────────────────────────────

interface SkillFormProps {
  skillId?: string;
  skillDetail?: SkillApiItem;
  skillWorkTypeIds: string[];
  skillCategories: SkillCategory[];
  skillCategoriesError: boolean;
  activeWorkTypes: WorkTypeItem[];
  workTypesError: boolean;
  onClose?: () => void;
}

function SkillForm({
  skillId,
  skillDetail,
  skillWorkTypeIds,
  skillCategories,
  skillCategoriesError,
  activeWorkTypes,
  workTypesError,
  onClose,
}: Readonly<SkillFormProps>) {
  const isEditMode = !!skillId && !!skillDetail;
  const router = useRouter();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();

  const activeWorkTypeIds = React.useMemo(
    () => new Set(activeWorkTypes.map((wt) => wt.id)),
    [activeWorkTypes],
  );

  const workTypesByCategory = React.useMemo(() => {
    const map = new Map<string, { id: string; name: string; workTypes: WorkTypeItem[] }>();
    for (const wt of activeWorkTypes) {
      const catId = wt.category.id;
      if (!map.has(catId)) {
        map.set(catId, { id: catId, name: wt.category.name, workTypes: [] });
      }
      map.get(catId)!.workTypes.push(wt);
    }
    return Array.from(map.values());
  }, [activeWorkTypes]);

  // useForm is called once with fully-resolved defaultValues — no resets needed.
  // skillWorkTypeIds comes from the list endpoint (the detail endpoint omits this field).
  const form = useForm<CreateSkillFormData>({
    resolver: zodResolver(createSkillSchema),
    defaultValues: isEditMode && skillDetail
      ? {
          name: skillDetail.name,
          categoryId: skillDetail.category?.id ?? "",
          description: skillDetail.description ?? "",
          requiresCertification: skillDetail.requiresCertification,
          certificationValidity: skillDetail.certificationValidity ?? 12,
          minimumProficiency: skillDetail.minimumProficiency,
          isActive: skillDetail.isActive,
          skillWorkTypes: skillWorkTypeIds,
        }
      : {
          name: "",
          categoryId: "",
          description: "",
          requiresCertification: false,
          certificationValidity: 12,
          minimumProficiency: "trainee",
          isActive: true,
          skillWorkTypes: [],
        },
  });

  // Force-set work types after mount. defaultValues initialises the store, but
  // form.watch can subscribe before the async store update fires, leaving the
  // first render blank. setValue after mount is the reliable fix.
  React.useEffect(() => {
    if (isEditMode) {
      form.setValue("skillWorkTypes", skillWorkTypeIds, { shouldDirty: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requiresCertification = form.watch("requiresCertification");
  const selectedWorkTypes = form.watch("skillWorkTypes") ?? [];

  const handleCancel = () => {
    if (isEditMode && onClose) {
      onClose();
    } else {
      router.push("/settings/workflow/skills");
    }
  };

  const buildPayload = (data: CreateSkillFormData) => ({
    name: data.name,
    categoryId: data.categoryId,
    description: data.description ?? "",
    requiresCertification: data.requiresCertification,
    certificationValidity: data.requiresCertification ? (data.certificationValidity ?? 12) : null,
    minimumProficiency: data.minimumProficiency,
    isActive: data.isActive,
    skillWorkTypes: data.skillWorkTypes.filter((id) => activeWorkTypeIds.has(id)),
  });

  const onSubmit = (data: CreateSkillFormData) => {
    if (isEditMode && skillId) {
      updateSkill.mutate(
        { id: skillId, ...buildPayload(data) },
        { onSuccess: () => (onClose ? onClose() : router.push("/settings/workflow/skills")) },
      );
    } else {
      createSkill.mutate(
        buildPayload(data),
        { onSuccess: () => router.push("/settings/workflow/skills") },
      );
    }
  };

  const isPending = isEditMode ? updateSkill.isPending : createSkill.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="rounded-xl text-muted-foreground hover:text-foreground"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {isEditMode ? "Editing a Skill" : "Add New Skill"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? "Update skill definition and requirements"
              : "Configure skill definition and requirements"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Column 1: Basic Information ─────────────────────────── */}
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
                            disabled={skillCategoriesError}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    skillCategoriesError
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
                              <HugeiconsIcon icon={AlertCircleIcon} className="size-3.5 shrink-0 text-rose-400" aria-hidden="true" />
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

            {/* ── Column 2: Certification Requirements ────────────────── */}
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
                    {/* Requires Certification Toggle */}
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
                                <SelectTrigger>
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

                    {/* Minimum Proficiency Required */}
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
                              <SelectTrigger>
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

                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 mt-3">
                      <p className="text-[10px] text-blue-300">
                        Proficiency determines who can be assigned work requiring this skill.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ── Column 3: Linked Work Types + Status ────────────────── */}
            <div className="space-y-5">
              {/* Linked Work Types */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 text-xs">
                      3
                    </span>
                    Linked Work Types
                  </h3>

                  <FormField
                    control={form.control}
                    name="skillWorkTypes"
                    render={({ field: _field }) => (
                      <FormItem>
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {workTypesError && (
                            <div className="flex items-center gap-2 rounded-md bg-rose-500/10 border border-rose-500/20 p-3">
                              <HugeiconsIcon icon={AlertCircleIcon} className="size-3.5 shrink-0 text-rose-400" aria-hidden="true" />
                              <p className="text-xs text-rose-400">
                                Failed to load work types. Please refresh and try again.
                              </p>
                            </div>
                          )}

                          {!workTypesError && workTypesByCategory.map((cat) => (
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
                                    checked={selectedWorkTypes.includes(wt.id)}
                                    onCheckedChange={(checked) => {
                                      form.setValue(
                                        "skillWorkTypes",
                                        checked
                                          ? [...selectedWorkTypes, wt.id]
                                          : selectedWorkTypes.filter((id) => id !== wt.id),
                                        { shouldDirty: true, shouldValidate: true },
                                      );
                                    }}
                                  />
                                  <span className="text-xs text-muted-foreground">
                                    {wt.name}
                                  </span>
                                </label>
                              ))}
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                onClick={handleCancel}
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
